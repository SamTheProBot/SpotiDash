const express = require(`express`);
const router = express.Router();
const { login, callback } = require(`../controller/Oauth`);

router.get(`/login`, login);
router.get(`/callback`, callback);

module.exports = router;
