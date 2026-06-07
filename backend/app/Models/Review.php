<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    /** @use HasFactory<\Database\Factories\ReviewFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'protocol_id',
        'rating',
        'feedback'
    ];

    protected $casts = [
        'rating' => 'integer'
    ];


    protected static function booted(): void
    {
        // Recalculate protocol's cached rating on any review change
        static::created(fn (Review $r) => $r->protocol->recalculateRating());
        static::updated(fn (Review $r) => $r->protocol->recalculateRating());
        static::deleted(fn (Review $r) => $r->protocol->recalculateRating());
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function protocol(): BelongsTo
    {
        return $this->belongsTo(Protocol::class);
    }
}
