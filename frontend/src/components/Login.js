import React from "react"
import BACKEND_URL from "../config"

class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            error: null,
            login: "",
            password: "",
            backendData: ""
        }
    }

    render() {
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
                    onClick={() => {
                        this.myForm.reset()
                        loginData = {
                            login: this.state.login,
                            password: this.state.password
                        }
                        this.onLogin(loginData)
                        this.setState({ login: "", password: "", error: null, status: "ok" })
                        loginData = {}
                    }
                    }>
                    Войти
                </button>
                <p>{this.state.error && "Произошла ошибка при получении информации"}</p>
                <p>{!this.state.error && (this.state.status !== "ok") && "Неправильный логин или пароль"}</p>
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

    // answer = XMLHttpRequest()
    onLogin(loginData) {
        fetch(BACKEND_URL, {
            method: "post",
            headers: {
                "type": "login"
            },
            body: JSON.stringify(loginData)
        })
            .then(response => response.json())
            .then(
                (response_json) => {
                    if (response_json.ok)
                        this.setState({
                            backendData: response_json.data
                        })
                    else
                        this.setState({
                            error: response_json.status
                        })

                }
            )

        if (this.state.backendData.isValid === "ok")
            this.userData = {
                name: this.state.backendData.name,      //Зависит от вида получаемого json файла
                surname: this.state.backendData.surname //Зависит от вида получаемого json файла
            }
            this.props.onChange("card")
    }
}

export default Login
