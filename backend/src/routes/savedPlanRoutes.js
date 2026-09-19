const express = require('express');
const router = express.Router();
const savedPlanController = require('../controllers/savedPlanController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, savedPlanController.createSavedPlan);
router.get('/', auth, savedPlanController.getMySavedPlans);
router.delete('/:id', auth, savedPlanController.deleteSavedPlan);

module.exports = router;
