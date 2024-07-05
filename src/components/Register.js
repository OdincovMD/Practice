import React from "react"

class Register extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            lastName: "",
            firstName: "",
            login: "",
            password: "",
            rep_password: "",
        }
    }

    render() {
        return (
            <form ref={(el) => this.myForm = el}>
                <input
                    placeholder="Фамилия"
                    onChange={(ans) => { this.setState({ lastName: ans.target.value }) }}
                />
                <input
                    placeholder="Имя"
                    onChange={(ans) => { this.setState({ firstName: ans.target.value }) }}
                />
                <input
                    placeholder="Логин"
                    onChange={(ans) => { this.setState({ login: ans.target.value }) }}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    onChange={(ans) => { this.setState({ password: ans.target.value }) }}
                />
                <input
                    type="password"
                    placeholder="Подтвердите пароль"
                    onChange={(ans) => { this.setState({ password: ans.target.value }) }}
                />
                <br />
                <button
                    type="button"
                    onClick={() => {
                        this.myForm.reset()
                        this.onRegister(this.state)
                    }
                    }>
                    Регистрация
                </button>
                <br /><br />
                <p>
                    Уже зарегестрированы?&nbsp;
                </p>
                <button
                    className="link"
                    type="link"
                    onClick={() => {
                        this.myForm.reset()
                        this.setState({ login: "", password: "" })
                        this.props.onChange("login")
                    }
                    }>
                    Войти
                </button>
            </form>
        )
    }

}

export default Register