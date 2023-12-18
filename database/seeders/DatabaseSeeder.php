<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Status;
use App\Models\Task;
use App\Models\UsersTask;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Создание пользователей
        User::create([
            'name' => 'John Doe',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('joker123'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Jane Doe',
            'email' => 'user@gmail.com',
            'password' => bcrypt('joker123'),
            'role' => 'user',
        ]);

        // Создание статусов
        Status::create(['name' => 'Backlog']);
        Status::create(['name' => 'Ready']);
        Status::create(['name' => 'Doing']);
        Status::create(['name' => 'Review']);
        Status::create(['name' => 'Blocked']);
        Status::create(['name' => 'Done']);

        // Создание задач
        Task::create([
            'category' => 'Design',
            'task' => 'Create homepage design',
            'start_date' => now()->subDays(2),
            'end_date' => now()->addDays(10),
            'status_id' => 1,
        ]);

        Task::create([
            'category' => 'Backend',
            'task' => 'Implement user authentication',
            'start_date' => now()->subDays(1),
            'end_date' => now()->addDays(5),
            'status_id' => 2,
        ]);

        // Создание связей пользователей с задачами
        UsersTask::create(['user_id' => 1, 'task_id' => 1]);
        UsersTask::create(['user_id' => 2, 'task_id' => 2]);
    
    }
}
