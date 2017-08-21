const express = require('express')
const {Client, Level} = require('labstack')
const EventEmitter = require('events')

const app = express()
const ee = new EventEmitter();

// Initialize LabStack client and log service
const client = new Client('<API_KEY>')
const log = client.log()
log.fields = {
  app_id: 1,
  app_name: 'error-reporting'
}
log.dispatchInterval = 5

// Routes
app.get('/crash', (req, res) => {
  // Automatically report crash (fatal error)
  setImmediate(() => {
    ee.emit('error', new Error('fatal error'))
  })
  res.sendStatus(204)
})

app.get('/error', (req, res) => {
  // Manually report non-fatal error
  try {
    throw new Error('non-fatal error')
  } catch (error) {
    log.error({message: error.message})
  }
  res.sendStatus(204)
})

// Start server
app.listen(1323, function () {
  console.log('Listening on port 1323')
})