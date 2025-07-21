#!/usr/bin/node
app.get('/status', (req, res) => {
    // AppController.getStatus
})

app.get('/stats', (req, res) => {
    // AppController.getStats
})

app.get('/connect', (req, res) => {
    // AuthController.getConnect
})

app.get('/disconnect', (req, res) => {
    // AuthController.getDsconnect
})

app.get('/users/me', (req, res) => {
    // UserController.getMe
})