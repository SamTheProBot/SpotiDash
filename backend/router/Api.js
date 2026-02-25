const express = require(`express`);
const router = express.Router();
const { UserIdEndpoint } = require(`../controller/UserLogin`);
const { WeeklyplaylistEndpoint } = require(`../controller/Weekly`);
const { BlendplaylistEndpoint } = require(`../controller/Blend`);

router.post(`/UserId`, UserIdEndpoint);
router.post(`/weeklyplaylist`, WeeklyplaylistEndpoint);
router.post(`/blendplaylist`, BlendplaylistEndpoint);

module.exports = router;
