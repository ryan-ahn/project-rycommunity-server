const express = require('express');
const commonRoutes = require('./commonRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const labRoutes = require('./labRoutes');
const loungeRoutes = require('./loungeRoutes');
const mainRoutes = require('./mainRoutes');
const adminRoutes = require('./adminRoutes');
const pilotRoutes = require('./pilotRoutes');
const myRoutes = require('./myRoutes');

const router = express.Router();

router.use('/v1/common', commonRoutes);
router.use('/v1/auth', authRoutes);
router.use('/v1/user', userRoutes);
router.use('/v1/lab', labRoutes);
router.use('/v1/lounge', loungeRoutes);
router.use('/v1/main', mainRoutes);
router.use('/v1/admin', adminRoutes);
router.use('/v1/pilot', pilotRoutes);
router.use('/v1/my', myRoutes);

module.exports = router;
