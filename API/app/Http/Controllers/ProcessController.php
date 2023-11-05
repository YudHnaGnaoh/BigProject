<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\Courses;
use App\Models\Process;
use App\Models\ProcessDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ProcessController extends Controller
{
    public function teacherSchedule(Request $request)
    {
        $Validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users_tbl,email',
        ], [
            'email.required' => 'Missing email',
            'email.email' => 'Needs to be an email',
            'email.exists' => "You don't have an account yet"
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }
        $teacher_id = User::where('email', $request->email)->select('id')->first();
        $process = Process::where('teacher_id', $teacher_id->id)->get();

        return response()->json($process);
    }

    public function studentSchedule(Request $request)
    {
        $Validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:students_tbl,email',
        ], [
            'email.required' => 'Missing email',
            'email.email' => 'Needs to be an email',
            'email.exists' => "You don't have an account yet"
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }
        $student_id = Student::where('email', $request->email)->value('id');

        $process = DB::Table('process_detail_tbl')
            ->join('process_tbl', 'process_detail_tbl.process_id', 'process_tbl.id')
            ->join('students_tbl', 'process_detail_tbl.student_id', 'students_tbl.id')
            ->join('users_tbl', 'process_tbl.teacher_id', 'users_tbl.id')
            ->where('students_tbl.id', $student_id)
            ->select(
                'process_tbl.name AS className',
                'users_tbl.name AS teacherName',
                'process_tbl.schedule AS schedule',
                'process_tbl.duration AS duration',
                'process_tbl.pass AS pass'
            )
            ->get();
        return response()->json($process);
    }

    public function taught(Request $request, User $user, Schedule $schedule)
    {
        $Validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users_tbl,email',
            'course_id' => 'required|exists:process_tbl,course_id',
            'schedule' => 'required|exists:process_tbl,schedule',
        ], [
            'email.required' => 'Missing email',
            'email.email' => 'Needs to be an email',
            'email.exists' => "You don't have an account yet",
            'course_id.required' => 'Missing course_id',
            'course_id.exists' => "Course don't exist",
            'schedule.required' => 'Missing schedule',
            'schedule.exists' => "Schedule don't exist or has been changed",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }
        $teacher_id = User::where('email', $request->email)->value('id');
        $plus = Process::where('teacher_id', $teacher_id)
            ->where('course_id', $request->course_id)
            ->where('schedule', $request->schedule)
            ->value('pass');
        Process::where('teacher_id', $teacher_id)
            ->where('course_id', $request->course_id)
            ->where('schedule', $request->schedule)
            ->update(['pass' => $plus + 1]);
        return response()->json(['check' => true]);
    }
}
