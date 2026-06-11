<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

    /**
     * GET /api/threads/{idOrSlug}
     */
    public function show(string $idOrSlug): JsonResponse
    {
        $thread = Thread::with(['author', 'protocol', 'rootComments.author', 'rootComments.replies.author'])
            ->where('slug', $idOrSlug)
            ->orWhere('id', $idOrSlug)
            ->firstOrFail();

        $thread->increment('views_count');

        return response()->json($thread);
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
