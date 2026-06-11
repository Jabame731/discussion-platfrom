<?php

namespace App\Models;

use App\Services\TypesenseService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;

class Protocol extends Model
{
    /** @use HasFactory<\Database\Factories\ProtocolFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'content',
        'tags',
        'status',
        'views_count',
        'reviews_count',
        'average_rating',
        'upvotes_count',
        'downvotes_count'
    ];

    protected $casts = [
        'tags'           => 'array',
        'average_rating' => 'float'
    ];


    public function getRouteKeyName(): string
    {
        return 'slug';
    }
    
    // SLUG AUTO-GENERATION
    protected static function booted(): void 
    {
        static::creating(function (Protocol $protocol) {
            if(empty($protocol->slug)) {
                $protocol->slug = static::uniqueSlug($protocol->title);
            }
        });

        static::updating(function (Protocol $protocol) {
            if($protocol->isDirty('title') && !$protocol->isDirty('slug')) {
                $protocol->slug = static::uniqueSlug($protocol->title);
            }
        });

        // Typesense sync
        static::created(fn (Protocol $p) => app(TypesenseService::class)->indexProtocol($p));
        static::updated(fn (Protocol $p) => app(TypesenseService::class)->indexProtocol($p));
        static::deleted(fn (Protocol $p) => app(TypesenseService::class)->deleteProtocol($p->id));

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

    public function threads(): HasMany
    {
        return $this->hasMany(Thread::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function votes(): MorphMany
    {
        return $this->morphMany(Vote::class, 'votable');
    }


    //Helpers
    public function recalculateRating(): void
    {
        $stats = $this->reviews()->selectRaw('COUNT(*) as cnt, AVG(rating) as avg')->first();
        $this->reviews_count = $stats->cnt ?? 0;
        $this->average_rating = round($stats->avg ?? 0, 2);
        $this->saveQuietly();
    }

    public function recalculateVotes(): void
    {
        $this->upvotes_count = $this->votes()->where('type', 'upvote')->count();
        $this->downvotes_count = $this->votes()->where('type', 'downvote')->count();
        $this->saveQuietly();
    }

    //Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
              ->orWhere('content', 'like', "%{$term}%");
        });
    }
}
