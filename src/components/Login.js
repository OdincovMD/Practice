import React from "react"

class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            login: "",
            password: ""
        }
    }

    render() {
        return (
            <form ref={(el) => this.myForm = el}>
                <input
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
                        this.onLogin(this.state)
                    }
                    }>
                    Войти
                </button>
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
}

export default Login