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
                        this.onLogin(loginData)
                        loginData = {}
                    }
                    }>
                    Войти
                </button>
                <p>{this.state.error && `Ошибка: ${this.state.error}`}</p>
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
        try {
            let response = await fetch(`${BACKEND_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify(loginData)
            })

            if (!response.ok) {
                this.setState({ error: response.status })
                return
            }

            var responseJSON = await response.json()
            if (!responseJSON.isValid) {
                this.setState({ error: "Неверный логин или пароль" })
                return
            }
            this.setState({ error: null })
            userData = {
                firstName: responseJSON.data.firstName,
                lastName: responseJSON.data.lastName
            }
            this.props.onChange("profile", userData)
        }
        catch (err) {
            this.setState({ error: err })
        }
    }
}

export default Login
