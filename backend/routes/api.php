<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProtocolController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Route::get('/hello', function() {
//     return ['message' => 'Hello Laravel api'];
// });

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes return JSON. Auth is optional for the demo — requests default
| to user_id = 1. Wrap routes in auth:sanctum middleware for production.
|
*/

/**
 *  test for deployment only
 *  URL => /api/status
 *  */
Route::get('/status', function () {
    return response()->json([
        'status' => 'ok'
    ]);
});

Route::prefix('v1')->group(function () {

    // Auth
    Route::prefix('auth')->group(function() {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    // Protocols
    Route::apiResource('protocols', ProtocolController::class)->parameters(['protocols' => 'protocol']);
    // Override show to accept slug or id
    Route::get('/protocols/{slug}', [ProtocolController::class, 'show'])->where('slug', '.*');



});