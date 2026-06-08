<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Thread;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * GET /api/threads/{thread}/comments
     * Returns root-level comments with nested replies (2 levels deep by default).
     */
    public function index(Thread $thread): JsonResponse
    {
        $comments = Comment::with(['author', 'replies.author', 'replies.replies.author'])
            ->where('thread_id', $thread->id)
            ->whereNull('parent_id')
            ->orderBy('created_at')
            ->get()
            ->map(fn ($c) => $this->formatComment($c));

        return response()->json(['data' => $comments]);
    }

    /**
     * POST /api/threads/{thread}/comments
     */
    public function store(Request $request, Thread $thread): JsonResponse
    {
        $data = $request->validate([
            'body'      => 'required|string|max:10000',
            'parent_id' => [
                'nullable',
                'integer',
                function ($attr, $val, $fail) use ($thread) {
                    if ($val && !Comment::where('id', $val)->where('thread_id', $thread->id)->exists()) {
                        $fail('Parent comment does not belong to this thread.');
                    }
                },
            ],
        ]);

        $comment = Comment::create([
            'user_id'   => Auth::id() ?? 1,
            'thread_id' => $thread->id,
            'parent_id' => $data['parent_id'] ?? null,
            'body'      => $data['body'],
        ]);

        $thread->recalculateComments();
        $comment->load('author');

        return response()->json($comment, 201);
    }

    /**
     * PUT /api/comments/{comment}
     */
    public function update(Request $request, Comment $comment): JsonResponse
    {
        $data = $request->validate([
            'body' => 'required|string|max:10000',
        ]);

        $comment->update($data);

        return response()->json($comment->fresh('author'));
    }

    /**
     * DELETE /api/comments/{comment}
     * Soft-delete: preserves tree, replaces body with [deleted].
     */
    public function destroy(Comment $comment): JsonResponse
    {
        $comment->update(['is_deleted' => true, 'body' => '[deleted]']);

        $comment->thread->recalculateComments();

        return response()->json(['message' => 'Comment deleted.']);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function formatComment(Comment $comment): array
    {
        return [
            'id'              => $comment->id,
            'body'            => $comment->is_deleted ? '[deleted]' : $comment->body,
            'is_deleted'      => $comment->is_deleted,
            'upvotes_count'   => $comment->upvotes_count,
            'downvotes_count' => $comment->downvotes_count,
            'created_at'      => $comment->created_at,
            'updated_at'      => $comment->updated_at,
            'author'          => $comment->author,
            'replies'         => $comment->replies->map(fn ($r) => $this->formatComment($r)),
        ];
    }
}
