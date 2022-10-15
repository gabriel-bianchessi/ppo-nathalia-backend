import express from "express"
import cors from "cors"
import routes from "./routes/routes"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors({
  origin: ["*"],
  credentials: true,
  methods: ["POST", "GET", "OPTIONS", "DELETE"],
  exposedHeaders: ["*", "Authorization"],
  allowedHeaders: ["*", "Authorization"],
}))
app.use(cookieParser())
app.use(express.json())
app.use(routes)

app.listen(8080, ( ) => {
  console.log("Server started on port 8080")
})