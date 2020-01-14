var express = require('express');
var router = express.Router();

// Require controller modules.
var watch_controller = require('../controllers/watchController');

router.get('/watches/all', watch_controller.watch_list);

router.get('/watches/create', watch_controller.watch_create_get);

router.post('/watches/create', watch_controller.watch_create_post);

router.get('/watches/:id', watch_controller.watch_detail);

router.get('/watches/:id/delete', watch_controller.watch_delete_get);

router.post('/watches/:id/delete', watch_controller.watch_delete_post);

router.get('/watches/:id/update', watch_controller.watch_update_get);

router.post('/watches/:id/update', watch_controller.watch_update_post);

module.exports = router;