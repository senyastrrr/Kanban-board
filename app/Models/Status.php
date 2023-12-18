<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'name'
    ];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
