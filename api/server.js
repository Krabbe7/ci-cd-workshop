const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.json())

const port = process.env.PORT || 3001

// Schema for the Name
const nameSchema = new mongoose.Schema({
  name: String,
})
const Name = mongoose.model("Name", nameSchema)

// POST endpoint to add a new name
app.post("/api/names", (req, res) => {
  const inputName = req.body.name
  console.log(`[POST] /api/names - Received name: ${inputName}`)

  if (!inputName || inputName.trim() === "") {
    console.warn("[POST] /api/names - Missing or empty name in request body")
    return res.status(400).send("Name is required")
  }

  const newName = new Name({ name: inputName })
  newName
    .save()
    .then(() => {
      console.log(`[POST] /api/names - Name '${inputName}' added to DB`)
      res.status(201).send("Name added")
    })
    .catch((err) => {
      console.error("[POST] /api/names - Error saving name:", err)
      res.status(400).json(err)
    })
})

// GET endpoint to fetch all names
app.get("/api/names", (req, res) => {
  console.log("[GET] /api/names - Fetching all names from DB")

  Name.find()
    .then((names) => {
      console.log(`[GET] /api/names - Retrieved ${names.length} names`)
      res.json(names)
    })
    .catch((err) => {
      console.error("[GET] /api/names - Error retrieving names:", err)
      res.status(500).json(err)
    })
})

// Health check
app.get("/api/hello", (req, res) => {
  console.log("[GET] /api/hello - Health check OK")
  res.status(200).send("Hello, World!")
})

// Connect to MongoDB
// TODO: You must change the connectionstring to MongoDB when deploying in docker compose
mongoose
  .connect("mongodb://127.0.0.1:27017/mydatabase")
  .then(() => {
    console.log("MongoDB connected...")

    // Start server only if not in test environment
    if (process.env.NODE_ENV !== "test") {
      app.listen(port, () => {
        console.log(`API server listening on port ${port}`)
      })
    }
  })
  .catch((err) => console.log(err))

// Export app for testing
module.exports = app
