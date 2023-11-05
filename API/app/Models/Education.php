<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use HasFactory;

    protected $table = 'educations_tbl';
    protected $fillable = ['id', 'name', 'status', 'created_at', 'updated_at'];
    protected $hidden = [];
}
