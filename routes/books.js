const router = require('express').Router();
const controller = require('../controllers/books');
const middleware = require('../middleware/auth');

router.get('/', controller.getAll);

router.get('/:id', controller.getOne);

router.post('/new', controller.newBook);

router.put('/update/:id', middleware.bookAuth, controller.update);

router.delete('/delete/:id', middleware.bookAuth, controller.deleteBook);

router.delete('/delete', controller.deleteAll);

module.exports = router;
