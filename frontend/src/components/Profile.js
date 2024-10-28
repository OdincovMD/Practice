import React from 'react'
import ReactImageMagnify from "easy-magnify-waft"
import BACKEND_URL from "../BACKEND_URL"

class Profile extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      firstName: this.props.userData.firstName,
      lastName: this.props.userData.lastName,
      pathToImage: null,
      image: null,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleUploadImage = this.handleUploadImage.bind(this)
  }

  async handleChange(event) {
    const fileInfo = event.target.files[0] 
    
    var now = new Date()
    const day = now.getDate() + '-' + now.getMonth() + '-' + now.getFullYear()
    const time = now.getHours() + '-' + now.getMinutes() + '-' + now.getSeconds()
    const user = this.state.firstName + this.state.lastName
    // const filename = fileInfo.name.split(".")[0]
    // const ext = fileInfo.name.split(".").pop()
    const stamp = `${day}_${time}_${user}_${fileInfo.name}`
    const fileProcessed = new File([fileInfo], stamp, {type: fileInfo.type});
    
    var formData = new FormData()
    formData.append("file", fileProcessed)

    try {
      let response = await fetch(`${BACKEND_URL}/save_image`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        alert(`Произошла ошибка: ${response.status}`)
        return
      }

      // var responseJSON = await response.json()
      const uploadedImg = require(`../../img/${stamp}`)
      this.setState({image: uploadedImg}, () => {})
      this.setState({pathToImage: `../../img/${stamp}`}, () => {console.log(this.state.pathToImage)})
    }
    catch (err) {
      alert(`Ошибка: ${err}`)
    }
  }

  async handleUploadImage() {

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

      // let responseJSON = await response.json()
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
              <input type="file" onChange={(event) => { 
                this.handleChange(event)
              }} />
            </form>
            {this.state.pathToImage && (<br />)}
            {this.state.pathToImage && (
              <div id="imageMagnifyer">
                <ReactImageMagnify {...{
                      smallImage: {
                          alt: 'Загруженное изображение',
                          isFluidWidth: true,
                          src: this.state.image,
                      },
                      largeImage: {
                          src: this.state.image,
                          width: 2560,
                          height: 1920
                      },
                      enlargedImageStyle: {
                          objectFit: "contain",
                      },
                      isHintEnabled: true,
                      shouldHideHintAfterFirstActivation: false,
                      isActivatedOnTouch: true,
                  }} />
                </div>
                )
              }
            {this.state.pathToImage && (<img src={this.state.image} alt={this.state.pathToImage}/>)}
            {this.state.pathToImage && (<br/>)}
            <button disabled={!this.state.pathToImage} onClick={() => {
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