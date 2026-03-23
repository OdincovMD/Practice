import React from "react"

export default class AppShell extends React.Component {
  componentDidMount() {
    document.documentElement.classList.add(`audience-${this.props.audience}`)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.audience !== this.props.audience) {
      document.documentElement.classList.remove(`audience-${prevProps.audience}`)
      document.documentElement.classList.add(`audience-${this.props.audience}`)
    }
  }

  componentWillUnmount() {
    document.documentElement.classList.remove(`audience-${this.props.audience}`)
  }

  render() {
    const { audience, onAudienceChange, children } = this.props
    return (
      <div className="app-shell">
        <header className="app-topbar">
          <div className="app-brand">
            <span className="app-brand__title">Скрининг пневмонии по рентгену</span>
            <span className="app-brand__tagline">
              Вспомогательный анализ снимков для врачей и пациентов. Не заменяет очный осмотр.
            </span>
          </div>
          <div
            className="audience-toggle"
            role="group"
            aria-label="Режим интерфейса"
          >
            <button
              type="button"
              aria-pressed={audience === "patient"}
              onClick={() => onAudienceChange("patient")}
            >
              Пациент
            </button>
            <button
              type="button"
              aria-pressed={audience === "clinical"}
              onClick={() => onAudienceChange("clinical")}
            >
              Специалист
            </button>
          </div>
        </header>
        <div className="app-main">{children}</div>
        <footer className="app-footer-note">
          Сервис предназначен для предварительной оценки. Решение о диагнозе и лечении принимает
          врач на основании клинической картины и обследований.
        </footer>
      </div>
    )
  }
}
