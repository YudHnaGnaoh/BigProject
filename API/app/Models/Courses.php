<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Courses extends Model
{
    use HasFactory;

    protected $table = 'courses_tbl';
    protected $fillable = [
        'id', 'image', 'name', 'status', 'duration', 
        'price', 'discount', 'grade', 'summary', 'description', 'cate_id', 
        'created_at', 'updated_at'];
    protected $hidden = [];
}
