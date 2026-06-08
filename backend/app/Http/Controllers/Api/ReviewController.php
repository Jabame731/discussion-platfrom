<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Protocol;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * GET /api/protocols/{protocol}/reviews
     */
    public function index(Protocol $protocol): JsonResponse
    {
        $reviews = $protocol->reviews()
            ->with('author')
            ->latest()
            ->paginate(15);

        return response()->json([
            'data' => $reviews->items(),
            'meta' => [
                'found'          => $reviews->total(),
                'page'           => $reviews->currentPage(),
                'per_page'       => $reviews->perPage(),
                'last_page'      => $reviews->lastPage(),
                'average_rating' => $protocol->average_rating,
                'reviews_count'  => $protocol->reviews_count,
            ],
        ]);
    }

    /**
     * POST /api/protocols/{protocol}/reviews
     * One review per user per protocol (upsert).
     */
    public function store(Request $request, Protocol $protocol): JsonResponse
    {
        $data = $request->validate([
            'rating'   => 'required|integer|min:1|max:5',
            'feedback' => 'nullable|string|max:2000',
        ]);

        $userId = Auth::id() ?? 1;

        $review = Review::updateOrCreate(
            ['user_id' => $userId, 'protocol_id' => $protocol->id],
            $data
        );

        $review->load('author');

        return response()->json($review, $review->wasRecentlyCreated ? 201 : 200);
    }

    /**
     * PUT /api/reviews/{review}
     */
    public function update(Request $request, Review $review): JsonResponse
    {
        $data = $request->validate([
            'rating'   => 'sometimes|integer|min:1|max:5',
            'feedback' => 'nullable|string|max:2000',
        ]);

        $review->update($data);

        return response()->json($review->fresh('author'));
    }

    /**
     * DELETE /api/reviews/{review}
     */
    public function destroy(Review $review): JsonResponse
    {
        $review->delete();

        return response()->json(['message' => 'Review deleted.']);
    }
}
