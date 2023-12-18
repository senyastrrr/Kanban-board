<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class UsersTask extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'user_id', 
        'task_id'
    ];
}

