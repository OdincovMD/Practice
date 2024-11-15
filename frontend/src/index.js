import React from "react"
import * as ReactDOMClient from "react-dom/client"
import App from "./App"
import "./css/Main.css"
import "./css/Login.css"
import "./css/Register.css"
import "./css/Profile.css"
import "./css/General.css"
import "./css/Header.css"

const app = ReactDOMClient.createRoot(document.getElementById("app"))
app.render(<App />)
