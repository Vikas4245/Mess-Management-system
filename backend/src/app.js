import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import studentRouter from './routes/student.routes.js'
import staffRouter from './routes/staff.routes.js'
import adminRouter from './routes/admin.routes.js'
import attendanceRouter from "./routes/attendance.routes.js"
import complaintRouter from "./routes/complaint.routes.js"
import feedbackRouter from "./routes/feedback.routes.js"
import votingRouter from "./routes/voting.routes.js"
import tokenRouter from "./routes/token.routes.js"


//routes declaration
app.use("/api/v1/attendance", attendanceRouter)
app.use("/api/v1/student", studentRouter)
app.use("/api/v1/staff", staffRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/complaint", complaintRouter)
app.use("/api/v1/feedback", feedbackRouter)
app.use("/api/v1/voting", votingRouter)
app.use("/api/v1/token", tokenRouter)

// http://localhost:8000/api/v1/student/register

export { app }