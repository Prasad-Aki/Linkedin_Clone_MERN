import express from "express"
import isAuth from "../middlewares/isAuth.js"
import connection, { acceptConnection, rejectConnection } from "../controllers/connection.controllers.js"

const connectionRouter = express.Router()

connectionRouter.get("/send/:id", isAuth, connection)
connectionRouter.get("/accept/:connectionId", isAuth, acceptConnection)
connectionRouter.get("/reject/:connectionId", isAuth, rejectConnection)

export default connectionRouter