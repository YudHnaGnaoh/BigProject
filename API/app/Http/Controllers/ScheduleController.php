<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\Courses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ScheduleController extends Controller
{

    public function schedule(Request $request, Schedule $schedule)
    {
        $schedule = DB::table('schedule_tbl')
            ->join('courses_tbl', 'schedule_tbl.course_id', '=', 'courses_tbl.id')
            ->join('users_tbl', 'schedule_tbl.user_id', '=', 'users_tbl.id')
            ->join('role_tbl', 'users_tbl.role_id', '=', 'role_tbl.id')
            ->select('schedule_tbl.*', 'courses_tbl.name AS courseName', 'courses_tbl.cate_id AS cate_id', 'courses_tbl.grade', 'users_tbl.name AS userName', 'role_tbl.name AS roleName')
            ->get();
        return response()->json($schedule);
    }

    public function getCate(Request $request, Categories $categories)
    {
        $categories = Categories::get();
        return response()->json($categories);
    }

    public function getCourse(Request $request, Courses $courses)
    {
        $Validator = Validator::make($request->all(), [
            'cate_id' => 'required|exists:categories_tbl,id',
        ], [
            'cate_id.required' => 'Missing cate_id',
            'cate_id.exists' => "Role_id doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        $courses = Courses::where('cate_id', $request->cate_id)->get();
        return response()->json($courses);
    }

    public function teacher(Request $request, User $user)
    {
        $user = User::where('role_id', '32')->get();
        return response()->json($user);
    }

    public function createSchedule(Request $request, Schedule $schedule)
    {
        $Validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses_tbl,id',
            'user_id' => 'required|exists:users_tbl,id',
            'time' => 'required',
        ], [
            'course_id.required' => 'Missing course_id',
            'course_id.exists' => "Course doesn't exist",
            'user_id.required' => 'Missing user_id',
            'user_id.exists' => "User doesn't exist",
            'time.required' => "Fill in time",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        Schedule::create(['course_id' => $request->course_id, 'user_id' => $request->user_id, 'time' => $request->time, 'created_at' => now()]);
        $schedule = DB::table('schedule_tbl')
            ->join('courses_tbl', 'schedule_tbl.course_id', '=', 'courses_tbl.id')
            ->join('users_tbl', 'schedule_tbl.user_id', '=', 'users_tbl.id')
            ->join('role_tbl', 'users_tbl.role_id', '=', 'role_tbl.id')
            ->select('schedule_tbl.*', 'courses_tbl.name AS courseName', 'courses_tbl.cate_id AS cate_id', 'courses_tbl.grade', 'users_tbl.name AS userName', 'role_tbl.name AS roleName')
            ->get();
        return response()->json($schedule);
    }

    public function deleteSchedule(Request $request, Schedule $schedule)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:schedule_tbl,id',
        ], [
            'id.required' => 'Choose a schedules to delete',
            'id.exists' => "Schedule doesn't exist"
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }
        Schedule::where('id', $request->id)->delete();
        $schedule = DB::table('schedule_tbl')
            ->join('courses_tbl', 'schedule_tbl.course_id', '=', 'courses_tbl.id')
            ->join('users_tbl', 'schedule_tbl.user_id', '=', 'users_tbl.id')
            ->join('role_tbl', 'users_tbl.role_id', '=', 'role_tbl.id')
            ->select('schedule_tbl.*', 'courses_tbl.name AS courseName', 'courses_tbl.cate_id AS cate_id', 'courses_tbl.grade', 'users_tbl.name AS userName', 'role_tbl.name AS roleName')
            ->get();
        return response()->json($schedule);
    }

    public function editSchedule(Request $request, Schedule $schedule)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:schedule_tbl,id',
            'course_id' => 'required|exists:courses_tbl,id',
            'user_id' => 'required|exists:users_tbl,id',
            'time' => 'required',
        ], [
            'id.required' => 'Choose a schedules for usesr',
            'id.exists' => "Schedule doesn't exist",
            'course_id.required' => 'Missing course_id',
            'course_id.exists' => "Course doesn't exist",
            'user_id.required' => 'Missing user_id',
            'user_id.exists' => "User doesn't exist",
            'time.required' => "Fill in time",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        Schedule::where('id', $request->id)->update(['course_id' => $request->course_id, 'user_id' => $request->user_id, 'time' => $request->time, 'updated_at' => now()]);
        $schedule = DB::table('schedule_tbl')
            ->join('courses_tbl', 'schedule_tbl.course_id', '=', 'courses_tbl.id')
            ->join('users_tbl', 'schedule_tbl.user_id', '=', 'users_tbl.id')
            ->join('role_tbl', 'users_tbl.role_id', '=', 'role_tbl.id')
            ->select('schedule_tbl.*', 'courses_tbl.name AS courseName', 'courses_tbl.cate_id AS cate_id', 'courses_tbl.grade', 'users_tbl.name AS userName', 'role_tbl.name AS roleName')
            ->get();
        return response()->json($schedule);
    }
}
