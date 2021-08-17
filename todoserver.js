
const express = require('express')
const cors = require('cors')
const todosite = express()

todosite.use(cors())
todosite.use(express.json())

let tasklist = []

todosite.get("/todos", (req, res) => {
  res.json(tasklist)
})

todosite.post('/todos', (req, res) =>{
  const title = req.body.title
  const date = req.body.date
  const priority = req.body.priority
  const task = {title: title, date: date, priority: priority }
  tasklist.push(task)
  res.json(task)
})

todosite.listen(3000, () =>  {
  console.log("Server is running...")
}) 