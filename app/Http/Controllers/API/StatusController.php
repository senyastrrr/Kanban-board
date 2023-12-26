<?php
// StatusController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Status;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    public function index()
    {
        $result = cache()->remember('statuses', now()->addMinutes(10), function(){
            return response()->json(Status::all());
        });
        return $result;
    }

    public function store(Request $request)
    {
        $status = Status::create($request->all());
        return response()->json($status, 201);
    }

    public function show(Status $status)
    {
        return response()->json($status);
    }

    public function update(Request $request, Status $status)
    {
        $status->update($request->all());
        return response()->json($status, 200);
    }

    public function destroy(Status $status)
    {
        $status->delete();
        return response()->json(null, 204);
    }

    public function getStatusIdByName($name)
    {
        $result = cache()->remember(`statuses_`.$name, now()->addMinutes(10), function() use ($name){
            $status = Status::where('name', $name)->first();
            if ($status) 
                return response()->json(['id' => $status->id]);
            else
                return null;
        });
        return $result;
    }
}
