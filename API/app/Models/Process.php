<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Process extends Model
{
    use HasFactory;

    protected $table = 'process_tbl';
    protected $fillable = ['id', 'name', 'teacher_id', 'course_id', 'schedule', 'duration', 'pass', 'created_at', 'updated_at'];
    protected $hidden = [];
}
