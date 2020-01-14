var express = require('express');
var router = express.Router();

// Require controller modules.
var watch_controller = require('../controllers/watchController');

router.get('/all', watch_controller.watch_list);

router.get('/create', watch_controller.watch_create_get);

router.post('/create', watch_controller.watch_create_post);

router.get('/:id', watch_controller.watch_detail);

router.get('/:id/delete', watch_controller.watch_delete_get);

router.post('/:id/delete', watch_controller.watch_delete_post);

router.get('/:id/update', watch_controller.watch_update_get);

router.post('/:id/update', watch_controller.watch_update_post);

module.exports = router;