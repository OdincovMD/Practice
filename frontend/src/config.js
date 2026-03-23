// Docker (nginx): set REACT_APP_API_BASE=/api at build time — requests go to /api/… and nginx
// forwards to FastAPI. Local `npm start`: leave unset and use package.json "proxy" → /login, /register, /upload.
const BACKEND_URL = process.env.REACT_APP_API_BASE || ""

export default BACKEND_URL