import React from 'react'
import BACKEND_URL from "../config"

class Profile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: this.props.userData.name,
      surname: this.props.userData.surname,
      // status: 'admin',
      loading: false
    }
  }

  handleUploadImage() {
    // Здесь будет код для загрузки изображения с ПК
    console.log('Upload image button clicked!');
  }

  render() {
    if (this.state.loading)
      return (<p> Loading...</p>)
    else
      return (
        <div className="loading" >
          <div className="userdata">
            <h1 style={{ marginBottom: 20 }}> Страница пользователя</h1>
            <p>Имя: {this.state.name}</p>
            <p>Фамилия: {this.state.surname}</p>
            {/* <p style={{ marginBottom: 20 }}>Статус: {this.state.status === 'admin' ? 'Администратор' : 'Врач'}</p> */}
            <div style={{ textAlign: 'center' }}>
              <button style={{ display: 'block', marginBottom: 10 }} onClick={() => { this.props.onChange("editProfile") }}>Изменить данные о пользователе</button>
              <button style={{ display: 'block' }} onClick={() => { this.props.onChange("login") }}>Выйти из профиля</button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <h2 style={{ marginBottom: 10 }}>Панель управления</h2>
              <button style={{ display: 'block' }} onClick={() => { this.handleUploadImage() }}>Загрузить изображение с ПК</button>
            </div>
          </div>
        </div>
      )
  };
}

export default Profile
