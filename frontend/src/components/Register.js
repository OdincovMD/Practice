import React from "react"
import BACKEND_URL from "../config"
import { TextField } from "./ui/TextField"

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      lastName: "",
      firstName: "",
      login: "",
      password: "",
      rep_password: "",
    }
  }

  async onRegister(registerData) {
    try {
      const response = await fetch(`${BACKEND_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(registerData),
      })

      if (!response.ok) {
        this.setState({ error: `Сервер ответил кодом ${response.status}` })
        return
      }

      const responseJSON = await response.json()
      if (!responseJSON.isValid) {
        this.setState({ error: "Этот логин уже занят" })
        return
      }
      this.setState({ error: null })
      this.props.onChange("profile", {
        firstName: registerData.firstName,
        lastName: registerData.lastName,
      })
    } catch (err) {
      this.setState({
        error: "Не удалось связаться с сервером. Проверьте подключение.",
      })
    }
  }

  render() {
    const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/
    const lenOk = /^.{8,}$/.test(this.state.password)
    const numOk = /[0-9]/.test(this.state.password)
    const upOk = /[A-Z]/.test(this.state.password)
    const lowOk = /[a-z]/.test(this.state.password)
    const pwdOk = regex.test(this.state.password)
    const matchOk =
      this.state.password && this.state.password === this.state.rep_password

    const canSubmit = Boolean(
      pwdOk &&
        matchOk &&
        this.state.lastName &&
        this.state.firstName &&
        this.state.login
    )

    return (
      <div className="auth-layout">
        <div className="auth-card">
          <header className="auth-card__header">
            <p className="auth-card__eyebrow">Новый пользователь</p>
            <h1 className="auth-card__title">Регистрация</h1>
            <div className="auth-card__lead-slot">
              <p className="auth-card__lead patient-hint">
                Укажите ФИО и надёжный пароль — так мы сможем обращаться к вам по имени в
                интерфейсе.
              </p>
              <p className="auth-card__lead clinical-only">
                Создание учётной записи для загрузки исследований. Пароль храните в соответствии с
                локальной политикой безопасности.
              </p>
            </div>
          </header>

          <form onSubmit={(e) => e.preventDefault()}>
            <TextField
              id="reg-last"
              label="Фамилия"
              value={this.state.lastName}
              autoComplete="family-name"
              onChange={(e) => this.setState({ lastName: e.target.value })}
            />
            <TextField
              id="reg-first"
              label="Имя"
              value={this.state.firstName}
              autoComplete="given-name"
              onChange={(e) => this.setState({ firstName: e.target.value })}
            />
            <TextField
              id="reg-login"
              label="Логин"
              value={this.state.login}
              autoComplete="username"
              onChange={(e) => this.setState({ login: e.target.value })}
            />

            <div className="password-rules" aria-live="polite">
              <strong>Требования к паролю</strong>
              <ul>
                <li className={lenOk ? "met" : ""}>Не менее 8 символов</li>
                <li className={numOk ? "met" : ""}>Хотя бы одна цифра</li>
                <li className={upOk ? "met" : ""}>Хотя бы одна заглавная латинская буква</li>
                <li className={lowOk ? "met" : ""}>Хотя бы одна строчная латинская буква</li>
              </ul>
            </div>

            <TextField
              id="reg-password"
              label="Пароль"
              type="password"
              value={this.state.password}
              autoComplete="new-password"
              onChange={(e) => this.setState({ password: e.target.value })}
            />
            <TextField
              id="reg-password2"
              label="Повторите пароль"
              type="password"
              value={this.state.rep_password}
              autoComplete="new-password"
              onChange={(e) => this.setState({ rep_password: e.target.value })}
            />

            {this.state.password && !pwdOk && (
              <p className="field-hint" style={{ color: "var(--color-warning)" }}>
                Пароль пока не соответствует требованиям.
              </p>
            )}
            {pwdOk && this.state.rep_password && !matchOk && (
              <p className="field-hint" style={{ color: "var(--color-warning)" }}>
                Введённые пароли не совпадают.
              </p>
            )}

            {this.state.error && (
              <div className="alert alert--error" role="alert">
                {this.state.error}
              </div>
            )}

            <button
              type="button"
              className="btn btn--primary"
              style={{ marginTop: "0.5rem" }}
              disabled={!canSubmit}
              onClick={() => {
                const registerData = {
                  lastName: this.state.lastName,
                  firstName: this.state.firstName,
                  login: this.state.login,
                  password: this.state.password,
                }
                this.setState({
                  error: null,
                  lastName: "",
                  firstName: "",
                  login: "",
                  password: "",
                  rep_password: "",
                })
                this.onRegister(registerData)
              }}
            >
              Зарегистрироваться
            </button>
          </form>

          <div className="auth-switch">
            <span>Уже есть аккаунт? </span>
            <button
              type="button"
              className="link-like"
              onClick={() => {
                this.setState({
                  lastName: "",
                  firstName: "",
                  login: "",
                  password: "",
                  rep_password: "",
                  error: null,
                })
                this.props.onChange("login")
              }}
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Register
