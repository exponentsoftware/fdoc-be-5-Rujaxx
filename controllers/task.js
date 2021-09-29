const Task = require('../models/Task')
const asyncHandler = require('../middlewares/async')
const ErrorResponse = require('../utils/errorResponse');


// @desc      Get all tasks
// @route     GET /api/v1/tasks
// @access    Public
exports.getTasks = asyncHandler(async(req,res,next) => {
  let query

 

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 5
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Task.countDocuments() 

  // Executing query
  const tasks = await query.skip(startIndex).limit(limit)

  // Pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }
tasks = await query
    res.status(200).json({
        success : true,
        count : tasks.length,
        // pagination : pagination,
        data : tasks
    })

})

// @desc      Get a task
// @route     GET /api/v1/tasks/:id
// @access    Public
exports.getTask = asyncHandler(async(req,res,next) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return next(
          new ErrorResponse(`task not found with id of ${req.params.id}`, 404)
        );
      }

      

    res.status(200).json({
        success : true,
        data : task
    })
})

// @desc      add a task
// @route     POST /api/v1/tasks
// @access    Public
exports.addTask = asyncHandler(async(req,res,next) => {
    const task = await Task.create(req.body);

    res.status(200).json({
        success : true,
        data : task
    })
})

// @desc      update a task
// @route     PUT /api/v1/tasks/:id
// @access    Public
exports.updateTask = asyncHandler(async(req,res,next) => {
    let task = await Task.findById(req.params.id);
    console.log(req.user.id)

    if (!task) {
        return next(
          new ErrorResponse(`task not found with id of ${req.params.id}`, 404)
        );
      }

      // Make sure user is task owner
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this task`,
          401
        )
      );
    }

    task = await Task.findByIdAndUpdate(req.params.id,req.body,{
      new: true,
      validators : true
    });

    res.status(200).json({
        success : true,
        data : task
    })  
})


// @desc      DELETE a task
// @route     DELETE /api/v1/tasks/:id
// @access    Public
exports.deleteTask = asyncHandler(async(req,res,next) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return next(
          new ErrorResponse(`task not found with id of ${req.params.id}`, 404)
        );
      }

     // Make sure user is task owner
     if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this task`,
          401
        )
      );
    }

    task.remove();

    res.status(200).json({
        success:true,
        message: "deleted succesfully"
      })
})

