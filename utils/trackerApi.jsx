// utils/trackerApi.js
const API_KEY = import.meta.env.VITE_TRACKER_GG_API_KEY;
const BASE_URL = 'https://public-api.tracker.gg/v2/bf6/standard';

if (!API_KEY) {
  console.warn('⚠️ Отсутствует VITE_TRACKER_GG_API_KEY в .env файле');
}

/**
 * Проверка подключения к API
 */
export const testTrackerApiConnection = async () => {
  try {
    console.log('🔄 Тестируем подключение к tracker.gg API...');
    
    // Простой запрос для проверки API
    const response = await fetch(`${BASE_URL}/profile/search?platform=psn&query=test`, {
      method: 'GET',
      headers: {
        'TRN-Api-Key': API_KEY,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Статус ответа:', response.status);
    console.log('📊 Заголовки ответа:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API подключение успешно!');
      console.log('📦 Полученные данные:', data);
      return {
        success: true,
        status: response.status,
        data: data
      };
    } else {
      console.error('❌ Ошибка API:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('❌ Текст ошибки:', errorText);
      return {
        success: false,
        status: response.status,
        error: errorText
      };
    }
  } catch (error) {
    console.error('❌ Ошибка при подключении к tracker.gg:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Поиск профиля по имени игрока
 */
export const searchPlayerProfile = async (platform, playerName) => {
  try {
    const response = await fetch(
      `${BASE_URL}/profile/search?platform=${platform}&query=${encodeURIComponent(playerName)}`,
      {
        headers: {
          'TRN-Api-Key': API_KEY,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка при поиске игрока:', error);
    throw error;
  }
};

/**
 * Получение детальной статистики игрока
 */
export const getPlayerStats = async (platform, playerId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/profile/${platform}/${playerId}`,
      {
        headers: {
          'TRN-Api-Key': API_KEY,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    throw error;
  }
};

export default {
  testTrackerApiConnection,
  searchPlayerProfile,
  getPlayerStats
};