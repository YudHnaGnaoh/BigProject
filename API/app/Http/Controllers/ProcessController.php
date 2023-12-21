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
        $process = DB::table('process_tbl')
            ->join('process_detail_tbl', 'process_tbl.id', 'process_detail_tbl.process_id')
            ->groupBy('process_detail_tbl.process_id')
            ->select('process_tbl.*', DB::raw('count(process_detail_tbl.student_id) as student_count'))
            ->where('process_tbl.teacher_id', $teacher_id->id)
            ->get();

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

    public function getProcess(Request $request)
    {
        $process = DB::Table('process_tbl')
            ->join('users_tbl', 'process_tbl.teacher_id', 'users_tbl.id')
            ->join('process_detail_tbl', 'process_tbl.id', 'process_detail_tbl.process_id')
            ->groupBy('process_tbl.id')
            ->select('process_tbl.*', 'process_tbl.name AS className', 'users_tbl.name AS teacher', DB::raw('count(process_detail_tbl.student_id) as student_count'))
            ->orderBy('className')
            ->paginate(5);
        return response()->json($process);
    }

    public function searchClass(Request $request)
    {
        $searchTerm = $request->input('search');
        $process = DB::Table('process_tbl')
            ->join('users_tbl', 'process_tbl.teacher_id', 'users_tbl.id')
            ->join('process_detail_tbl', 'process_tbl.id', 'process_detail_tbl.process_id')
            ->groupBy('process_tbl.id')
            ->where('process_tbl.name', 'LIKE', "%$searchTerm%")
            ->select('process_tbl.*', 'process_tbl.name AS className', 'users_tbl.name AS teacher', DB::raw('count(process_detail_tbl.student_id) as student_count'))
            ->orderBy('className')
            ->paginate(5);
        return response()->json($process);
    }

    public function getStudents(Request $request)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:process_tbl,id',
        ], [
            'id.required' => 'Missing id',
            'id.exists' => "Process don't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        $student = DB::Table('students_tbl')
            ->join('process_detail_tbl', 'students_tbl.id', 'process_detail_tbl.student_id')
            ->where('process_detail_tbl.process_id', $request->id)
            ->select('students_tbl.*')
            ->get();
        return response()->json($student);
    }

    public function addStudent(Request $request, Student $student)
    {
        $Validator = Validator::make($request->all(), [
            'process_id' => 'required|exists:process_tbl,id',
            'student_id' => 'required|exists:students_tbl,id',
        ], [
            'process_id.required' => 'Missing process_id',
            'process_id.exists' => "Process don't exist",
            'student_id.required' => 'Missing student_id',
            'student_id.exists' => "Student don't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }
        $check = ProcessDetail::where('process_id', $request->process_id)->where('student_id', $request->student_id)->first();
        if ($check) {
            return response()->json(['check' => false, 'msg' => 'Student is already in this class']);
        } else {
            ProcessDetail::create(['process_id' => $request->process_id, 'student_id' => $request->student_id]);
            $student = DB::Table('students_tbl')
                ->join('process_detail_tbl', 'students_tbl.id', 'process_detail_tbl.student_id')
                ->where('process_detail_tbl.process_id', $request->process_id)
                ->select('students_tbl.*')
                ->get();
            return response()->json($student);
        }
    }

    public function removeStudent(Request $request, Student $student)
    {
        $Validator = Validator::make($request->all(), [
            'process_id' => 'required|exists:process_tbl,id',
            'student_id' => 'required|exists:students_tbl,id',
        ], [
            'process_id.required' => 'Missing process_id',
            'process_id.exists' => "Process don't exist",
            'student_id.required' => 'Missing student_id',
            'student_id.exists' => "Student don't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        ProcessDetail::where('process_id', $request->process_id)
            ->where('student_id', $request->student_id)
            ->delete();
        $student = DB::Table('students_tbl')
            ->join('process_detail_tbl', 'students_tbl.id', 'process_detail_tbl.student_id')
            ->where('process_detail_tbl.process_id', $request->process_id)
            ->select('students_tbl.*')
            ->get();
        return response()->json($student);
    }

    public function removeClass(Request $request, Student $student)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:process_tbl,id',
        ], [
            'id.required' => 'Missing id',
            'id.exists' => "Class don't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        ProcessDetail::where('process_id', $request->id)->delete();
        Process::where('id', $request->id)->delete();
        $process = DB::Table('process_tbl')
            ->join('users_tbl', 'process_tbl.teacher_id', 'users_tbl.id')
            ->join('process_detail_tbl', 'process_tbl.id', 'process_detail_tbl.process_id')
            ->groupBy('process_tbl.id')
            ->select('process_tbl.*', 'process_tbl.name AS className', 'users_tbl.name AS teacher', DB::raw('count(process_detail_tbl.student_id) as student_count'))
            ->orderBy('className')
            ->paginate(5);
        return response()->json($process);
    }

    public function editPass(Request $request)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:process_tbl,id',
            'pass' => 'required|min:0|numeric',
        ], [
            'id.required' => 'Missing id',
            'id.exists' => "Process don't exist",
            'pass.required' => 'Missing pass',
            'pass.min' => 'Min pass = 0',
            'pass.numeric' => 'Pass has to be a number',
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        Process::where('id', $request->id)->update(['pass' => $request->pass]);

        $process = DB::Table('process_tbl')
            ->join('users_tbl', 'process_tbl.teacher_id', 'users_tbl.id')
            ->join('process_detail_tbl', 'process_tbl.id', 'process_detail_tbl.process_id')
            ->groupBy('process_tbl.id')
            ->select('process_tbl.*', 'process_tbl.name AS className', 'users_tbl.name AS teacher', DB::raw('count(process_detail_tbl.student_id) as student_count'))
            ->orderBy('className')
            ->paginate(5);
        return response()->json($process);
    }
}
