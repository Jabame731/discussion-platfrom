<?php

namespace App\Models;

use App\Services\TypesenseService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;

class Thread extends Model
{
    /** @use HasFactory<\Database\Factories\ThreadFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'protocol_id',
        'title',
        'slug',
        'body',
        'tags',
        'status',
        'views_count',
        'comments_count',
        'upvotes_count',
        'downvotes_count',
    ];

    protected $casts = [
        'tags' => 'array'
    ];


    protected static function booted()
    {
        static::creating(function (Thread $thread) {
            if (empty($thread->slug)) {
                $thread->slug = static::uniqueSlug($thread->title);
            }
        });

        static::updating(function (Thread $thread) {
            if ($thread->isDirty('title') && !$thread->isDirty('slug')) {
                $thread->slug = static::uniqueSlug($thread->title);
            }
        });
        
        static::created(fn (Thread $t) => app(TypesenseService::class)->indexThread($t));
        static::updated(fn (Thread $t) => app(TypesenseService::class)->indexThread($t));
        static::deleted(fn (Thread $t) => app(TypesenseService::class)->deleteThread($t->id));
    }


    private static function uniqueSlug(string $title): string
    {
        $slug = Str::slug($title);
        $count = static::where('slug', 'like', "{$slug}%")->count();
        return $count ? "{$slug}-{$count}" : $slug;
    }

    // Relationships
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function protocol(): BelongsTo
    {
        return $this->belongsTo(Protocol::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function rootComments(): HasMany
    {
        return $this->hasMany(Comment::class)->whereNull('parent_id')->orderBy('created_at');
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

    public function recalculateComments(): void
    {
        $this->comments_count = $this->comments()->where('is_deleted', false)->count();
        $this->saveQuietly();
    }


    // Scopes
    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
              ->orWhere('body', 'like', "%{$term}%");
        });
    }

}
