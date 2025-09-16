import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { showSingleNotification } from '/utils/notifications';
import '/src/styles.css';

const SearchModal = ({ isOpen, onClose, onSearch }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const contentRef = useRef(null);
  const inputRef = useRef(null);

  // Карта страниц с ключевыми словами для поиска
  const componentMap = {
  '/': {
    name: 'Главная',
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
    description: 'Главная страница с информацией о лиге и предстоящих событиях с новостями',
    descriptionEn: 'Home page with information about the league, upcoming events and news'
  },

  '/tournaments': {
    name: 'Турниры',
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
    description: 'Раздел с информацией о текущих и предстоящих турнирах',
    descriptionEn: 'Section with information about current and upcoming tournaments'
  },

  '/teams': {
    name: 'Команды',
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
    description: 'Информация о командах и игроках лиги',
    descriptionEn: 'Information about teams and league players'
  },

  '/rating': {
    name: 'Рейтинг',
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
    description: 'Рейтинг игроков и команд',
    descriptionEn: 'Player and team ratings'
  },

  '/profile': {
    name: 'Профиль',
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
    description: 'Личный кабинет игрока',
    descriptionEn: 'Player personal account'
  },

  '/transfers': {
    name: 'Трансферы',
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
    description: 'Информация о трансферах игроков между командами',
    descriptionEn: 'Information about player transfers between teams'
  }
};

  // Фокусировка на input при открытии
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

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

    Object.entries(componentMap).forEach(([path, pageData]) => {
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
          description: pageData.description,
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
      showSingleNotification('✗ Введите минимум 3 символа для поиска', true);
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
        showSingleNotification(`✓ Найдено ${results.length} результатов по запросу: "${trimmedQuery}"`);
      } else {
        onSearch([], trimmedQuery);
        showSingleNotification('✗ Ничего не найдено по запросу: "' + trimmedQuery + '"', true);
      }
    } catch (error) {
      console.error('Ошибка при выполнении поиска:', error);
      showSingleNotification('✗ Произошла ошибка при поиске', true);
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
            placeholder="Поиск по сайту..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            type="submit" 
            className="search-submit"
            disabled={isSearching}
          >
            <img src="/images/icons/icon-search-submit.png" alt="Поиск"/>
            {isSearching && <span className="search-loading"></span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchModal;