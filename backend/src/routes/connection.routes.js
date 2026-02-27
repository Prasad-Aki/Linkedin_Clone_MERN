import express from "express"
import isAuth from "../middlewares/isAuth.js"
import connection, { acceptConnection, getconnectionrequests, getConnectionStatus, getUserConnections, rejectConnection, removeConnection } from "../controllers/connection.controllers.js"

const connectionRouter = express.Router()

connectionRouter.get("/send/:id", isAuth, connection)
connectionRouter.get("/accept/:connectionId", isAuth, acceptConnection)
connectionRouter.get("/reject/:connectionId", isAuth, rejectConnection)
connectionRouter.get("/getstatus/:userId", isAuth, getConnectionStatus)
connectionRouter.get("/remove/:userId", isAuth, removeConnection)
connectionRouter.get("/requests/", isAuth, getconnectionrequests)
connectionRouter.get("/", isAuth, getUserConnections)

export default connectionRouter