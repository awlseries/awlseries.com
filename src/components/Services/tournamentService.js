// /src/components/Services/tournamentService.js
import { supabase } from '../../supabase';

export class TournamentService {
  
  // ==================== ОСНОВНЫЕ МЕТОДЫ ТУРНИРОВ ====================
  
  /**
   * Получить все турниры с фильтрацией
   */
  async getTournaments(filters = {}) {
    try {
      let query = supabase
        .from('tournaments')
        .select(`
          *,
          tournament_translations (*)
        `);
      
      // Фильтрация по статусу
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      // Фильтрация по игре
      if (filters.game) {
        query = query.eq('game', filters.game);
      }
      
      // Для не-админов скрываем черновики
      const isAdmin = await this.isUserAdmin();
      if (!filters.showAll && !isAdmin) {
        query = query.neq('status', 'draft');
      }
      
      // Сортировка
      if (filters.sortBy) {
        query = query.order(filters.sortBy, { 
          ascending: filters.sortAsc !== false 
        });
      } else {
        query = query.order('tournament_start', { ascending: true });
      }
      
      // Пагинация
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
      
    } catch (error) {
      console.error('❌ Ошибка загрузки турниров:', error);
      throw error;
    }
  }

  /* Получить турниры в формате для карточек */
async getTournamentCards(limit = 10, status = null) {
  try {
    let query = supabase
      .from('tournaments')
      .select('*')
      .neq('status', 'draft')
      .order('tournament_start', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Трансформируем данные в формат для карточек
    const tournamentsWithNames = await Promise.all(
      (data || []).map(async (tournament) => {
        // Получаем русский перевод названия если есть
        const ruTranslation = await this.getTournamentTranslation(tournament.id, 'ru');
        
        // ОБРАБОТКА PARTNERS - ОСНОВНОЕ ИСПРАВЛЕНИЕ
        let partners = [];
        try {
          if (tournament.partners) {
            // Случай 1: Если это уже массив объектов
            if (Array.isArray(tournament.partners)) {
              partners = tournament.partners;
            }
            // Случай 2: Если это объект с массивом внутри
            else if (tournament.partners && typeof tournament.partners === 'object') {
              // Проверяем все возможные ключи
              const possibleKeys = ['partners', 'items', 'data', 'list', 'logos'];
              for (const key of possibleKeys) {
                if (Array.isArray(tournament.partners[key])) {
                  partners = tournament.partners[key];
                  break;
                }
              }
              
              // Если не нашли массив по ключам, преобразуем значения объекта в массив
              if (partners.length === 0) {
                partners = Object.values(tournament.partners).filter(item => 
                  item && typeof item === 'object' && item.logo
                );
              }
            }
            
            // Убедимся что partners - массив
            if (!Array.isArray(partners)) {
              console.warn('⚠️ partners не массив:', partners);
              partners = [];
            }
          }
        } catch (e) {
          console.error('❌ Ошибка обработки partners:', e);
          partners = [];
        }

        console.log(`✅ Турнир ${tournament.id} - партнеры:`, partners);

        return {
          id: tournament.id,
          name: ruTranslation?.name || tournament.name,
          slug: tournament.slug,
          game: tournament.game,
          status: tournament.status,
          date: this.formatTournamentDate(tournament.tournament_start),
          registrationStart: tournament.registration_start,
          registrationEnd: tournament.registration_end,
          prize: tournament.prize_pool > 0 ? `$${tournament.prize_pool}` : 'Бесплатно',
          teams: `${tournament.current_teams || 0}/${tournament.max_teams || 16}`,
          image: tournament.banner_image || '/images/banners/tournament-promo-logo-1.jpg',
          league: this.extractLeagueFromName(tournament.name),
          partners: partners
        };
      })
    );
    
    return tournamentsWithNames;
    
  } catch (error) {
    console.error('❌ Ошибка загрузки карточек турниров:', error);
    throw error;
  }
}

/**
 * Получить перевод турнира для конкретного языка
 */
async getTournamentTranslation(tournamentId, language = 'ru') {
  try {
    const { data, error } = await supabase
      .from('tournament_translations')
      .select('name, description, rules_text')
      .eq('tournament_id', tournamentId)
      .eq('language', language)
      .single();
    
    if (error) {
      // Если перевод не найден - возвращаем null
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    return data;
    
  } catch (error) {
    console.error(`❌ Ошибка загрузки перевода турнира ${tournamentId}:`, error);
    return null;
  }
}

/**
 * Получить все переводы турнира
 */
async getTournamentTranslations(tournamentId) {
  try {
    const { data, error } = await supabase
      .from('tournament_translations')
      .select('*')
      .eq('tournament_id', tournamentId);
    
    if (error) throw error;
    
    // Преобразуем в объект { language: data }
    const translations = {};
    data?.forEach(translation => {
      translations[translation.language] = {
        name: translation.name,
        description: translation.description,
        rules_text: translation.rules_text
      };
    });
    
    return translations;
    
  } catch (error) {
    console.error(`❌ Ошибка загрузки переводов турнира ${tournamentId}:`, error);
    return {};
  }
}

/**
 * Создать переводы турнира
 */
async createTranslations(tournamentId, translations) {
  try {
    const translationRecords = Object.entries(translations)
      .filter(([lang, data]) => data && data.name) // Только с названием
      .map(([language, data]) => ({
        tournament_id: tournamentId,
        language,
        name: data.name || '',
        description: data.description || '',
        rules_text: data.rules_text || ''
      }));
    
    if (translationRecords.length === 0) {
      console.log('⚠️ Нет данных для переводов');
      return;
    }
    
    const { error } = await supabase
      .from('tournament_translations')
      .insert(translationRecords);
    
    if (error) throw error;
    
    console.log(`✅ Переводы созданы для турнира ${tournamentId}`);
    
  } catch (error) {
    console.error(`❌ Ошибка создания переводов турнира ${tournamentId}:`, error);
    throw error;
  }
}

/**
 * Обновить переводы турнира
 */
async updateTranslations(tournamentId, translations) {
  try {
    // Сначала удаляем старые переводы
    const { error: deleteError } = await supabase
      .from('tournament_translations')
      .delete()
      .eq('tournament_id', tournamentId);
    
    if (deleteError) throw deleteError;
    
    // Затем создаем новые
    if (translations && Object.keys(translations).length > 0) {
      await this.createTranslations(tournamentId, translations);
    }
    
    console.log(`✅ Переводы обновлены для турнира ${tournamentId}`);
    
  } catch (error) {
    console.error(`❌ Ошибка обновления переводов турнира ${tournamentId}:`, error);
    throw error;
  }
}

/**
 * Форматирование даты для отображения
 */
formatTournamentDate(dateString) {
  if (!dateString) return 'Дата не указана';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Дата не указана';
    
    const months = [
      'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
      'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  } catch (error) {
    return 'Дата не указана';
  }
}

/**
 * Извлечение лиги из названия
 */
extractLeagueFromName(name) {
  const leaguePatterns = {
    'AWL': /AWL/i,
    'ESL': /ESL/i,
    'VCT': /VCT/i,
    'DPC': /DPC/i,
    'BLAST': /BLAST/i,
    'IEM': /IEM/i
  };
  
  for (const [league, pattern] of Object.entries(leaguePatterns)) {
    if (pattern.test(name)) return league;
  }
  
  return 'AWL'; // Дефолтное значение
}
  
  /**
   * Получить турнир по slug (для публичной страницы)
   */
  async getTournament(slug) {
    try {
      const { data: tournament, error: tournamentError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (tournamentError) throw tournamentError;
      
      // Проверяем доступность (черновики видны только админам)
      const isAdmin = await this.isUserAdmin();
      if (tournament.status === 'draft' && !isAdmin) {
        throw new Error('Турнир не найден');
      }
      
      // Загружаем связанные данные
      const [
        translations,
        teams,
        standings,
        lookingPlayers
      ] = await Promise.all([
        this.getTournamentTranslations(tournament.id),
        this.getTournamentTeams(tournament.id),
        this.getTournamentStandings(tournament.id),
      ]);
      
      return {
        ...tournament,
        translations,
        teams,
        standings,
        lookingPlayers,
        canRegister: this.canRegister(tournament)
      };
      
    } catch (error) {
      console.error(`❌ Ошибка загрузки турнира ${slug}:`, error);
      throw error;
    }
  }
  
  /**
   * Получить турнир по ID (для внутреннего использования)
   */
  async getTournamentById(id) {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
      
    } catch (error) {
      console.error(`❌ Ошибка загрузки турнира ${id}:`, error);
      throw error;
    }
  }

  /* ---------------------------------------------------- Загрузить баннер турнира в Supabase Storage */
  
async uploadTournamentBanner(file, tournamentId) {
  try {
    // Проверяем права админа
    const isAdmin = await this.isUserAdmin();
    if (!isAdmin) {
      throw new Error('Только администраторы могут загружать баннеры');
    }

    // Проверяем тип файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Разрешены только JPEG, PNG и WebP файлы');
    }

    // Проверяем размер файла (макс 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`Размер файла превышает 5MB. Текущий размер: ${Math.round(file.size / 1024)}KB`);
    }

    // Генерируем имя файла
    const fileExt = file.name.split('.').pop().toLowerCase();
    const fileName = `banner-${tournamentId}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    // Загружаем файл
    const { data, error } = await supabase.storage
      .from('tournament-banners')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Получаем публичный URL
    const { data: { publicUrl } } = supabase.storage
      .from('tournament-banners')
      .getPublicUrl(filePath);

    console.log('✅ Баннер загружен:', publicUrl);
    return publicUrl;

  } catch (error) {
    console.error('❌ Ошибка загрузки баннера:', error);
    throw error;
  }
}

/**
 * Удалить баннер турнира
 */
async deleteTournamentBanner(fileUrl) {
  try {
    // Извлекаем путь из URL
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.indexOf('tournament-banners');
    
    if (bucketIndex === -1) {
      throw new Error('Неверный URL баннера');
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/');

    const { error } = await supabase.storage
      .from('tournament-banners')
      .remove([filePath]);

    if (error) throw error;

    console.log('✅ Баннер удален:', filePath);
    return true;

  } catch (error) {
    console.error('❌ Ошибка удаления баннера:', error);
    throw error;
  }
}
  
  /* ---------------------------------------------------- Создать новый турнир (только для админов) */
  async createTournament(data) {
    try {
      // Проверяем права админа
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        throw new Error('Только администраторы могут создавать турниры');
      }
      
      // Проверяем авторизацию
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      // Отделяем translations от данных турнира
      const { translations, ...tournamentData } = data;
      
      // Генерируем slug если не указан
      if (!tournamentData.slug && tournamentData.name) {
        tournamentData.slug = this.generateSlug(tournamentData.name);
      }
      
      // Проверяем уникальность slug
      const existing = await supabase
        .from('tournaments')
        .select('id')
        .eq('slug', tournamentData.slug)
        .single();
      
      if (existing.data) {
        throw new Error('Турнир с таким URL-адресом уже существует');
      }
      
      // Добавляем метаданные
      tournamentData.created_by = user.id;
      tournamentData.status = tournamentData.status || 'draft';
      tournamentData.current_teams = 0;
      
      // Устанавливаем дефолтные значения для JSON полей
      tournamentData.rules = tournamentData.rules || {};
      tournamentData.scoring_system = tournamentData.scoring_system || {};
      tournamentData.schedule = tournamentData.schedule || [];
      
      // Создаем турнир БЕЗ translations
      const { data: createdTournament, error } = await supabase
        .from('tournaments')
        .insert([tournamentData])
        .select()
        .single();
      
      if (error) throw error;
      
      // Создаем переводы если есть (используем отделенную переменную translations)
      if (translations && Object.keys(translations).length > 0) {
        await this.createTranslations(createdTournament.id, translations);
      }
      
      console.log('✅ Турнир создан:', createdTournament.id);
      return createdTournament;
      
    } catch (error) {
      console.error('❌ Ошибка создания турнира:', error);
      throw error;
    }
  }
  
  /**
   * Обновить турнир (только для админов)
   */
  async updateTournament(id, updates) {
    try {
      // Проверяем права админа
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        throw new Error('Только администраторы могут обновлять турниры');
      }
      
       // Убираем поля, которые нельзя обновлять
    const { created_by, created_at, translations, ...safeUpdates } = updates;
      
      const { data, error } = await supabase
        .from('tournaments')
        .update(safeUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
      
    } catch (error) {
      console.error(`❌ Ошибка обновления турнира ${id}:`, error);
      throw error;
    }
  }

  /* ---------------------------------------------------- Полностью удалить турнир со всеми связанными данными */
  
async deleteTournament(id, options = {}) {
  try {
    // Проверяем права админа
    const isAdmin = await this.isUserAdmin();
    if (!isAdmin) {
      throw new Error('Только администраторы могут удалять турниры');
    }
    
    // Получаем турнир для получения информации о файлах
    const { data: tournament, error: fetchError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw new Error('Турнир не найден');
      }
      throw fetchError;
    }
    
    // 1. Удаляем медиафайлы (баннеры)
    if (tournament.banner_image) {
      try {
        await this.deleteTournamentBanner(tournament.banner_image);
        console.log(`✅ Баннер удален: ${tournament.banner_image}`);
      } catch (bannerError) {
        console.warn(`⚠️ Не удалось удалить баннер: ${bannerError.message}`);
      }
    }
    
    // 2. Удаляем логотипы партнеров
    if (tournament.partners && Array.isArray(tournament.partners)) {
      for (const partner of tournament.partners) {
        if (partner.logo) {
          try {
            await this.deletePartnerLogo(partner.logo);
            console.log(`✅ Логотип партнера удален: ${partner.logo}`);
          } catch (logoError) {
            console.warn(`⚠️ Не удалось удалить логотип партнера: ${logoError.message}`);
          }
        }
      }
    }
    
    // 3. Удаляем файлы из Storage для турнира (если есть папка)
    try {
      const { data: files } = await supabase.storage
        .from('tournament-partners')
        .list(id.toString());
      
      if (files && files.length > 0) {
        const filesToDelete = files.map(file => `${id}/${file.name}`);
        await supabase.storage
          .from('tournament-partners')
          .remove(filesToDelete);
        console.log(`✅ Удалены файлы партнеров турнира ${id}`);
      }
    } catch (storageError) {
      console.warn(`⚠️ Ошибка при удалении файлов партнеров: ${storageError.message}`);
    }
    
    // 4. Удаляем переводы
    const { error: translationsError } = await supabase
      .from('tournament_translations')
      .delete()
      .eq('tournament_id', id);
    
    if (translationsError) throw translationsError;
    console.log(`✅ Переводы турнира ${id} удалены`);
    
    // 5. Удаляем результаты (standings)
    const { error: standingsError } = await supabase
      .from('tournament_standings')
      .delete()
      .eq('tournament_id', id);
    
    if (standingsError) throw standingsError;
    console.log(`✅ Результаты турнира ${id} удалены`);
    
    // 6. Удаляем команды
    const { error: teamsError } = await supabase
      .from('tournament_teams')
      .delete()
      .eq('tournament_id', id);
    
    if (teamsError) throw teamsError;
    console.log(`✅ Команды турнира ${id} удалены`);
    
    // 7. Удаляем сам турнир
    const { error: tournamentError } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id);
    
    if (tournamentError) throw tournamentError;
    console.log(`✅ Турнир ${id} удален`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Ошибка полного удаления турнира ${id}:`, error);
    throw error;
  }
}

