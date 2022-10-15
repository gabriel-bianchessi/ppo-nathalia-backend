import { Router, Request, Response } from "express"
import { RunResult } from "sqlite3"
import db from "../database"
import bcrypt from "bcrypt"
import { randomBytes } from "crypto"
const session: any = []

const router = Router()

router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body

  db.get("SELECT * FROM user WHERE email = ?", [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (!row) {
      return res.status(400).json({ error: "Invalid email or password" })
    }

    bcrypt.compare(password, row.password, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      if (!result) {
        return res.status(400).json({ error: "Invalid email or password" })
      }

      randomBytes(48, (err: any, buffer: any) => {
        const token = buffer.toString('hex')
        session.push({ token, userId: row.id })
        console.log(session)
        res.cookie('sesid', token, { httpOnly: true, secure: true, sameSite: 'none' })
        res.json({ "message": "success"})
     })
    })
  })
})

router.post("/register", (req: Request, res: Response) => {
  const { 
    name,
    email, 
    password, 
    birthDate, 
    description, 
    type 
  } = req.body

  const sql = `INSERT INTO user (name, email, password, birthDate, description, type, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`
  const encryptedPassword = bcrypt.hashSync(password, 10)
  const values = [name, email, encryptedPassword, birthDate, description, type, new Date().toISOString()]

  db.run(sql, values, function(this: RunResult,err) {
    if (err) {
      res.status(400).json({ error: err.message })
    }

    res.json({ 
      "message": "success",
      "data": values,
      "id": this.lastID 
    })
  })
})

router.get("/logged", async (req: Request, res: Response) => {
  const token = req.cookies.sesid
  const user = await session.find((user: any) => user.token === token)
  if (user) {
    return res.json({ "message": "success", "data": user })
  }

  res.status(400).json({ "message": "error" })
})

router.get("/logout", async (req: Request, res: Response) => {
  const token = req.cookies.sesid
  const user = await session.find((user: any) => user.token === token)
  if (user) {
    const index = session.indexOf(user)
    session.splice(index, 1)
    res.json({ "message": "success" })
  } 

  res.json({ "message": "error" })
}) 

export default router
