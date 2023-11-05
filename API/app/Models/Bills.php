<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bills extends Model
{
    use HasFactory;

    protected $table = 'bills_tbl';
    protected $fillable = ['id', 'name', 'email', 'phone', 'schedule_id','schedule', 'created_at', 'updated_at'];
    protected $hidden = [];
}
