var express = require('express');
var router = express.Router();

// Require controller modules.
var jewelery_controller = require('../controllers/jeweleryController');

router.get('/jewelery/all', jewelery_controller.jewelery_list);

router.get('/jewelery/create', jewelery_controller.jewelery_create_get);

router.post('/jewelery/create', jewelery_controller.jewelery_create_post);

router.get('/jewelery/:id', jewelery_controller.jewelery_detail);

router.get('/jewelery/:id/delete', jewelery_controller.jewelery_delete_get);

router.post('/jewelery/:id/delete', jewelery_controller.jewelery_delete_post);

router.get('/jewelery/:id/update', jewelery_controller.jewelery_update_get);

router.post('/jewelery/:id/update', jewelery_controller.jewelery_update_post);

module.exports = router;