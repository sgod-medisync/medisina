import express from 'express'
import * as authController from './auth.controller.js';
import { register, login, forgotPassword, resetPassword, updateUser } from './auth.validation.js'
import validate from '#middleware/validateRequests.js';
import { auth } from '#middleware/auth.js';


const router = express.Router()


router.route('/')
  .get(auth('Admin', 'Nurse', 'Doctor'), authController.fetchAllUsers)
  .put(auth('Admin', 'Nurse', 'Doctor','Teacher'), validate({ body: updateUser }), authController.updateUser)

router.route('/search')
  .get(auth('Admin', 'Nurse', 'Doctor'), authController.searchUsers)

router.route('/count')
  .get(auth('Admin', 'Nurse', 'Doctor'), authController.getAllUserCount)

// Removed public email enumeration endpoint - check during registration instead
router.get('/check-email/:email', authController.isDuplicateEmail)

router.put('/toggle-status', auth('Admin'), authController.toggleAllStatus)

router.post('/login', validate({ body: login }), authController.login)

router.post('/register', validate({ body: register }), authController.registerOrCreate)

router.post('/forgot-password', validate({ body: forgotPassword }), authController.forgotPassword)

// Support both body and URL parameter for reset password
router.post('/reset-password', validate({ body: resetPassword }), authController.resetPassword)
router.post('/reset-password/:token', authController.resetPasswordWithToken)

router.delete('/logout', auth(), authController.logout);

router.get('/status', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ authenticated: false, user: null, message: 'User not authenticated.' });
  }
  return res.json({
    authenticated: true,
    user: {
      id: req.user._id,

      fullName: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      role: req.user.role,
      schoolId: req.user.schoolId,
      schoolName: req.user.schoolName,
      schoolDistrictDivision: req.user.schoolDistrictDivision,
      createdAt: req.user.createdAt,
      userId: req.user.userId,
      status: req.user.status
    }
  });
})


export default router
