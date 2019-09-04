const express = require('express')
const path = require('path')
const app = express()
const port = 3000 || process.env.port

const sitePath = path.join(__dirname, '../_test-site')

app.use(express.static(sitePath))

app.listen(port, () => {
  console.log(`InGen Site being served on port: ${port}`)
})
