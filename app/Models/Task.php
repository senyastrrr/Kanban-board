<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'category',
        'task', 
        'start_date', 
        'end_date', 
        'status_id'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'users_tasks', 'task_id', 'user_id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}
