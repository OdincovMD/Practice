import React from "react"
import AppShell from "./components/AppShell"
import Login from "./components/Login"
import Register from "./components/Register"
import Profile from "./components/Profile"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      window: "login",
      audience: "patient",
    }
    this.changeState = this.changeState.bind(this)
    this.setAudience = this.setAudience.bind(this)
    this.userData = {}
  }

  setAudience(audience) {
    this.setState({ audience })
  }

  render() {
    const { window: view, audience } = this.state
    return (
      <AppShell audience={audience} onAudienceChange={this.setAudience}>
        {view === "login" && (
          <Login onChange={this.changeState} audience={audience} />
        )}
        {view === "register" && (
          <Register onChange={this.changeState} audience={audience} />
        )}
        {view === "profile" && (
          <Profile
            onChange={this.changeState}
            userData={this.userData}
            audience={audience}
          />
        )}
      </AppShell>
    )
  }

  changeState(next, additionalData = null) {
    this.setState({ window: next })
    if (additionalData) this.userData = additionalData
    else this.userData = {}
  }
}

export default App
