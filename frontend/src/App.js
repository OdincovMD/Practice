import React from "react"
import Header from "./components/Header"
import Login from "./components/Login"
import Register from "./components/Register"
import Profile from "./components/Profile"

class App extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            window: "login",
            name: "",
            surname: ""
        }

        this.changeState = this.changeState.bind(this)
        this.userData = {}
    }

    render() {
        if (this.state.window === "login")
            return (
                <div className="login">

                    <Header title="Форма входа" />
                    <main>
                        <Login onChange={this.changeState} />
                    </main>

                </div>
            )

        else if (this.state.window === "register")
            return (
                <div className="register">

                    <Header title="Форма регистрации" />
                    <main>
                        <Register onChange={this.changeState} />
                    </main>

                </div>)

        else if (this.state.window === "profile")
            return (
                <div className="profile">
                    <Header title="Профиль" />
                    <main>
                        <Profile onChange={this.changeState} userData={this.userData} />
                    </main>

                </div>
            )
    }

    changeState(state, additionalData = null) {
        this.setState({ window: state })
        if (additionalData)
            this.userData = additionalData
        else
            this.userData = {}
    }
}

export default App