const router = require('express').Router();
const controller = require('../controllers/books');
const middleware = require('../middleware/auth');
const { wrapper } = require('../utils/globalHandler');

router.get('/', wrapper(controller.getAll));

router.get('/:id', wrapper(controller.getOne));

router.post('/new', wrapper(controller.newBook));

router.put(
  '/update/:id',
  wrapper(middleware.bookAuth),
  wrapper(controller.update)
);

router.delete(
  '/delete/:id',
  wrapper(middleware.bookAuth),
  wrapper(controller.deleteBook)
);

router.delete('/delete', wrapper(controller.deleteAll));

module.exports = router;
