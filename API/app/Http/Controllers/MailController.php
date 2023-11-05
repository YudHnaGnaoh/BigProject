<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\sendMail;
use App\Mail\sendMail2;
use App\Models\Bills;
use App\Models\Courses;
use App\Models\Process;
use App\Models\ProcessDetail;

class MailController extends Controller
{
    public function sendMail(Request $request, Student $student, User $user)
    {
        $Validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:students_tbl,email',
            'teacher' => 'required|exists:users_tbl,name',
            'time' => 'required',
            'schedule_id' => 'required',
        ], [
            'email.required' => 'Missing email',
            'email.email' => 'Needs to be an email',
            'email.exists' => "You don't have an account yet",
            'teacher.required' => "Missing teacher",
            'teacher.exists' => "Teacher doesn't exists",
            'time.required' => 'Pick a schedule',
            'schedule_id.required' => 'Missing schedule_id',
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        $student = Student::where('email', $request->email)->first();
        if ($student) {
            $mailData = [
                'name' => $student->name,
                'phone' => $student->phone,
                'teacher' => $request->teacher,
                'schedule' => $request->time,
            ];

            if (Bills::where('email', $request->email)
                ->where('schedule_id', $request->schedule_id)
                ->where('schedule', $request->time)
                ->first()
            ) {
                return response()->json(['check' => false, 'msg' => 'You already sign up for this class']);
            } else {
                $bill = Bills::create([
                    'name' => $student->name, 'email' => $request->email,
                    'phone' => $student->phone, 'schedule_id' => $request->schedule_id,
                    'schedule' => $request->time, 'created_at' => now()
                ]);
                Mail::to($request->email)
                    ->cc('duyanh55182124@gmail.com')
                    ->send(new sendMail($mailData));

                return response()->json(['check' => true, $bill]);
            }
        }
    }

    public function getAllBill(Request $request, Student $student, User $user)
    {
        // $student = Student::where('email', $request->email)->first();
        $bill = DB::Table('bills_tbl')
            ->join('schedule_tbl', 'bills_tbl.schedule_id', 'schedule_tbl.id')
            ->join('courses_tbl', 'schedule_tbl.course_id', 'courses_tbl.id')
            ->join('students_tbl', 'bills_tbl.email', 'students_tbl.email')
            ->select(
                'bills_tbl.*',
                'bills_tbl.id AS bill_id',
                'bills_tbl.name AS student_name',
                'bills_tbl.status AS bill_status',
                'schedule_tbl.*',
                'schedule_tbl.id AS schedule_id',
                'courses_tbl.*',
                'courses_tbl.id AS course_id',
                'courses_tbl.name AS course_name',
                'students_tbl.id AS student_id'
            )
            ->get();
        return response()->json($bill);
    }

    public function createClass(Request $request, Student $student, User $user)
    {
        $Validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students_tbl,id',
            'courseName' => 'required|exists:courses_tbl,name',
            'teacher_id' => 'required|exists:users_tbl,id',
            'schedule' => 'required',
            'course_id' => 'required|exists:courses_tbl,id',
            'duration' => 'required|numeric',
            'bill_id' => 'required',
            'email' => 'required|exists:students_tbl,email',
        ], [
            'student_id.required' => 'Missing student_id',
            'student_id.exists' => "Student doesn't have an account yet",
            'courseName.required' => "Missing course name",
            'courseName.exists' => "Course doesn't exist",
            'teacher_id.required' => "Missing teacher id",
            'teacher_id.exists' => "Teacher doesn't exists",
            'schedule.required' => 'Pick a schedule',
            'course_id.required' => 'Missing course_id',
            'course_id.exists' => "Course doesn't exist",
            'duration.required' => "Missing duration",
            'duration.numeric' => "Duration has to be a number",
            'bill_id.required' => "Missing bill_id",
            'email.required' => 'Missing email',
            'email.exists' => "Student email doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        $checkExist = Process::where('course_id', $request->course_id)
            ->where('schedule', $request->schedule)
            ->value('id');

        if (!$checkExist) {
            $class_id = Process::create([
                'name' => $request->courseName, 'teacher_id' => $request->teacher_id,
                'course_id' => $request->course_id, 'schedule' => $request->schedule,
                'duration' => $request->duration
            ])->id;
        } else {
            $class_id = $checkExist;
        }
        $checkStudentClass = ProcessDetail::where('student_id', $request->student_id)->where('process_id', $class_id)->get();
        if (count($checkStudentClass) == 0) {
            // echo('create new');
            ProcessDetail::create(['process_id' => $class_id, 'student_id' => $request->student_id]);
            Bills::where('id', $request->bill_id)->update(['status' => 1, 'updated_at' => now()]);
            $process = Process::where('id', $class_id)->first();
            $course = Courses::where('id', $request->course_id)->first();
            $teacher = User::where('id', $request->teacher_id)->first();
            $student = Student::where('email', $request->email)->first();
            $mailData = [
                'studentName' => $student->name,
                'grade' => $course->grade,
                'courseName' => $course->name,
                'teacher' => $teacher->name,
                'schedule' => $process->schedule,
                'duration' => $process->duration,
            ];
            Mail::to($request->email)
                ->cc('duyanh55182124@gmail.com')
                ->send(new sendMail2($mailData));
        } else {
            // echo('already in class');
            return response()->json(['check' => false, 'msg' => 'This student is already in this class']);
        }
        return response()->json(['check' => true]);
    }
}
