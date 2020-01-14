var express = require('express');
var router = express.Router();

// Require controller modules.
var jewelery_controller = require('../controllers/jeweleryController');

router.get('/all', jewelery_controller.jewelery_list);

router.get('/create', jewelery_controller.jewelery_create_get);

router.post('/create', jewelery_controller.jewelery_create_post);

router.get('/:id', jewelery_controller.jewelery_detail);

router.get('/:id/delete', jewelery_controller.jewelery_delete_get);

router.post('/:id/delete', jewelery_controller.jewelery_delete_post);

router.get('/:id/update', jewelery_controller.jewelery_update_get);

router.post('/:id/update', jewelery_controller.jewelery_update_post);

module.exports = router;