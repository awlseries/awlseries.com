// useUserStatus.jsx
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../src/supabase';

const useUserStatus = (userId = null) => {
  const [isUserOnline, setIsUserOnline] = useState(false);
  const channelRef = useRef(null);

  // Функция проверки онлайн статуса по времени
  const checkOnlineByTime = (lastOnline) => {
    if (!lastOnline) return false;
    const lastOnlineTime = new Date(lastOnline);
    const now = new Date();
    const minutesAgo = (now - lastOnlineTime) / (1000 * 60);
    return minutesAgo < 3; // Онлайн если был активен последние 3 минуты
  };

  // При изменении userId проверяем текущий статус в базе
  useEffect(() => {
    if (!userId) return;

    const checkCurrentStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('last_online') // ТОЛЬКО last_online!
          .eq('id', userId)
          .single();
        
        if (!error && data) {
          // Определяем статус ТОЛЬКО по времени
          const actuallyOnline = checkOnlineByTime(data.last_online);
          setIsUserOnline(actuallyOnline);
        }
      } catch (error) {
        console.error('❌ Ошибка проверки статуса:', error);
      }
    };
    
    checkCurrentStatus();
  }, [userId]);

  // Настройка Realtime канала для отслеживания изменений статуса
  useEffect(() => {
    if (!userId) return;

    // Отписываемся от предыдущего канала
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Создаем канал для отслеживания изменений last_online
    const channel = supabase
      .channel(`user-status-view:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          console.log('📢 Realtime обновление last_online:', payload.new.last_online);
          // Обновляем статус когда обновляется last_online
          if (payload.new.last_online) {
            const actuallyOnline = checkOnlineByTime(payload.new.last_online);
            setIsUserOnline(actuallyOnline);
          }
        }
      )

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId]);

  return isUserOnline;
};

export default useUserStatus;