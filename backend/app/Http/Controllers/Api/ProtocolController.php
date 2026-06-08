<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Protocol;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProtocolController extends Controller
{
    public function __construct() {}

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

        $query = Protocol::with('author')->where('status', 'published');

        if($q) {
            $query->where(function ($q2) use ($q) {
                $q2->where('title', 'like', "%${q}%")
                   ->orWhere('content', 'like', "%${q}%");
            });
        }

        $query = match ($sort) {
            'most_reviewed' => $query->orderByDesc('reviews_count'),
            'top_rated'     => $query->orderByDesc('average_rating'),
            'most_upvoted'  => $query->orderByDesc('upvotes_count'),
            default         => $query->latest(),
        };
        
        $protocols = $query->paginate($perPage);

        return response()->json([
            'data' => $protocols->items(),
            'meta' => [
                'found'     => $protocols->total(),
                'page'      => $protocols->currentPage(),
                'per_page'  => $protocols->perPage(),
                'last_page' => $protocols->lastPage(),
            ]
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

        return response()->json($protocol->fresh('author'));
    }

    /**
     * DELETE /api/protocols/{id}
     */
    public function destroy(Protocol $protocol): JsonResponse
    {
        $protocol->delete();

        return response()->json(['message' => 'Protocol deleted']);
    }
}
