<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\ProcessController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\StudentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::controller(UserController::class)->group(function () {
    Route::get('/getRole', 'getRole');
    Route::post('/loginTeacher', 'loginTeacher');
    Route::get('/checkLogin', 'checkLogin');
    Route::post('/logout', 'logout');
    // Route::middleware(['admin'])->group(function () {
    Route::get('/role', 'role');
    Route::get('/user', 'user');
    Route::post('/createRole', 'createRole');
    Route::post('/deleteRole', 'deleteRole');
    Route::post('/editRole', 'editRole');
    Route::post('/switchRole', 'switchRole');
    Route::post('/createUser', 'createUser');
    Route::post('/deleteUser', 'deleteUser');
    Route::post('/editUser', 'editUser');
    Route::post('/switchUser', 'switchUser');
    // });
});

Route::controller(StudentController::class)->group(function () {
    Route::post('/loginStudent', 'loginStudent');
    Route::get('/allStudents', 'allStudents');
    Route::get('/allStudents2', 'allStudents2');
    Route::post('/createStudent', 'createStudent');
    Route::post('/deleteStudent', 'deleteStudent');
    Route::post('/editStudent', 'editStudent');
    Route::post('/switchStudent', 'switchStudent');
});

Route::controller(EducationController::class)->group(function () {
    Route::get('/education', 'education');
    Route::get('/education2', 'education2');
    // Route::middleware(['admin'])->group(function () {
    Route::post('/createEducation', 'createEducation');
    Route::post('/deleteEducation', 'deleteEducation');
    Route::post('/editEducation', 'editEducation');
    Route::post('/switchEducation', 'switchEducation');
    // });
});

Route::controller(CategoryController::class)->group(function () {
    Route::get('/category', 'category');
    Route::get('/allCategory', 'allCategory');
    Route::get('/allCategory2', 'allCategory2');
    // Route::middleware(['admin'])->group(function () {
    Route::post('/createCategory', 'createCategory');
    Route::post('/deleteCategory', 'deleteCategory');
    Route::post('/editCategory', 'editCategory');
    Route::post('/switchCategory', 'switchCategory');
    // });
});

Route::controller(CourseController::class)->group(function () {
    Route::get('/course', 'course');
    Route::get('/allCourse', 'allCourse');
    Route::get('/allCourse2', 'allCourse2');
    Route::get('/sameGradeCourse', 'sameGradeCourse');
    Route::get('/singleCourse', 'singleCourse');
    Route::get('/homePageCourse', 'homePageCourse');
    // Route::middleware(['admin'])->group(function () {
    Route::post('/createCourse', 'createCourse');
    Route::post('/deleteCourse', 'deleteCourse');
    Route::post('/editCourse', 'editCourse');
    Route::post('/switchCourse', 'switchCourse');
    // });
});

Route::controller(ScheduleController::class)->group(function () {
    Route::get('/schedule', 'schedule');
    Route::get('/allSchedule', 'allSchedule');
    Route::get('/getCate', 'getCate');
    Route::get('/getCourse', 'getCourse');
    Route::get('/teacher', 'teacher');
    Route::post('/createSchedule', 'createSchedule');
    Route::post('/deleteSchedule', 'deleteSchedule');
    Route::post('/editSchedule', 'editSchedule');
});


Route::controller(ProcessController::class)->group(function () {
    Route::get('/teacherSchedule', 'teacherSchedule');
    Route::get('/studentSchedule', 'studentSchedule');
    Route::post('/taught', 'taught');
    Route::get('/getProcess', 'getProcess');
    Route::get('/getStudents', 'getStudents');
    Route::post('/addStudent', 'addStudent');
    Route::post('/removeStudent', 'removeStudent');
    Route::post('/removeClass', 'removeClass');
    Route::post('/editPass', 'editPass');
});


Route::controller(MailController::class)->group(function () {
    Route::post('/sendMail', 'sendMail');
    Route::get('/getAllBill', 'getAllBill');
    Route::post('/createClass', 'createClass');
    Route::post('/signUp', 'signUp');
});
