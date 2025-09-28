import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { showSingleNotification } from '/utils/notifications';
import '/src/styles.css';

const Profile = () => {
  return (
              
<div class="content-index">
        <img class="profile-awl-background" src="../public/images/other/profile-background-awl.webp" alt="awl-logo-profile"/>

        {/* Новый блок с затемнением */}
    <div class="fade-block">
        <img src="../public/images/other/profile-player-example.png" alt="awl-player-photo" class="masked-image"/>
    </div>

            {/* Блок информации об игроке + первый мини-блок */}
        <div class="player-information">
    <div class="info-section">
        <h3 class="section-title">Игрок</h3>
        <div class="info-block">
            <span class="name-player-style">Ник игрока</span>
            <div class="horizontal-row-1">
            <span class="info-player-style"><img class="country-player" src="../public/images/icons/icon-kazakhstan.png"/>Имя игрока</span>
            <div class="age-and-status-container">
            <span class="age-and-status-player-style">Возраст</span>
            <span class="age-and-status-player-style">Статус игрока</span>
            </div>
            </div>
        </div>
    </div>
    
                {/* Второй мини-блок */}
    <div class="info-section">
        <h3 class="section-title">Награды MVP</h3>
        <div class="info-block">
            <div class="mvp-rewards-grid">
            {/* Блок 1 */}
            <div class="mvp-reward-item">
                <img src="../public/images/icons/icon-medal1.png" class="reward-icon" alt="Награда"/>
                <span class="reward-text">Название турнира с призовым местом</span>
            </div>
            {/* Блок 2 */}
            <div class="mvp-reward-item">
                <img src="../public/images/icons/icon-medal2.png" class="reward-icon" alt="Награда"/>
                <span class="reward-text">Название турнира с призовым местом</span>
            </div>
            {/* Блок 3 */}
            <div class="mvp-reward-item">
                <img src="../public/images/icons/icon-medal3.png" class="reward-icon" alt="Награда"/>
                <span class="reward-text">Название турнира с призовым местом</span>
            </div>
            {/* Блок 4 */}
            <div class="mvp-reward-item">
                <img src="../public/images/icons/icon-medal2.png" class="reward-icon" alt="Награда"/>
                <span class="reward-text">Название турнира с призовым местом</span>
            </div>
        </div>
        </div>
        </div>
        
                    {/* Третий мини-блок из 2 блоков (MMR и Дивизион) */}
    <div class="info-sections-container">
    <div class="info-section">
        <h3 class="section-title">MMR</h3>
        <div class="info-block">Число</div>
    </div>
    
    <div class="info-section">
        <h3 class="section-title">Дивизион</h3>
        <div class="svg-division-container">
                <svg class="svg-division-block" viewBox="0 0 302 92" preserveAspectRatio="none">
        <path d="M9,1 
                 L286,1 
                 L301,46 
                 L286,91 
                 L9,91 
                 C4.58,91 1,87.42 1,83 
                 L1,9 
                 C1,4.58 4.58,1 9,1Z" 
              fill="none" 
              stroke="#ff6600" 
              stroke-width="2" 
              stroke-linejoin="round"/>
                </svg>
                <div class="svg-division-content">
                    Название див.<img class="division-player" src="../public/images/icons/icon-division2.png"/>
                </div>
            </div>
        </div>
    </div>
    
                        {/* Четвертый мини-блок */}
<div class="stats-actions-container">
    <div class="info-section">
        <h3 class="section-title">Статистика</h3>
        <div class="info-block">
            <div class="stats-container">
            {/* Левая колонка */}
            <div class="stats-column">
                <div class="stat-item">
                    <span class="stat-label">У/С</span>
                    <span class="stat-value">Значение</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">% Побед</span>
                    <span class="stat-value">Значение</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Время в игре</span>
                    <span class="stat-value">Значение</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Любимое оружие</span>
                    <span class="stat-value">Значение</span>
                </div>
            </div>
            
            {/* Правая колонка */}
            <div class="stats-column">
                <div class="stat-item">
                    <span class="stat-label">В разработке</span>
                    <span class="stat-value">n/a</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">В разработке</span>
                    <span class="stat-value">n/a</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">В разработке</span>
                    <span class="stat-value">n/a</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">В разработке</span>
                    <span class="stat-value">n/a</span>
                </div>
            </div>
        </div>
        </div> 
    </div> 

{/* Блок с кнопками */}
    <div class="info-section">
        <div class="info-block">
            <div class="action-buttons-container">
                <button class="action-btn">
                    <span class="btn-text">Контакты</span>
                </button>
                <button class="action-btn">
                    <span class="btn-text">Пригласить в команду</span>
                </button>
            </div>
        </div>
    </div>
</div>

    
                    {/* Пятый мини-блок */}
    <div class="info-section">
    <h3 class="section-title">Достижения</h3>
    <div class="info-block achievements-block">
        <div class="achievements-row">
            {/* Блок 1 */}
            <div class="achievement-item">
                <img src="../public/images/medals/achieve1.png" class="achievement-icon" alt="Достижение 1"/>
            </div>
            {/* Блок 2 */}
            <div class="achievement-item">
                <img src="../public/images/medals/achieve2.png" class="achievement-icon" alt="Достижение 2"/>
            </div>
            {/* Блок 3 */}
            <div class="achievement-item">
                <img src="../public/images/medals/achieve3.png" class="achievement-icon" alt="Достижение 3"/>
            </div>
            {/* Блок 4 */}
            <div class="achievement-item">
                <img src="../public/images/medals/achieve4.png" class="achievement-icon" alt="Достижение 4"/>
            </div>
            {/* Блок 5 */}
            <div class="achievement-item">
                <img src="../public/images/medals/achieve5.png" class="achievement-icon" alt="Достижение 5"/>
            </div>
            {/* Блок 6 */}
            <div class="achievement-item">
                <img src="../public/images/medals/achieve6.png" class="achievement-icon" alt="Достижение 6"/>
            </div>
        </div>
    </div>
</div>
</div>
</div>
);
};

export default Profile;