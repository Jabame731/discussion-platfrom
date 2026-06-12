<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Protocol;
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
     *  - No existing vote  → create vote,   increment the matching count
     *  - Same type again   → remove vote,   decrement the matching count
     *  - Opposite type     → switch vote,   decrement old count, increment new count
     */
    public function voteThread(Request $request, Thread $thread): JsonResponse
    {
        return $this->handleVote($request, $thread);
    }

    public function voteComment(Request $request, Comment $comment): JsonResponse
    {
        return $this->handleVote($request, $comment);
    }

    public function voteProtocol(Request $request, Protocol $protocol): JsonResponse
    {
        return $this->handleVote($request, $protocol);
    }

    private function handleVote(Request $request, Thread|Comment|Protocol $votable): JsonResponse
    {
        $data = $request->validate([
            'type' => 'required|in:upvote,downvote',
        ]);

        $userId   = Auth::id() ?? 1;
        $type     = $data['type'];
        $opposite = $type === 'upvote' ? 'downvote' : 'upvote';

        $upCol   = 'upvotes_count';
        $downCol = 'downvotes_count';

        $existing = Vote::where('user_id', $userId)
            ->where('votable_type', get_class($votable))
            ->where('votable_id', $votable->id)
            ->first();

        if ($existing) {
            if ($existing->type === $type) {
                // Same vote → toggle off
                $existing->delete();
                $votable->decrement($type === 'upvote' ? $upCol : $downCol);
                $action = 'removed';
            } else {
                // Opposite vote → switch
                $existing->update(['type' => $type]);
                $votable->decrement($opposite === 'upvote' ? $upCol : $downCol);
                $votable->increment($type     === 'upvote' ? $upCol : $downCol);
                $action = 'switched';
            }
        } else {
            // No vote yet → add
            Vote::create([
                'user_id'      => $userId,
                'votable_type' => get_class($votable),
                'votable_id'   => $votable->id,
                'type'         => $type,
            ]);
            $votable->increment($type === 'upvote' ? $upCol : $downCol);
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


    /**
     * GET /api/votes
     *
     * Returns all votes cast by the authenticated user,
     * optionally filtered by vote type and/or votable type.
     *
     * Query params (all optional):
     *   type      – "upvote" | "downvote"
     *   votable   – "thread" | "comment | protocol"
     *
     * Response shape:
     * {
     *   "data": [
     *     {
     *       "id": 1,
     *       "votable_type": "thread" | "comment",
     *       "votable_id": 12,
     *       "type": "upvote"
     *     }
     *   ]
     * }
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'type'    => 'nullable|in:upvote,downvote',
            'votable' => 'nullable|in:thread,comment',
        ]);

        $userId = Auth::id() ?? 1;

        $typeMap = [
            'thread'  => Thread::class,
            'comment' => Comment::class,
            'protocol' => Protocol::class,
        ];

        $query = Vote::query()
            ->where('user_id', $userId);

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('votable')) {
            $query->where(
                'votable_type',
                $typeMap[$request->votable]
            );
        }

        $votes = $query
            ->select(['id', 'votable_type', 'votable_id', 'type'])
            ->get()
            ->map(fn (Vote $vote) => [
                'id' => $vote->id,
                'user_id' => $vote->user_id,
               'votable_type' => match ($vote->votable_type) {
                                    Thread::class   => 'thread',
                                    Comment::class  => 'comment',
                                    Protocol::class => 'protocol',
                                },
                'votable_id' => $vote->votable_id,
                'type' => $vote->type,
            ]);

        return response()->json([
            'data' => $votes,
        ]);
    }


}   