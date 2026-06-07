<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Comment extends Model
{
    /** @use HasFactory<\Database\Factories\CommentFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'thread_id',
        'parent_id',
        'body',
        'upvotes_count',
        'downvotes_count',
        'is_deleted'
    ];

    protected $casts = [
        'is_deleted' => 'boolean'
    ];

    // Relationships
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function thread(): BelongsTo
    {
        return $this->belongsTo(Thread::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies(): HasMany 
    {
        return $this->hasMany(Comment::class, 'parent_id')->orderBy('created_at');
    }

    public function votes(): MorphMany
    {
        return $this->morphMany(Vote::class, 'votable');
    }

    // Helpers
    public function recalculateVotes(): void
    {
        $this->upvotes_count = $this->votes()->where('type', 'upvote')->count();
        $this->downvotes_count = $this->votes()->where('type', 'downvote')->count();
        $this->saveQuietly();
    }

    /**
     * Get body for display — hide content if deleted but keep tree intact.
     */
    public function getDisplayBodyAttribute(): string
    {
        return $this->is_deleted ? '[deleted]' : $this->body;
    }


}
