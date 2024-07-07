import React from "react"
import Header from "./components/Header"
import Login from "./components/Login"
import Register from "./components/Register"
import Card from "./components/card"

class App extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            window: "login"
        }

        this.changeState = this.changeState.bind(this)
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

        else if (this.state.window === "card")
            return (
                <div className="card">
                    <Header title="Профиль" />
                    <main>
                        <Card onChange={this.changeState} />
                    </main>

                </div>
            )
    }

    changeState(state) {
        this.setState({ window: state })
    }
}

export default App