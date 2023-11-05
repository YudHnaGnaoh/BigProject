<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $table = 'students_tbl';
    protected $fillable = [
        'id',
        'name',
        'email',
        'phone',
        'status',
        // 'password',
        'created_at',
        'updated_at'
    ];
    protected $hidden = [];
}
