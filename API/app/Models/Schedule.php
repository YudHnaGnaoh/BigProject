<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $table = 'schedule_tbl';
    protected $fillable = ['id', 'course_id', 'user_id', 'time', 'created_at', 'updated_at'];
    protected $hidden = [];
}
