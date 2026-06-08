<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Protocol;
use App\Services\TypesenseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProtocolController extends Controller
{
    public function __construct(private TypesenseService $typesense) {}

    /**
     * GET /api/protocols
     * Supports: ?q=term, ?sort=recent|most_reviewed|top_rated|most_upvoted
     *           ?tags[]=wellness, ?page=1, ?per_page=15
     */
    public function index(Request $request): JsonResponse
    {
        $q       = $request->query('q', '');
        $sort    = $request->query('sort', 'recent');
        $perPage = min((int) $request->query('per_page', 15), 50);

        // Use Typesense when a search term is given
        if ($q) {
            $sortBy = match ($sort) {
                'most_reviewed' => 'reviews_count:desc',
                'top_rated'     => 'average_rating:desc',
                'most_upvoted'  => 'upvotes_count:desc',
                default         => 'created_at:desc',
            };

            $tsOptions = [
                'sort_by'  => $sortBy,
                'per_page' => $perPage,
                'page'     => (int) $request->query('page', 1),
            ];

            if ($request->filled('tags')) {
                $tags = implode(',', (array) $request->query('tags'));
                $tsOptions['filter_by'] = "tags:=[{$tags}]";
            }

            $results = $this->typesense->searchProtocols($q, $tsOptions);

            return response()->json([
                'data'   => $results['hits'] ?? [],
                'meta'   => [
                    'found'    => $results['found'] ?? 0,
                    'page'     => $results['page'] ?? 1,
                    'per_page' => $perPage,
                    'source'   => 'typesense',
                ],
            ]);
        }

        // Fallback: standard DB query
        $query = Protocol::with('author')
            ->where('status', 'published');

        $query = match ($sort) {
            'most_reviewed' => $query->orderByDesc('reviews_count'),
            'top_rated'     => $query->orderByDesc('average_rating'),
            'most_upvoted'  => $query->orderByDesc('upvotes_count'),
            default         => $query->latest(),
        };

        if ($request->filled('tags')) {
            foreach ((array) $request->query('tags') as $tag) {
                $query->whereJsonContains('tags', $tag);
            }
        }

        $protocols = $query->paginate($perPage);

        return response()->json([
            'data' => $protocols->items(),
            'meta' => [
                'found'    => $protocols->total(),
                'page'     => $protocols->currentPage(),
                'per_page' => $protocols->perPage(),
                'last_page' => $protocols->lastPage(),
                'source'   => 'database',
            ],
        ]);
    }

    /**
     *  POST /api/protocols
     */
    public function store(Request $request): JsonResponse 
    {
        $data = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
            'tags'    => 'nullable|array',
            'tags.*'  => 'string|max:50',
            'status'  => ['nullable', Rule::in(['draft', 'published'])],
        ]);

        $data['user_id'] = Auth::id() ?? 1;

        $protocol = Protocol::create($data);
        $protocol->load('author');

        $this->typesense->indexProtocol($protocol);

        return response()->json($protocol, 201);

    }

    /**
     * GET /api/protocols/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $protocol = Protocol::with(['author', 'threads.author', 'reviews.author'])
            ->where('slug', $slug)
            ->orWhere('id', $slug)
            ->firstOrFail();

        $protocol->increment('views_count');

        return response()->json($protocol);
    }


    /**
     * PUT /api/protocols/{id}
     */
    public function update(Request $request, Protocol $protocol): JsonResponse
    {
        $data = $request->validate([
            'title'   => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'tags'    => 'nullable|array',
            'tags.*'  => 'string|max:50',
            'status'  => ['nullable', Rule::in(['draft', 'published', 'archived'])]
        ]);

        $protocol->update($data);
        $fresh = $protocol->fresh('author');

        $this->typesense->indexProtocol($fresh);

        return response()->json($protocol->fresh('author'));
    }

    /**
     * DELETE /api/protocols/{id}
     */
    public function destroy(Protocol $protocol): JsonResponse
    {   
        $this->typesense->deleteProtocol($protocol->id);
        $protocol->delete();

        return response()->json(['message' => 'Protocol deleted']);
    }
}
