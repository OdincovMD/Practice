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
        // const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/
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

    async onLogin(loginData) {

        let userData = {}
        let response = await fetch(`${BACKEND_URL}/login`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify(loginData)
        })

        if (response.ok) {
            var responseJSON = await response.json()
            this.setState({ error: null })
            this.backendData = responseJSON
            if (this.backendData.isValid) {
                userData = {
                    firstName: this.backendData.data.firstName,
                    lastName: this.backendData.data.lastName
                }
                this.props.onChange("profile", userData)
            }
        }
        else {
            this.setState({ error: response.status })
        }
    }
}

export default Login
