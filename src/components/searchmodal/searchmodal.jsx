import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { showSingleNotification } from '/utils/notifications';
import { useLanguage } from '/utils/language-context.jsx';
import '/src/styles.css';

const SearchModal = ({ isOpen, onClose, onSearch }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const contentRef = useRef(null);
  const inputRef = useRef(null);
  const { t, currentLanguage } = useLanguage();

  // Карта страниц с ключевыми словами для поиска (без вызовов t() на верхнем уровне)
  const componentMap = useMemo(() => ({
    '/': {
      name: t('search_pages.home'),
      nameEn: 'Home',
      keywords: [
        'главная', 'home', 'main', 'начало', 'start', 'старт', 
        'добро пожаловать', 'welcome', 'приветствие', 'greeting',
        'турниры', 'tournaments', 'расписание', 'schedule', 'календарь', 'calendar',
        'события', 'events', 'мероприятия', 'activities',
        'баннер', 'banner', 'новости', 'news', 'анонсы', 'announcements',
        'обновления', 'updates', 'анонс', 'announcement',
        'лига', 'league', 'киберспорт', 'esports', 'соревнования', 'competitions',
        'arena warborn', 'awl', 'арена варборн',
        'участвовать', 'participate',
        'registration', 'вступить', 'enter',
        'сообщество', 'community', 'комьюнити', 'дискорд', 'discord',
        'вк', 'vk', 'youtube', 'ютуб',
        'технические работы', 'technical works', 'обработка запроса', 'request processing',
        'обслуживание', 'maintenance'
      ],
      description: t('search_pages.home_description'),
      descriptionEn: 'Home page with information about the league, upcoming events and news'
    },

    '/tournaments': {
      name: t('search_pages.tournaments'),
      nameEn: 'Tournaments', 
      keywords: [
        'турниры', 'tournaments', 'соревнования', 'competitions', 'чемпионат', 'championship',
        'чемпионаты', 'championships', 'матчи', 'matches', 'игры', 'games',
        'встречи', 'meetings', 'баттлы', 'battles', 'противостояния', 'confrontations',
        'расписание', 'schedule', 'график', 'timetable', 'календарь', 'calendar',
        'даты', 'dates', 'время', 'time', 'participants',
        'команды', 'teams', 'игроки', 'players', 'tournament participants',
        'призы', 'prizes', 'награды', 'awards', 'призовой фонд', 'prize pool',
        'деньги', 'money', 'правила', 'rules', 'регламент', 'regulations',
        'формат', 'format', 'система проведения', 'tournament system',
        'групповая стадия', 'group stage', 'плейофф', 'playoff', 'финал', 'final',
        'полуфинал', 'semifinal', 'квалификация', 'qualification',
        'отборочные', 'qualifiers', 'квалификационные матчи', 'qualifying matches',
        'трансляции', 'broadcasts', 'стримы', 'streams', 'прямые эфиры', 'live streams'
      ],
      description: t('search_pages.tournaments_description'),
      descriptionEn: 'Section with information about current and upcoming tournaments'
    },

    '/teams': {
      name: t('search_pages.teams'),
      nameEn: 'Teams',
      keywords: [
        'команды', 'teams', 'клубы', 'clubs', 'организации', 'organizations',
        'коллективы', 'collectives', 'игроки', 'players', 'participants',
        'профили игроков', 'player profiles', 'киберспортсмены', 'esports athletes',
        'составы', 'rosters', 'ростеры', 'линейки', 'lineups',
        'roster', 'ростер', 'team members', 'кланы', 'clans', 'гильдии', 'guilds',
        'альянсы', 'alliances', 'объединения', 'unions', 'рекрутинг', 'recruiting',
        'поиск игроков', 'player search', 'набор', 'recruitment', 'вакансии', 'vacancies',
        'статистика команд', 'team statistics',
        'история выступлений', 'performance history', 'достижения команд', 'team achievements',
        'трофеи', 'trophies', 'награды команд', 'team awards', 'капитан', 'captain',
        'лидер', 'leader', 'основатель', 'founder', 'руководитель', 'manager',
        'стратегии', 'strategies', 'тактики', 'tactics', 'игровой стиль', 'playstyle',
        'подход', 'approach'
      ],
      description: t('search_pages.teams_description'),
      descriptionEn: 'Information about teams and league players'
    },

    '/rating': {
      name: t('search_pages.rating'),
      nameEn: 'Rating',
      keywords: [
        'рейтинг', 'rating', 'ранг', 'rank', 'место', 'place', 'позиция', 'position',
        'топ', 'top', 'лидеры', 'leaders', 'лучшие', 'best', 'первые', 'first',
        'чемпионы', 'champions', 'статистика', 'statistics', 'стата', 'stats',
        'показатели', 'metrics', 'метрики', 'данные', 'data', 'очки', 'points',
        'баллы', 'scores', 'рейтинговые очки', 'rating points', 'места', 'places',
        'позиции', 'positions', 'строчка', 'line', 'строчка рейтинга', 'rating line',
        'mmr', 'рейтинг матчмейкинга', 'matchmaking rating', 'прогресс', 'progress',
        'рост', 'growth', 'улучшение', 'improvement', 'развитие', 'development',
        'сравнение', 'comparison', 'сопоставление', 'matching', 'рейтинг игроков', 'player rating',
        'рейтинг команд', 'team rating', 'топ игроки', 'top players', 'топ команды', 'top teams',
        'история рейтинга', 'rating history', 'изменения', 'changes', 'динамика', 'dynamics'
      ],
      description: t('search_pages.rating_description'),
      descriptionEn: 'Player and team ratings'
    },

    '/profile': {
      name: t('search_pages.profile'),
      nameEn: 'Profile',
      keywords: [
        'профиль', 'profile', 'аккаунт', 'account', 'настройки', 'settings',
        'статистика', 'statistics', 'достижения', 'achievements', 'личный кабинет', 'personal account',
        'ник', 'nickname', 'nick', 'имя игрока', 'player name', 'возраст', 'age',
        'страна', 'country', 'статус', 'status', 'mmr', 'рейтинг', 'rating',
        'дивизион', 'division', 'награды mvp', 'mvp awards', 'медали', 'medals',
        'трофеи', 'trophies', 'контакты', 'contacts', 'пригласить', 'invite',
        'команда', 'team', 'история матчей', 'match history', 'победы', 'wins',
        'поражения', 'losses', 'процент побед', 'win rate', 'время игры', 'play time',
        'любимое оружие', 'favorite weapon', 'настройки аккаунта', 'account settings',
        'аватар', 'avatar', 'фото профиля', 'profile photo', 'персональные данные', 'personal data'
      ],
      description: t('search_pages.profile_description'),
      descriptionEn: 'Player personal account'
    },

    '/transfers': {
      name: t('search_pages.transfers'),
      nameEn: 'Transfers',
      keywords: [
        'трансферы', 'transfers', 'переходы', 'transitions', 'игроки', 'players',
        'рынок', 'market', 'контракты', 'contracts', 'подписание', 'signing',
        'сделки', 'deals', 'переговоры', 'negotiations', 'агенты', 'agents',
        'свободные агенты', 'free agents', 'трансферное окно', 'transfer window',
        'дедлайн', 'deadline', 'стоимость игрока', 'player value', 'трансферная сумма', 'transfer fee',
        'подписание контракта', 'contract signing', 'рассторжение', 'termination',
        'аренда', 'loan', 'арендные сделки', 'loan deals', 'трансферные слухи', 'transfer rumors',
        'официальные объявления', 'official announcements', 'новости трансферов', 'transfer news',
        'история трансферов', 'transfer history', 'топ трансферы', 'top transfers'
      ],
      description: t('search_pages.transfers_description'),
      descriptionEn: 'Information about player transfers between teams'
    },

    '/registration': {
      name: t('search_pages.registration'),
      nameEn: 'Registration',
      keywords: [
        'регистрация', 'registration', 'авторизация', 'authorization', 'login', 'киберспорт', 'esports', 
        'e-sports', 'Arena Warborn League', 'AWL', 'аккаунт', 'account', 'верификация', 'verification',
        'email подтверждение', 'email verification', 'пароль', 'password', 'вход', 'sign in',
        'создать аккаунт', 'create account', 'киберспортивная платформа', 'esports platform'
      ],
      description: t('search_pages.registration_description'),
      descriptionEn: 'Registration new users'
    }
  }), [t, currentLanguage]);

  // Сбрасываем состояние при каждом открытии или смене языка
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setIsSearching(false);
    }
  }, [isOpen, currentLanguage]);

  // Фокусировка на input при открытии
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen, currentLanguage]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Закрытие по клику вне области
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contentRef.current && !contentRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Надежный поиск по текущей странице
  const searchOnCurrentPage = (searchQuery) => {
    const results = [];
    const lowerQuery = searchQuery.toLowerCase().trim();
    
    if (!lowerQuery) return results;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (node.parentElement.offsetParent === null || 
              node.parentElement.style.display === 'none' ||
              node.textContent.trim().length < lowerQuery.length) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const processedNodes = new Set();

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.textContent.trim();
      
      if (!text || processedNodes.has(node)) continue;

      if (text.toLowerCase().includes(lowerQuery)) {
        let parent = node.parentElement;
        let significantParent = parent;
        
        while (parent && parent !== document.body) {
          if (['DIV', 'SECTION', 'ARTICLE', 'MAIN', 'LI', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(parent.tagName)) {
            significantParent = parent;
            break;
          }
          parent = parent.parentElement;
        }

        results.push({
          type: 'current',
          element: significantParent,
          text: text,
          relevance: calculateRelevance(text, searchQuery, significantParent),
          path: location.pathname,
          query: searchQuery
        });

        processedNodes.add(node);
      }
    }

    return results;
  };

  // Поиск по другим страницам (по ключевым словам)
  const searchInOtherPages = (searchQuery) => {
    const results = [];
    const lowerQuery = searchQuery.toLowerCase().trim();
    const currentPath = location.pathname;

    Object.entries(componentMap).forEach(([path, pageData]) => { // Используем componentMap вместо getComponentMap
      // Пропускаем текущую страницу
      if (path === currentPath) return;

      // Проверяем совпадение с ключевыми словами
      const hasMatch = pageData.keywords.some(keyword => 
        keyword.toLowerCase().includes(lowerQuery) || 
        lowerQuery.includes(keyword.toLowerCase())
      );

      // Проверяем совпадение с названием страницы
      const nameMatch = pageData.name.toLowerCase().includes(lowerQuery);

      if (hasMatch || nameMatch) {
        results.push({
          type: 'page',
          path: path,
          name: pageData.name,
          description: currentLanguage === 'en' ? pageData.descriptionEn : pageData.description,
          relevance: (hasMatch ? 70 : 0) + (nameMatch ? 80 : 0),
          query: searchQuery
        });
      }
    });

    return results;
  };

  const calculateRelevance = (text, query, element) => {
    let score = 0;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    if (lowerText === lowerQuery) score += 100;
    if (lowerText.startsWith(lowerQuery)) score += 80;
    if (lowerText.includes(lowerQuery)) score += 60;

    if (element.tagName?.startsWith('H')) {
      score += 50;
    }

    if (element.closest('main, article, .content')) {
      score += 30;
    }

    return score;
  };

  // Выполнение поиска
  const performSearch = () => {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery || trimmedQuery.length < 3) {
      showSingleNotification(t('search_errors.min_length'), true);
      return;
    }

    setIsSearching(true);

    try {
      const results = [];

      // Поиск на текущей странице
      const currentPageResults = searchOnCurrentPage(trimmedQuery);
      results.push(...currentPageResults);

      // Поиск по другим страницам
      const otherPagesResults = searchInOtherPages(trimmedQuery);
      results.push(...otherPagesResults);

      if (results.length > 0) {
        const sortedResults = results.sort((a, b) => b.relevance - a.relevance);
        onSearch(sortedResults.slice(0, 15), trimmedQuery);
        showSingleNotification(
          t('search_success.found')
            .replace('{count}', results.length)
            .replace('{query}', trimmedQuery)
        );
      } else {
        onSearch([], trimmedQuery);
        showSingleNotification(
          t('search_errors.not_found').replace('{query}', trimmedQuery), 
          true
        );
      }
    } catch (error) {
      console.error('Ошибка при выполнении поиска:', error);
      showSingleNotification(t('search_errors.general'), true);
      onSearch([], trimmedQuery);
    } finally {
      setIsSearching(false);
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  if (!isOpen) return null;

  return (
    <div className={`search-modal ${isOpen ? 'active' : ''}`}>
      <div className="search-modal-content" ref={contentRef}>
        <form onSubmit={handleSubmit} className="search-input-container">
          <input 
            ref={inputRef}
            type="text" 
            className="search-input" 
            placeholder={t('search_placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            type="submit" 
            className="search-submit"
            disabled={isSearching}
          >
            <img src="/images/icons/icon-search-submit.png" alt={t('search_button')}/>
            {isSearching && <span className="search-loading"></span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchModal;