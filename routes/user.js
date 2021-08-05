const router = require('express').Router();
const controller = require('../controllers/user');
const middleware = require('../middleware/auth');
const { wrapper } = require('../utils/globalHandler');

router.post('/signup', wrapper(controller.signUp));

router.post('/login', wrapper(controller.login));

router.get('/profile/:id', wrapper(controller.profile));

router.delete(
  '/delete/:id',
  wrapper(middleware.userAuth),
  wrapper(controller.deleteUser)
);

router.put('/logout', wrapper(controller.logout));

router.put('/forgot-password', wrapper(controller.forgotPassword));

router.put('/reset-password/:token', wrapper(controller.resetPassword));

module.exports = router;
