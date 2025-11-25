import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabase';
import TeamHeader from './TeamHeader';
import TeamContent from './TeamContent';
import TeamRoster from './TeamRoster';
import TeamManagement from './TeamManagement';
import { showSingleNotification } from '/utils/notifications';
import './TeamPage.css';


const TeamPage = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('guest');
  const [captainName, setCaptainName] = useState('Не указан');

  useEffect(() => {
    loadTeamData();
  }, [teamId]);

  const loadTeamData = async () => {
    try {
      const { data: teamData, error } = await supabase
        .from('teams')
        .select(`
          *,
          captain:users(fullname, battlefield_nickname),
          members:users!team_id(*)
        `)
        .eq('id', teamId)
        .single();

      if (error) throw error;
      
      setTeam(teamData);
      
      // Устанавливаем имя капитана
      if (teamData.captain && teamData.captain.length > 0 && teamData.captain[0].battlefield_nickname) {
        setCaptainName(teamData.captain[0].battlefield_nickname);
      }
      
      // После загрузки команды определяем роль пользователя
      await determineUserRole(teamData);
    } catch (error) {
      console.error('Ошибка загрузки команды:', error);
      showSingleNotification('✗ Ошибка загрузки данных команды', true);
    } finally {
      setLoading(false);
    }
  };

  const determineUserRole = async (teamData) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setUserRole('guest');
      return;
    }
    
    // ПРЯМОЕ СРАВНЕНИЕ - если ID совпадают, то это капитан
    if (teamData.captain_id === user.id) {
      setUserRole('captain');
      return;
    }
    
    // Проверяем является ли пользователь членом команды
    const isMember = teamData.members?.some(member => member.id === user.id);
    if (isMember) {
      setUserRole('member');
      return;
    }
    setUserRole('guest');
  };

  if (loading) {
  return <div className="loading-profile">
    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-circle"></div>
      </div>
      <p>Загрузка команды...</p>
    </div>
    </div>;
}

  if (!team) {
    return <div className="error">Команда не найдена</div>;
  }

  return (
    <section className="player-team">
      <div className="team-container">
        <TeamHeader 
          team={team} 
          userRole={userRole} 
          captainName={captainName} 
        />
        
        <div className="team-right-column">
          <TeamContent team={team} userRole={userRole} />
          
          {userRole === 'captain' && <TeamManagement team={team} />}
          
          <TeamRoster 
          team={team} 
          userRole={userRole} 
          className={userRole === 'guest' ? 'guest-roster' : ''}
        />
        </div>
      </div>
    </section>
  );
};

export default TeamPage;