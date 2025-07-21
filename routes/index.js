#!/usr/bin/node
const { express } = require("express");

// Module Imports
const { AppController } = require('../controllers/AppController');
const { UsersController } = require('../controllers/UsersController');
const { AuthController } = require('../controllers/AuthController');

const router = express.Router();

// Endpoints
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconect);
router.get('/users/me', UserController.getMe);