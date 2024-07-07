import React, { useState, useEffect } from 'react';

function ProfilePage() {
  const [userData, setUserData] = useState({
    name: 'Alex',
    surname: 'Grimaldo',
    status: 'admin',
  });

  const [loading, setLoading] = useState(false);

  /*useEffect(() => {
    axios.get('/api/user/data')
      .then(response => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);*/

  const handleEditProfile = () => {
    window.location.href = '/edit-profile';
  };

  const handleUploadImage = () => {
    // Здесь будет код для загрузки изображения с ПК
    console.log('Upload image button clicked!');
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1 style={{ marginBottom: 20 }}> Страница пользователя</h1>
          <p>Имя: {userData.name}</p>
          <p>Фамилия: {userData.surname}</p>
          <p style={{ marginBottom: 20 }}>Статус: {userData.status === 'admin' ? 'Администратор' : 'Врач'}</p>
          <div style={{ textAlign: 'center' }}>
            <button style={{ display: 'block', marginBottom: 10 }} onClick={handleEditProfile}>Изменить данные о пользователе</button>
            <button style={{ display: 'block' }} onClick={handleEditProfile}>Выйти из профиля</button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <h2 style={{ marginBottom: 10 }}>Панель управления</h2>
            <button style={{ display: 'block' }} onClick={handleUploadImage}>Загрузить изображение с ПК</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;