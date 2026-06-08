<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Thread;
use App\Models\Vote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoteController extends Controller
{
    /**
     * POST /api/threads/{thread}/vote
     * POST /api/comments/{comment}/vote
     *
     * Body: { "type": "upvote" | "downvote" }
     *
     * Behaviour:
     *  - No existing vote  → create vote
     *  - Same type again   → remove vote (toggle off)
     *  - Opposite type     → switch vote
     */
    public function voteThread(Request $request, Thread $thread): JsonResponse
    {
        return $this->handleVote($request, $thread);
    }

    public function voteComment(Request $request, Comment $comment): JsonResponse
    {
        return $this->handleVote($request, $comment);
    }

    private function handleVote(Request $request, Thread|Comment $votable): JsonResponse
    {
        $data = $request->validate([
            'type' => 'required|in:upvote,downvote',
        ]);

        $userId = Auth::id() ?? 1;

        $existing = Vote::where('user_id', $userId)
            ->where('votable_type', get_class($votable))
            ->where('votable_id', $votable->id)
            ->first();

        if ($existing) {
            if ($existing->type === $data['type']) {
                // Same vote → toggle off
                $existing->delete();
                $action = 'removed';
            } else {
                // Switch vote
                $existing->update(['type' => $data['type']]);
                $action = 'switched';
            }
        } else {
            Vote::create([
                'user_id'      => $userId,
                'votable_type' => get_class($votable),
                'votable_id'   => $votable->id,
                'type'         => $data['type'],
            ]);
            $action = 'added';
        }

        $votable->refresh();

        return response()->json([
            'action'          => $action,
            'upvotes_count'   => $votable->upvotes_count,
            'downvotes_count' => $votable->downvotes_count,
            'score'           => $votable->upvotes_count - $votable->downvotes_count,
        ]);
    }
}
