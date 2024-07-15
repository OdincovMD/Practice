import React from 'react'
import BACKEND_URL from "../config"

class Profile extends React.Component {

  constructor(props) {
    super(props)
    this.plug = { "result": "", "probability": "" }

    this.state = {
      firstName: this.props.userData.firstName,
      lastName: this.props.userData.lastName,
      formData: null,
      infoBad: this.plug,
      infoGood: this.plug,
      // status: 'admin',
      // loading: false

    }

    this.handleChange = this.handleChange.bind(this)
    this.handleUploadImage = this.handleUploadImage.bind(this)
  }

  handleChange(event) {
    this.setState({ formData: event.target.files[0] })
    let reader = new FileReader();
    reader.onload = e => document.querySelector('img').src = e.target.result;
    reader.readAsDataURL(event.target.files[0]);
    this.setState({ infoBad: this.plug, infoGood: this.plug })
  }

  async handleUploadImage() {

    let regex = /^.* пневмония$/
    const formData = new FormData();
    formData.append("file", this.state.formData);

    try {
      let response = await fetch(`${BACKEND_URL}/upload`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        alert(`Произошла ошибка: ${response.status}`)
        return
      }

      let responseJSON = await response.json()
      console.log(responseJSON.result)
      if (regex.test(responseJSON.result))
        this.setState({ infoBad: responseJSON, infoGood: this.plug })
      else
        this.setState({ infoBad: this.plug, infoGood: responseJSON })
    }
    catch (err) {
      alert(`Ошибка: ${err}`)
    }
  }

  render() {
    if (this.state.loading)
      return (<p> Loading...</p>)
    else
      return (
        <div className="userdata">
          <h1> Страница пользователя</h1>
          <p>Имя: {this.state.firstName}</p>
          <p className="bottom">Фамилия: {this.state.lastName}</p>
          {/* <p style={{ marginBottom: 20 }}>Статус: {this.state.status === 'admin' ? 'Администратор' : 'Врач'}</p> */}
          <div style={{ textAlign: 'center' }}>
            {/* <button style={{ display: 'block', marginBottom: 10 }} onClick={() => { this.props.onChange("editProfile") }}>Изменить данные о пользователе</button> */}
          </div>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <h2 style={{ marginBottom: 10 }}>Панель управления</h2>
            <form ref={(el) => this.myForm = el}>
              <input type="file" onChange={(event) => { this.handleChange(event) }} />
            </form>
            {this.state.formData && (<br />)}
            {this.state.formData && (<img src={this.state.formData} alt="Загруженное изображение" />)}
            {this.state.formData && (<br />)}
            <p className='infoBad'>{(this.state.infoBad !== this.plug) ? `Изображение обработано успешно.\n\nРезультат: ${this.state.infoBad.result}\nУверенность: ${(100 * this.state.infoBad.probability).toFixed(0)}%` : ''}</p>
            <p className='infoGood'>{(this.state.infoGood !== this.plug) ? `Изображение обработано успешно.\n\nРезультат: ${this.state.infoGood.result}\nУверенность: ${(100 * this.state.infoGood.probability).toFixed(0)}%` : ''}</p>
            <button disabled={!this.state.formData} onClick={() => {
              this.handleUploadImage()
              this.myForm.reset()
            }}>Обработать изображение</button>
            <button style={{ display: 'block' }} className="exit" onClick={() => { this.props.onChange("login") }}>Выйти из профиля</button>
          </div>
        </div>
      )
  };
}

export default Profile
