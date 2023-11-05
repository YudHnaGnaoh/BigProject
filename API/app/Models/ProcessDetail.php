<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProcessDetail extends Model
{
    use HasFactory;

    protected $table = 'process_detail_tbl';
    protected $fillable = ['id', 'process_id', 'student_id', 'created_at', 'updated_at'];
    protected $hidden = [];
}
