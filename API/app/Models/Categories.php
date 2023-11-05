<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    use HasFactory;

    protected $table = 'categories_tbl';
    protected $fillable = ['id', 'name', 'status', 'education_id', 'created_at', 'updated_at'];
    protected $hidden = [];
}
