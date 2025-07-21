// controllers/AuthController.js

class AuthController {
  static getConnect(req, res) {
    res.status(200).send('Connect endpoint working');
  }

  static getDisconnect(req, res) {
    res.status(200).send('Disconnect endpoint working');
  }
}

module.exports = AuthController;
