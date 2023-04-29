const express = require("express");
const {
    newUserRegistration,
    loginUser,
    currentUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post('/register', newUserRegistration);

router.post('/login', loginUser);

router.get('/current', validateToken, currentUser);

module.exports = router;