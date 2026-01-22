<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Issue extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'status',
        'latitude',
        'longitude',
        'address',
        'photo_path',
        'user_id',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function updates()
    {
        return $this->hasMany(IssueUpdate::class);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->when($category, function ($query, $category) {
            return $query->where('category', $category);
        });
    }

    public function scopeByStatus($query, $status)
    {
        return $query->when($status, function ($query, $status) {
            return $query->where('status', $status);
        });
    }
}