/**
 * Проверить наличие зависимостей у турнира
 */
async checkTournamentDependencies(tournamentId) {
  try {
    // Проверяем команды
    const { count: teamsCount, error: teamsError } = await supabase
      .from('tournament_teams')
      .select('*', { count: 'exact', head: true })
      .eq('tournament_id', tournamentId);
    
    // Проверяем результаты
    const { count: standingsCount, error: standingsError } = await supabase
      .from('tournament_standings')
      .select('*', { count: 'exact', head: true })
      .eq('tournament_id', tournamentId);
    
    if (teamsError) console.error('Ошибка проверки команд:', teamsError);
    if (standingsError) console.error('Ошибка проверки результатов:', standingsError);
    
    return {
      teamsCount: teamsCount || 0,
      standingsCount: standingsCount || 0,
      hasDependencies: (teamsCount || 0) > 0 || (standingsCount || 0) > 0
    };
    
  } catch (error) {
    console.error('Ошибка проверки зависимостей:', error);
    return { teamsCount: 0, standingsCount: 0, hasDependencies: false };
  }
}
  
  /**
   * Обновить статус турнира
   */
  async updateTournamentStatus(id, status) {
    const validStatuses = ['draft', 'upcoming', 'registration', 'live', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new Error(`Неверный статус. Допустимые значения: ${validStatuses.join(', ')}`);
    }
    
    return this.updateTournament(id, { status });
  }

  /* ---------------------------------------------- Загрузить логотип партнера в Supabase Storage */

