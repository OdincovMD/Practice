import React from "react"
import BACKEND_URL from "../config"

class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            error: null,
            login: "",
            password: "",
        }

        this.backendData = { isValid: 1 }
    }

    render() {
        const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/
        let loginData = {}
        return (
            <form ref={(el) => this.myForm = el}>
                <input
                    className="top"
                    placeholder="Логин"
                    onChange={(ans) => { this.setState({ login: ans.target.value }) }}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    onChange={(ans) => { this.setState({ password: ans.target.value }) }}
                />
                <br />
                <button
                    type="button"
                    disabled={!(
                        this.state.password
                        && this.state.login)}
                    onClick={() => {
                        this.myForm.reset()
                        loginData = {
                            login: this.state.login,
                            password: this.state.password
                        }
                        this.setState({
                            login: "",
                            password: "",
                            error: null,
                        })
                        this.backendData = { isValid: 1 }
                        this.onLogin(loginData)
                        loginData = {}
                    }
                    }>
                    Войти
                </button>
                <p>{this.state.error && `Ошибка: ${this.state.error}`}</p>
                <p>{!this.state.error && !this.backendData.isValid && "Неправильный логин или пароль"}</p>
                <br /><br />
                <p>
                    Ещё не зарегестрированы?&nbsp;
                </p>
                <button
                    className="link"
                    type="link"
                    onClick={() => {
                        this.myForm.reset()
                        this.setState({ login: "", password: "" })
                        this.props.onChange("register")
                    }
                    }>
                    Регистрация
                </button>
            </form>
        )
    }

    onLogin(loginData) {

        loginData = { "login": loginData }
        let userData = {}
        fetch(`${BACKEND_URL}/login`, {
            method: "POST",
            body: JSON.stringify(loginData)
        })
            .then(response => response.json())
            .then(
                (responseJSON) => {
                    this.backendData = responseJSON
                }
            )
            .then(() => {
                console.log("2")
                console.log(this.backendData)
                if (!this.state.error && this.backendData.isValid) {
                    userData = {
                        firstName: this.backendData.data.firstName,
                        lastName: this.backendData.data.lastName
                    }
                    this.props.onChange("profile", userData)
                }
            }
            )
            .catch(
                error => {
                    this.setState({
                        error: error
                    })
                }
            )
    }
}

export default Login
