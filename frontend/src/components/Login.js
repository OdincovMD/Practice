import React from "react"
import BACKEND_URL from "../BACKEND_URL"

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
            <div id="form-container">
                <form ref={(el) => this.myForm = el}>
                <div id="form_1">
                    <input
                        className="top"
                        placeholder="Логин"
                        onChange={(ans) => { this.setState({ login: ans.target.value }) }}
                    />
                </div>
                <div id="form_2">
                    <input
                        type="password"
                        placeholder="Пароль"
                        onChange={(ans) => { this.setState({ password: ans.target.value }) }}
                    />
                </div>
                <div id="form_3">
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
                </div>
                <div id="form_4">
                    <p>
                        {this.state.error && `Ошибка: ${this.state.error}`}
                    </p>
                    <br /><br />
                    <p>
                        Еще не зарегестрированы?&nbsp;
                    </p>
                </div>
                <div id="form_5">
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
                </div>
                </form>
            </div>
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
