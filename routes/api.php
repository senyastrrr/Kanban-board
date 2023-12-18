<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\StatusController;
use App\Http\Controllers\API\TaskController;
use App\Http\Controllers\API\UsersTaskController;
use App\Http\Controllers\API\UserController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('statuses', StatusController::class);
Route::apiResource('tasks', TaskController::class);
Route::apiResource('users_tasks', UsersTaskController::class);
Route::get('/statuses/get-id-by-name/{name}', [StatusController::class, 'getStatusIdByName']);
Route::get('/tasks/get-by-status/{statusId}', [TaskController::class, 'getTasksByStatusId']);
Route::get('/users_tasks/get-user-id-by-task-id/{taskId}', [UsersTaskController::class, 'getUserIdByTaskId']);
Route::get('/user/{id}', [UserController::class, 'getUserById']);
