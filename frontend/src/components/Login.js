import React from "react"
import BACKEND_URL from "../config"
import { TextField } from "./ui/TextField"

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      login: "",
      password: "",
    }
  }

  async onLogin(loginData) {
    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(loginData),
      })

      if (!response.ok) {
        this.setState({ error: `Сервер ответил кодом ${response.status}` })
        return
      }

      const responseJSON = await response.json()
      if (!responseJSON.isValid) {
        this.setState({ error: "Неверный логин или пароль" })
        return
      }
      this.setState({ error: null })
      this.props.onChange("profile", {
        firstName: responseJSON.data.firstName,
        lastName: responseJSON.data.lastName,
      })
    } catch (err) {
      this.setState({
        error: "Не удалось связаться с сервером. Проверьте подключение.",
      })
    }
  }

  render() {
    const { audience } = this.props
    const canSubmit = Boolean(this.state.password && this.state.login)
    return (
      <div className="auth-layout">
        <div className="auth-card">
          <header className="auth-card__header">
            <p className="auth-card__eyebrow">Доступ</p>
            <h1 className="auth-card__title">Вход в личный кабинет</h1>
            <div className="auth-card__lead-slot">
              <p className="auth-card__lead patient-hint">
                Войдите, чтобы загрузить снимок и получить текстовый результат анализа.
              </p>
              <p className="auth-card__lead clinical-only">
                Авторизация для доступа к модулю загрузки исследований. Данные передаются по
                защищённому каналу приложения.
              </p>
            </div>
          </header>

          <form
            onSubmit={(e) => e.preventDefault()}
            aria-describedby={this.state.error ? "login-error" : undefined}
          >
            <TextField
              id="login-username"
              label="Логин"
              value={this.state.login}
              autoComplete="username"
              onChange={(e) => this.setState({ login: e.target.value })}
              placeholder={audience === "clinical" ? "Учётная запись" : "Ваш логин"}
            />
            <TextField
              id="login-password"
              label="Пароль"
              type="password"
              value={this.state.password}
              autoComplete="current-password"
              onChange={(e) => this.setState({ password: e.target.value })}
              placeholder="••••••••"
            />

            {this.state.error && (
              <div id="login-error" className="alert alert--error" role="alert">
                {this.state.error}
              </div>
            )}

            <button
              type="button"
              className="btn btn--primary"
              style={{ marginTop: "0.5rem" }}
              disabled={!canSubmit}
              onClick={() => {
                const loginData = {
                  login: this.state.login,
                  password: this.state.password,
                }
                this.setState({ login: "", password: "", error: null })
                this.onLogin(loginData)
              }}
            >
              Войти
            </button>
          </form>

          <div className="auth-switch">
            <span>Ещё не зарегистрированы? </span>
            <button
              type="button"
              className="link-like"
              onClick={() => {
                this.setState({ login: "", password: "", error: null })
                this.props.onChange("register")
              }}
            >
              Создать аккаунт
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
