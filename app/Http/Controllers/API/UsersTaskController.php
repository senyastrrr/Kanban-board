<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\UsersTask;
use Illuminate\Http\Request;

class UsersTaskController extends Controller
{
    public function index()
    {
        return UsersTask::all();
    }

    public function show($id)
    {
        return UsersTask::findOrFail($id);
    }

    public function store(Request $request)
    {
        return UsersTask::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $userTask = UsersTask::findOrFail($id);
        $userTask->update($request->all());

        return $userTask;
    }

    public function destroy($id)
    {
        $userTask = UsersTask::findOrFail($id);
        $userTask->delete();

        return 204;
    }

    public function getUserIdByTaskId($id)
    {
        $result = cache()->remember(`user_tasks_`.$id, now()->addMinutes(10), function() use ($id){
            $userTask = UsersTask::where('task_id', $id)->first();
            if ($userTask) 
                return response()->json(['id' => $userTask->user_id]);
            else
                return null;
        });
        return $result;
    }
}
