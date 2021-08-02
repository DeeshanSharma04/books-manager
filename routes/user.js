const router = require('express').Router();
const controller = require('../controllers/user');
const middleware = require('../middleware/auth');

router.post('/signup', controller.signUp);

router.post('/login', controller.login);

router.get('/profile', controller.profile);

router.delete('/delete/:id', middleware.userAuth, controller.deleteUser);

router.put('/forgot-password', controller.forgotPassword);

router.put('/reset-password/:token', controller.resetPassword);

module.exports = router;
