<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TypesenseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __construct(private TypesenseService $typesense) {}

    /**
     * GET /api/search?q=term&type=protocols|threads|all&sort=...
     */
    public function __invoke(Request $request): JsonResponse
    {
        $q       = $request->query('q', '');
        $type    = $request->query('type', 'all');
        $sort    = $request->query('sort', 'recent');
        $perPage = min((int) $request->query('per_page', 15), 50);
        $page    = (int) $request->query('page', 1);

        $protocolSort = match ($sort) {
            'most_reviewed' => 'reviews_count:desc',
            'top_rated'     => 'average_rating:desc',
            'most_upvoted'  => 'upvotes_count:desc',
            default         => 'created_at:desc',
        };

        $threadSort = match ($sort) {
            'most_upvoted'  => 'upvotes_count:desc',
            'most_comments' => 'comments_count:desc',
            default         => 'created_at:desc',
        };

        $results = [];

        if (in_array($type, ['all', 'protocols'])) {
            $results['protocols'] = $this->typesense->searchProtocols($q, [
                'sort_by'  => $protocolSort,
                'per_page' => $perPage,
                'page'     => $page,
            ]);
        }

        if (in_array($type, ['all', 'threads'])) {
            $results['threads'] = $this->typesense->searchThreads($q, [
                'sort_by'  => $threadSort,
                'per_page' => $perPage,
                'page'     => $page,
            ]);
        }

        return response()->json($results);
    }
}
