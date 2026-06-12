<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Thread;
use App\Models\Protocol;
use App\Services\TypesenseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ThreadController extends Controller
{
    public function __construct(private TypesenseService $typesense) {}

    /**
     * GET /api/threads
     * GET /api/protocols/{protocol}/threads
     */
    public function index(Request $request, ?Protocol $protocol = null): JsonResponse
    {
        $q       = $request->query('q', '');
        $sort    = $request->query('sort', 'recent');
        $perPage = min((int) $request->query('per_page', 15), 50);

        if ($q) {
            $sortBy = match ($sort) {
                'most_upvoted'  => 'upvotes_count:desc',
                'most_comments' => 'comments_count:desc',
                default         => 'created_at:desc',
            };

            $tsOptions = [
                'sort_by'  => $sortBy,
                'per_page' => $perPage,
                'page'     => (int) $request->query('page', 1),
            ];

            if ($protocol) {
                $tsOptions['filter_by'] = "protocol_id:={$protocol->id}";
            }

            $results = $this->typesense->searchThreads($q, $tsOptions);

            return response()->json([
                'data' => $results['hits'] ?? [],
                'meta' => [
                    'found'    => $results['found'] ?? 0,
                    'page'     => $results['page'] ?? 1,
                    'per_page' => $perPage,
                    'source'   => 'typesense',
                ],
            ]);
        }

        $query = Thread::with(['author', 'protocol']);

        if ($protocol) {
            $query->where('protocol_id', $protocol->id);
        }

        $query = match ($sort) {
            'most_upvoted'  => $query->orderByDesc('upvotes_count'),
            'most_comments' => $query->orderByDesc('comments_count'),
            default         => $query->latest(),
        };

        $threads = $query->paginate($perPage);

        return response()->json([
            'data' => $threads->items(),
            'meta' => [
                'found'     => $threads->total(),
                'page'      => $threads->currentPage(),
                'per_page'  => $threads->perPage(),
                'last_page' => $threads->lastPage(),
                'source'    => 'database',
            ],
        ]);
    }

    /**
     * POST /api/threads
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255|unique:threads,title',
            'body'        => 'required|string',
            'protocol_id' => 'nullable|exists:protocols,id',
            'tags'        => 'nullable|array',
            'tags.*'      => 'string|max:50',
        ]);

        $data['user_id'] = Auth::id() ?? 1;

        $thread = Thread::create($data);
        $thread->load(['author', 'protocol']);

        return response()->json($thread, 201);
    }

    public function show(string $idOrSlug): JsonResponse
    {   
        $thread = Thread::with(['author', 'protocol'])
            ->where('slug', $idOrSlug)
            ->orWhere('id', $idOrSlug)
            ->firstOrFail();

        $thread->increment('views_count');

        // Flat fetch ALL comments for this thread
        $allComments = Comment::with('author')
            ->where('thread_id', $thread->id)
            ->orderBy('id')
            ->get()
            ->keyBy('id');

        // Initialize replies on every comment
        foreach ($allComments as $comment) {
            $comment->setRelation('replies', collect());
        }

        // Wire children to parents
        $roots = [];
        foreach ($allComments as $comment) {
            if (is_null($comment->parent_id)) {
                $roots[] = $comment;
            } elseif (isset($allComments[$comment->parent_id])) {
                $allComments[$comment->parent_id]->replies->push($comment);
            }
        }

        // Format the tree
        $formattedComments = array_map(fn ($c) => $this->formatComment($c), $roots);

        return response()->json(array_merge($thread->toArray(), [
            'root_comments' => $formattedComments
        ]));
    }

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
        'replies'         => $comment->replies
                                ->map(fn ($r) => $this->formatComment($r))
                                ->values(),
    ];
}

    /**
     * PUT /api/threads/{id}
     */
    public function update(Request $request, Thread $thread): JsonResponse
    {
        $data = $request->validate([
            'title'  => 'sometimes|string|max:255',
            'body'   => 'sometimes|string',
            'tags'   => 'nullable|array',
            'tags.*' => 'string|max:50',
            'status' => ['nullable', Rule::in(['open', 'closed', 'pinned'])],
        ]);

        $thread->update($data);

        return response()->json($thread->fresh(['author', 'protocol']));
    }

    /**
     * DELETE /api/threads/{id}
     */
    public function destroy(Thread $thread): JsonResponse
    {
        $thread->delete();

        return response()->json(['message' => 'Thread deleted.']);
    }
}
