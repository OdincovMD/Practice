import React from "react"

class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            status: "ok",
            error: null,
            login: "",
            password: ""
        }
    }

    render() {
        let userData = {}
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
                        userData = {
                            login: this.state.login,
                            password: this.state.password
                        }
                        this.setState({ login: "", password: "", error: null, status: "ok" })
                        this.onLogin(userData)
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

    onLogin(loginData) {
        // fetch("some/url", {
        //     method: "post",
        //     headers: {
        //         "type": "login"
        //     },
        //     body: JSON.stringify(loginData)
        // })
        //     .then(response => response.json())
        //     .then(
        //         (response_json) => {
        //             if (response_json.ok)
        //                 this.setState({
        //                     status: response_json.isValid
        //                 })
        //             else
        //                 this.setState({
        //                     error: response_json.status
        //                 })

        //         }
        //     )

        // // if (this.state.status === "ok")
        this.props.onChange("card")
    }
}

export default Login