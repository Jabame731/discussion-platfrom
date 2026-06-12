<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Vote extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'votable_type',
        'votable_id',
        'type'
    ];

    protected static function booted()
    {
        // $recalc = function (Vote $v) {
        //     $v->votable?->recalculateVotes();
        // };
        
        // static::created($recalc);
        // static::updated($recalc);
        // static::deleted($recalc);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function votable(): MorphTo
    {
        return $this->morphTo();
    }
}
