const express = require('express')


const {
    addTask,
    getTask,
    getTasks,
    updateTask,
    deleteTask
} = require('../controllers/task')


const router = express.Router();

const { protect, authorize } = require('../middlewares/auth')

router
    .route('/')
    .get(protect,authorize('user','admin'),getTasks)
    .post(protect,addTask)

router
    .route('/:id')
    .get(getTask)
    .put(protect,authorize('user','admin'),updateTask)
    .delete(protect,authorize('user','admin'),deleteTask)

module.exports = router;