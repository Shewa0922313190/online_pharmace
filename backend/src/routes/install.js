// Import the express module
import express from 'express';
// Call the router method from the express module
const router = express.Router();
// Import the install controller
import installController from '../controllers/install.controller.js';
router.get('/install', installController.install);

// Define the route for the install page
//router.get('/install', install); // Directly use the install function

// Export the router to be used in the app.js file
export default router; // Use export default for a single export