async uploadPartnerLogo(file, tournamentId, partnerName) {
  try {
    // Проверяем права админа
    const isAdmin = await this.isUserAdmin();
    if (!isAdmin) {
      throw new Error('Только администраторы могут загружать логотипы');
    }

    // Проверяем тип файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Разрешены только JPEG, PNG, WebP и SVG файлы');
    }

    // Проверяем размер файла (макс 2MB)
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`Размер файла превышает 2MB. Текущий размер: ${Math.round(file.size / 1024)}KB`);
    }

    // Генерируем безопасное имя файла
    const safeName = partnerName
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 50);

    const fileExt = file.name.split('.').pop().toLowerCase();
    const fileName = `${safeName}-${Date.now()}.${fileExt}`;
    const filePath = `${tournamentId}/${fileName}`;

    // Загружаем файл
    const { data, error } = await supabase.storage
      .from('tournament-partners')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Получаем публичный URL
    const { data: { publicUrl } } = supabase.storage
      .from('tournament-partners')
      .getPublicUrl(filePath);

    console.log('✅ Логотип загружен:', publicUrl);
    return publicUrl;

  } catch (error) {
    console.error('❌ Ошибка загрузки логотипа:', error);
    throw error;
  }
}

/* Удалить логотип партнера */
async deletePartnerLogo(fileUrl) {
  try {
    // Извлекаем путь из URL
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.indexOf('tournament-partners');
    
    if (bucketIndex === -1) {
      throw new Error('Неверный URL логотипа');
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/');

    const { error } = await supabase.storage
      .from('tournament-partners')
      .remove([filePath]);

    if (error) throw error;

    console.log('✅ Логотип удален:', filePath);
    return true;

  } catch (error) {
    console.error('❌ Ошибка удаления логотипа:', error);
    throw error;
  }
}
  
  // ==================== РЕГИСТРАЦИЯ КОМАНД ====================
  
  /**
   * Зарегистрировать команду на турнир
   */
  async registerTeam(tournamentId, teamData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');
      
      // Получаем турнир для проверок
      const tournament = await this.getTournamentById(tournamentId);
      
      // Проверяем возможность регистрации
      if (!this.canRegister(tournament)) {
        throw new Error('Регистрация на этот турнир закрыта');
      }
      
      // Проверяем, не зарегистрирован ли уже
      const { data: existingTeam } = await supabase
        .from('tournament_teams')
        .select('id')
        .eq('tournament_id', tournamentId)
        .eq('captain_id', user.id)
        .single();
      
      if (existingTeam) {
        throw new Error('Вы уже зарегистрировали команду в этом турнире');
      }
      
      // Подготавливаем данные команды
      const teamDataWithDefaults = {
        tournament_id: tournamentId,
        captain_id: user.id,
        team_name: teamData.team_name.trim(),
        team_tag: teamData.team_tag?.trim().toUpperCase() || null,
        team_logo: teamData.team_logo || '/images/icons/logo-opponent.png',
        players: teamData.players || [],
        status: 'pending',
        registration_date: new Date().toISOString()
      };
      
      // Валидация названия команды
      if (!teamDataWithDefaults.team_name || teamDataWithDefaults.team_name.length < 2) {
        throw new Error('Название команды должно содержать минимум 2 символа');
      }
      
      // Проверяем уникальность названия в турнире
      const { data: existingName } = await supabase
        .from('tournament_teams')
        .select('id')
        .eq('tournament_id', tournamentId)
        .eq('team_name', teamDataWithDefaults.team_name)
        .single();
      
      if (existingName) {
        throw new Error('Команда с таким названием уже зарегистрирована');
      }
      
      // Регистрируем команду
      const { data, error } = await supabase
        .from('tournament_teams')
        .insert([teamDataWithDefaults])
        .select()
        .single();
      
      if (error) throw error;
      
      // Асинхронно обновляем счетчик команд
      this.updateTeamCount(tournamentId).catch(console.error);
      
      console.log('✅ Команда зарегистрирована:', data.id);
      return data;
      
    } catch (error) {
      console.error('❌ Ошибка регистрации команды:', error);
      throw error;
    }
  }
  
  /**
   * Получить команды турнира
   */
  async getTournamentTeams(tournamentId, status = null) {
    try {
      let query = supabase
        .from('tournament_teams')
        .select('*')
        .eq('tournament_id', tournamentId);
      
      if (status) {
        query = query.eq('status', status);
      } else {
        // По умолчанию показываем только подтвержденные команды
        query = query.in('status', ['approved', 'active']);
      }
      
      query = query.order('registration_date', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
      
    } catch (error) {
      console.error(`❌ Ошибка загрузки команд турнира ${tournamentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Обновить статус команды (админ)
   */
  async updateTeamStatus(teamId, status) {
    try {
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        throw new Error('Только администраторы могут изменять статус команд');
      }
      
      const validStatuses = ['pending', 'approved', 'rejected', 'disqualified'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Неверный статус. Допустимые значения: ${validStatuses.join(', ')}`);
      }
      
      const { data, error } = await supabase
        .from('tournament_teams')
        .update({ status })
        .eq('id', teamId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Обновляем счетчик команд если статус изменился
      if (['approved', 'rejected', 'disqualified'].includes(status)) {
        const tournamentId = data.tournament_id;
        this.updateTeamCount(tournamentId).catch(console.error);
      }
      
      return data;
      
    } catch (error) {
      console.error(`❌ Ошибка обновления статуса команды ${teamId}:`, error);
      throw error;
    }
  }
  
  // ==================== ТАБЛИЦА РЕЗУЛЬТАТОВ ====================
  
  /**
   * Получить таблицу результатов турнира
   */
  async getTournamentStandings(tournamentId) {
    try {
      const { data, error } = await supabase
        .from('tournament_standings')
        .select(`
          *,
          tournament_teams!inner (
            id,
            team_name,
            team_tag,
            team_logo,
            captain_id,
            players
          )
        `)
        .eq('tournament_id', tournamentId)
        .order('rank', { ascending: true })
        .order('points', { ascending: false });
      
      if (error) throw error;
      return data || [];
      
    } catch (error) {
      console.error(`❌ Ошибка загрузки таблицы результатов ${tournamentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Обновить результаты команды (админ)
   */
  async updateStanding(tournamentId, teamId, standingsData) {
    try {
      const isAdmin = await this.isUserAdmin();
      if (!isAdmin) {
        throw new Error('Только администраторы могут обновлять результаты');
      }
      
      // Ищем существующую запись
      const { data: existing } = await supabase
        .from('tournament_standings')
        .select('id')
        .eq('tournament_id', tournamentId)
        .eq('team_id', teamId)
        .single();
      
      if (existing) {
        // Обновляем существующую
        const { data, error } = await supabase
          .from('tournament_standings')
          .update(standingsData)
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Создаем новую
        const { data, error } = await supabase
          .from('tournament_standings')
          .insert([{
            tournament_id: tournamentId,
            team_id: teamId,
            ...standingsData
          }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
      
    } catch (error) {
      console.error(`❌ Ошибка обновления результатов:`, error);
      throw error;
    }
  }
  
  // ==================== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ====================
  
  /**
   * Проверить, является ли пользователь админом
   */
  async isUserAdmin() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Ошибка проверки прав админа:', error);
        return false;
      }
      
      return data?.is_admin === true;
      
    } catch (error) {
      console.error('❌ Ошибка проверки прав админа:', error);
      return false;
    }
  }
  
  /* ------------------------------------------------ Проверка возможности регистрации на турнир */
  canRegister(tournament) {
  if (!tournament) {
    return {
      allowed: false,
      status: 'unavailable',
      message: 'Турнир не найден'
    };
  }
  
  const now = new Date();
  const tournamentStart = new Date(tournament.tournament_start);
  const registrationStart = tournament.registration_start ? new Date(tournament.registration_start) : null;
  const registrationEnd = tournament.registration_end ? new Date(tournament.registration_end) : null;
  
  // 1. Проверяем статус турнира
  if (tournament.status === 'completed' || tournament.status === 'cancelled') {
    return {
      allowed: false,
      status: 'finished',
      message: 'Турнир завершен'
    };
  }
  
  if (tournament.status === 'live') {
    return {
      allowed: false,
      status: 'in_progress',
      message: 'Регистрация завершена'
    };
  }
  
  if (tournament.status === 'draft') {
    return {
      allowed: false,
      status: 'draft',
      message: 'Турнир в разработке'
    };
  }

  // 2. Проверяем статус 'upcoming' (Предстоящий)
  if (tournament.status === 'upcoming') {
    // Предстоящий турнир - регистрация недоступна по умолчанию
    return {
      allowed: false,
      status: 'registration_unavailable',
      message: 'Регистрация недоступна'
    };
  }
  
  // 3. Проверяем статус 'registration' (Регистрация открыта)
  if (tournament.status === 'registration') {
    // Проверяем даты регистрации
    if (registrationStart && now < registrationStart) {
      return {
        allowed: false,
        status: 'registration_not_started',
        message: 'Регистрация еще не началась'
      };
    }
    
    if (registrationEnd && now > registrationEnd) {
      return {
        allowed: false,
        status: 'registration_closed',
        message: 'Регистрация завершена'
      };
    }
    
    // Проверяем количество команд
    if (tournament.current_teams >= tournament.max_teams) {
      return {
        allowed: false,
        status: 'full',
        message: 'Все места заняты'
      };
    }
    
    // Регистрация открыта
    return {
      allowed: true,
      status: 'registration_open',
      message: 'Присоединиться'
    };
  }
  
  // 4. Проверяем даты для других статусов
  if (tournamentStart && now > tournamentStart) {
    return {
      allowed: false,
      status: 'tournament_started',
      message: 'Турнир уже начался'
    };
  }
  
  // 5. Проверяем количество команд
  if (tournament.current_teams >= tournament.max_teams) {
    return {
      allowed: false,
      status: 'full',
      message: 'Все места заняты'
    };
  }
  
  // 6. По умолчанию - регистрация недоступна
  return {
    allowed: false,
    status: 'registration_unavailable',
    message: 'Регистрация недоступна'
  };
}
  
  /* --------------------------------------------------------------- Обновление счетчика команд турнира */
  async updateTeamCount(tournamentId) {
    try {
      // Считаем только подтвержденные команды
      const { count, error } = await supabase
        .from('tournament_teams')
        .select('*', { count: 'exact', head: true })
        .eq('tournament_id', tournamentId)
        .eq('status', 'approved');
      
      if (error) throw error;
      
      await supabase
        .from('tournaments')
        .update({ current_teams: count })
        .eq('id', tournamentId);
      
      console.log(`✅ Обновлен счетчик команд турнира ${tournamentId}: ${count}`);
      
    } catch (error) {
      console.error(`❌ Ошибка обновления счетчика команд ${tournamentId}:`, error);
      // Не выбрасываем ошибку, чтобы не ломать основной поток
    }
  }
  
  /**
   * Получить переводы турнира
   */
  async getTournamentTranslations(tournamentId) {
    try {
      const { data, error } = await supabase
        .from('tournament_translations')
        .select('*')
        .eq('tournament_id', tournamentId);
      
      if (error) throw error;
      
      // Преобразуем в объект { language: data }
      const translations = {};
      data?.forEach(translation => {
        translations[translation.language] = {
          name: translation.name,
          description: translation.description,
          rules_text: translation.rules_text
        };
      });
      
      return translations;
      
    } catch (error) {
      console.error(`❌ Ошибка загрузки переводов турнира ${tournamentId}:`, error);
      return {};
    }
  }
  
  /**
   * Создать переводы турнира
   */
  async createTranslations(tournamentId, translations) {
    try {
      const translationRecords = Object.entries(translations).map(([lang, data]) => ({
        tournament_id: tournamentId,
        language: lang,
        ...data
      }));
      
      const { error } = await supabase
        .from('tournament_translations')
        .insert(translationRecords);
      
      if (error) throw error;
      
    } catch (error) {
      console.error(`❌ Ошибка создания переводов турнира ${tournamentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Генерация slug из названия
   */
  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Убираем спецсимволы
      .replace(/\s+/g, '-')     // Заменяем пробелы на дефисы
      .replace(/--+/g, '-')     // Убираем двойные дефисы
      .trim();
  }
  
  /**
   * Загрузить изображение турнира
   */
  async uploadTournamentImage(file, tournamentId) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${tournamentId}-${Date.now()}.${fileExt}`;
      const filePath = `tournaments/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('tournament-images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Получаем публичный URL
      const { data: { publicUrl } } = supabase.storage
        .from('tournament-images')
        .getPublicUrl(filePath);
      
      return publicUrl;
      
    } catch (error) {
      console.error('❌ Ошибка загрузки изображения:', error);
      throw error;
    }
  }
}

// Создаем и экспортируем экземпляр сервиса
export const tournamentService = new TournamentService();