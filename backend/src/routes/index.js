import express from 'express';
import installRoutes from './install.js'; // Ensure .js is included if necessary
import AuthenticationRoute from './Authentication.route.js';

const router = express.Router();

router.use(AuthenticationRoute);
router.use(installRoutes);

export default router; // Use export default for a single export
