import React from 'react';

const Profile = () => {
  return (
<div class="content-index">
        <img class="profile-awl-background" src="../public/images/other/profile-background-awl.webp" alt="awl-logo-profile"/>

        // Новый блок с затемнением
    <div class="fade-block">
        <img src="../public/images/other/profile-player-example.png" alt="awl-player-photo" class="masked-image"/>
    </div>
        <div class="player-information">
    <div class="info-section">
        <h3 class="section-title">Игрок</h3>
        <div class="info-block"><div class="info-block-content">Содержимое блока 1</div></div>
    </div>
    
    <div class="info-section">
        <h3 class="section-title">Название 2</h3>
        <div class="info-block">Содержимое блока 2</div>
    </div>
    
    <div class="info-section">
        <h3 class="section-title">Название 3</h3>
        <div class="info-block">Содержимое блока 3</div>
    </div>
    
    <div class="info-section">
        <h3 class="section-title">Название 4</h3>
        <div class="info-block">Содержимое блока 4</div>
    </div>
    
    <div class="info-section">
        <h3 class="section-title">Название 5</h3>
        <div class="info-block">Содержимое блока 5</div>
    </div>
    
    <div class="info-section">
        <h3 class="section-title">Название 6</h3>
        <div class="info-block">Содержимое блока 6</div>
    </div>
    </div>
</div>
);
};

export default Profile;