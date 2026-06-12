<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProtocolController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\ThreadController;
use App\Http\Controllers\Api\VoteController;
use App\Services\TypesenseService;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes return JSON. Auth is optional for the demo — requests default
| to user_id = 1. Wrap routes in auth:sanctum middleware for production.
|
*/

// Health check
Route::get('/health', fn () => response()->json(['status' => 'ok', 'timestamp' => now()]));

Route::prefix('v1')->group(function () {

    // Auth Optional
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login',    [AuthController::class, 'login']);
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me',      [AuthController::class, 'me']);
        });
    });

    // Unified search (Typesense)
    Route::get('/search', SearchController::class);

    // Protocols
    Route::apiResource('protocols', ProtocolController::class)->parameters(['protocols' => 'protocol']);
    // Route::get('/protocols/{slug}', [ProtocolController::class, 'show'])->where('slug', '.*');

    // Threads (standalone + nested under protocol)
    Route::apiResource('threads', ThreadController::class)->parameters(['threads' => 'thread']);
    Route::get('/threads/{idOrSlug}', [ThreadController::class, 'show'])->where('idOrSlug', '.*');

    Route::prefix('protocols/{protocol}')->group(function () {
        Route::get('/threads', [ThreadController::class, 'index']);
        Route::get('/reviews', [ReviewController::class, 'index']);
        Route::post('/reviews', [ReviewController::class, 'store']);
    });

    // Comments
    Route::get('/threads/{thread}/comments',  [CommentController::class, 'index']);
    Route::post('/threads/{thread}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}',         [CommentController::class, 'update']);
    Route::delete('/comments/{comment}',      [CommentController::class, 'destroy']);

    // Reviews (standalone)
    Route::put('/reviews/{review}',    [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

    // Votes
    Route::get('/votes',                          [VoteController::class, 'index']);
    Route::post('/threads/{thread}/vote',         [VoteController::class, 'voteThread']);
    Route::post('/comments/{comment}/vote',       [VoteController::class, 'voteComment']);
    Route::post('/protocols/{protocol}/vote',     [VoteController::class, 'voteProtocol']);

    // Reindex Typesense via API
    Route::post('/admin/reindex', function () {
        try {
            $results = app(TypesenseService::class)->reindexAll();
            return response()->json(['success' => true, 'results' => $results]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    });

});