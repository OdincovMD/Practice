import React from "react"
import BACKEND_URL from "../config"

const emptyResult = { result: "", probability: "" }

export default class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.fileInputRef = React.createRef()
    this.state = {
      firstName: props.userData.firstName,
      lastName: props.userData.lastName,
      formData: null,
      previewUrl: null,
      infoBad: emptyResult,
      infoGood: emptyResult,
      uploadError: null,
      uploading: false,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleUploadImage = this.handleUploadImage.bind(this)
  }

  handleChange(event) {
    const file = event.target.files && event.target.files[0]
    if (!file) {
      this.setState({
        formData: null,
        previewUrl: null,
        infoBad: emptyResult,
        infoGood: emptyResult,
        uploadError: null,
      })
      return
    }
    if (this.state.previewUrl) {
      URL.revokeObjectURL(this.state.previewUrl)
    }
    const previewUrl = URL.createObjectURL(file)
    this.setState({
      formData: file,
      previewUrl,
      infoBad: emptyResult,
      infoGood: emptyResult,
      uploadError: null,
    })
  }

  componentWillUnmount() {
    if (this.state.previewUrl) URL.revokeObjectURL(this.state.previewUrl)
  }

  async handleUploadImage() {
    if (!this.state.formData) return
    const formData = new FormData()
    formData.append("file", this.state.formData)
    const pneumoniaRe = /^.* пневмония$/i

    this.setState({ uploading: true, uploadError: null })

    try {
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        let message = `Ошибка ${response.status}`
        try {
          const data = await response.json()
          if (data.detail) {
            message =
              typeof data.detail === "string"
                ? data.detail
                : JSON.stringify(data.detail)
          }
        } catch (_) {
          /* ignore */
        }
        this.setState({ uploadError: message, uploading: false })
        return
      }

      const responseJSON = await response.json()
      if (pneumoniaRe.test(responseJSON.result)) {
        this.setState({
          infoBad: responseJSON,
          infoGood: emptyResult,
          uploading: false,
        })
      } else {
        this.setState({
          infoBad: emptyResult,
          infoGood: responseJSON,
          uploading: false,
        })
      }

      if (this.fileInputRef.current) this.fileInputRef.current.value = ""
      if (this.state.previewUrl) URL.revokeObjectURL(this.state.previewUrl)
      this.setState({ formData: null, previewUrl: null })
    } catch (err) {
      this.setState({
        uploadError: "Не удалось выполнить запрос. Проверьте сеть и повторите попытку.",
        uploading: false,
      })
    }
  }

  render() {
    const { audience, onChange } = this.props
    const { infoBad, infoGood, uploadError, uploading } = this.state
    const hasBad = infoBad && infoBad.result !== ""
    const hasGood = infoGood && infoGood.result !== ""

    return (
      <div className="profile-layout">
        <section className="profile-card" aria-labelledby="profile-user-heading">
          <div className="profile-badges">
            <span className="badge">
              {audience === "clinical"
                ? "Личный кабинет · режим специалиста"
                : "Личный кабинет · режим пациента"}
            </span>
          </div>
          <h1 id="profile-user-heading">
            {this.state.firstName} {this.state.lastName}
          </h1>
          <dl className="profile-meta">
            <div>
              <dt>Имя</dt>
              <dd>{this.state.firstName}</dd>
            </div>
            <div>
              <dt>Фамилия</dt>
              <dd>{this.state.lastName}</dd>
            </div>
          </dl>
          <button
            type="button"
            className="btn btn--danger-outline"
            onClick={() => onChange("login")}
          >
            Выйти
          </button>
        </section>

        <section className="profile-card" aria-labelledby="upload-heading">
          <h2 id="upload-heading">Анализ рентген-снимка грудной клетки</h2>
          <div className="profile-upload-lead">
            <p className="field-hint patient-hint">
              Выберите файл (JPG, PNG и т.п.). После обработки вы увидите класс и оценку уверенности
              модели — это ориентир, а не диагноз.
            </p>
            <p className="field-hint clinical-only">
              Загрузка DICOM не поддерживается в этой демо-версии; используйте растровый снимок.
              Результат — выход классификатора (вероятности по softmax).
            </p>
          </div>

          <div className="upload-zone">
            <label htmlFor="xray-file" className="sr-only">
              Файл снимка
            </label>
            <input
              id="xray-file"
              ref={this.fileInputRef}
              type="file"
              accept="image/*"
              onChange={this.handleChange}
              disabled={uploading}
            />
          </div>

          <div className="preview-wrap" aria-live="polite">
            {this.state.previewUrl ? (
              <img
                src={this.state.previewUrl}
                alt="Предпросмотр выбранного снимка"
              />
            ) : (
              <span className="preview-placeholder">
                Предпросмотр появится после выбора файла
              </span>
            )}
          </div>

          {uploadError && (
            <div className="alert alert--error" role="alert">
              {uploadError}
            </div>
          )}

          <div className="stack-gap" style={{ marginTop: "1rem" }}>
            <button
              type="button"
              className="btn btn--primary"
              disabled={!this.state.formData || uploading}
              onClick={this.handleUploadImage}
            >
              {uploading ? "Обработка…" : "Запустить анализ"}
            </button>
          </div>

          {hasBad && (
            <div className="result-panel result-panel--caution" role="status">
              <div className="result-panel__label">Внимание — требуется врачебная оценка</div>
              <div className="result-panel__value">{infoBad.result}</div>
              <div className="result-prob">
                Уверенность модели: {(100 * Number(infoBad.probability)).toFixed(0)}%
              </div>
              <p className="field-hint" style={{ marginTop: "0.75rem" }}>
                Наличие признаков, указывающих на пневмонию по мнению модели, не означает
                окончательный диагноз. Обратитесь к врачу.
              </p>
            </div>
          )}

          {hasGood && (
            <div className="result-panel result-panel--ok" role="status">
              <div className="result-panel__label">Результат модели</div>
              <div className="result-panel__value">{infoGood.result}</div>
              <div className="result-prob">
                Уверенность модели: {(100 * Number(infoGood.probability)).toFixed(0)}%
              </div>
            </div>
          )}
        </section>
      </div>
    )
  }
}
