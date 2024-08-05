const express = require('express');
const { saveUserDetails, getUserDetailsById } = require('../controllers/userDetailsController');
const router = express.Router();

router.post('/saveUserDetails', saveUserDetails);
router.get('/:userId', getUserDetailsById); // Route to fetch user details by ID

module.exports = router;
