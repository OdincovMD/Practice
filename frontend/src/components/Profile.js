import React from 'react'
import BACKEND_URL from "../config"

class Profile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      firstName: this.props.userData.firstName,
      lastName: this.props.userData.lastName,
      // status: 'admin',
      // loading: false
    }

    this.formData = null;
  }

  async handleUploadImage() {

    const formData = new FormData();
    formData.append("file", this.formData);

    let response = await fetch(`${BACKEND_URL}/upload`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      alert(`Произошла ошибка: ${response.status}`)
      return
    }

    let responseTEXT = await response.text()
    {
      alert(`Изображение обработано успешно. Результат: ${responseTEXT}`)
    }

  }

  render() {
    if (this.state.loading)
      return (<p> Loading...</p>)
    else
      return (
        <div className="loading" >
          <div className="userdata">
            <h1 style={{ marginBottom: 20 }}> Страница пользователя</h1>
            <p>Имя: {this.state.firstName}</p>
            <p>Фамилия: {this.state.lastName}</p>
            {/* <p style={{ marginBottom: 20 }}>Статус: {this.state.status === 'admin' ? 'Администратор' : 'Врач'}</p> */}
            <div style={{ textAlign: 'center' }}>
              {/* <button style={{ display: 'block', marginBottom: 10 }} onClick={() => { this.props.onChange("editProfile") }}>Изменить данные о пользователе</button> */}
              <button style={{ display: 'block' }} onClick={() => { this.props.onChange("login") }}>Выйти из профиля</button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <h2 style={{ marginBottom: 10 }}>Панель управления</h2>
              <form ref={(el) => this.myForm = el}>
                <input type="file" onChange={(event) => { this.formData = event.target.files[0] }} />
              </form>
              <button disabled={this.formData} style={{ display: 'block' }} onClick={() => {
                this.handleUploadImage()
                this.myForm.reset()
              }}>Загрузить изображение с ПК</button>
            </div>
          </div>
        </div>
      )
  };
}

export default Profile
