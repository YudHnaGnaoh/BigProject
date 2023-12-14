<?php

namespace App\Http\Controllers;

use App\Models\Process;
use App\Models\Schedule;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    public function loginStudent(Request $request, Student $student)
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
        $findStudent = Student::where('email', $request->email)->where('status', 1)->first();

        if ($findStudent) {
            return response()->json($findStudent);
            // Auth::login($findStudent, true);
            // if (Auth::Check()) {
            // return response()->json(Auth::student());
            // } else {
            //     echo ('not good');
            // }
        } else {
            return response()->json(['check' => false, 'msg' => 'Tài khoản bị khóa']);
        }
    }

    public function allStudents(Request $request, Student $student)
    {
        return response()->json(Student::orderBy('email')->paginate(5));
    }

    public function allStudents2(Request $request, Student $student)
    {
        return response()->json(Student::orderBy('email')->get());
    }

    public function createStudent(Request $request, Student $student)
    {
        $Validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:students_tbl,email',
            'phone' => 'required|numeric',
        ], [
            'name.required' => 'Fill in name',
            'email.required' => 'Fill in email',
            'email.email' => 'Needs to be an email address ',
            'email.unique' => 'Email already exist',
            'phone.required' => 'Fill in phone',
            'phone.numeric' => 'Phone needs to be a number',
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        // if(!$request->phone.match('/(84|0[3|5|7|8|9])+([0-9]{8})\b/g')) {
        //     return response()->json(['check' => false, 'msg' => 'Wrong phone format']);
        // }

        Student::create([
            'name' => $request->name, 'email' => $request->email, 'phone' => $request->phone
        ]);
        return response()->json(Student::paginate(5));
    }

    public function deleteStudent(Request $request, Student $student)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:students_tbl,id',
        ], [
            'id.required' => 'Choose an student to delete',
            'id.exists' => "Student doesn't exist"
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }
        $checkStudent = Process::where('id', $request->id)->count(value('id'));
        if ($checkStudent == 0) {
            Student::where('id', $request->id)->delete();
            return response()->json(Student::paginate(5));
        } else {
            return response()->json(['check' => false, 'msg' => 'This student is in a class']);
        }
    }

    public function editStudent(Request $request, Student $student)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:students_tbl,id',
            'name' => 'required',
            'phone' => 'required|numeric',
        ], [
            'id.required' => 'Missing id',
            'id.exists' => "Student doesn't exist",
            'name.required' => 'Fill in name',
            'phone.required' => 'Fill in phone',
            'phone.numeric' => 'Phone needs to be a number',
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        Student::where('id', $request->id)->update(['name' => $request->name, 'phone' => $request->phone, 'updated_at' => now()]);
        return response()->json(Student::paginate(5));
    }

    public function switchStudent(Request $request, Student $student)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:students_tbl,id',
        ], [
            'id.required' => 'Choose a student',
            'id.exists' => "Student doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        $status = Student::where('id', $request->id)->value('status');
        if ($status == 1) {
            Student::where('id', $request->id)->update(['status' => 0, 'updated_at' => now()]);
        } else {
            Student::where('id', $request->id)->update(['status' => 1, 'updated_at' => now()]);
        }
        return response()->json(Student::paginate(5));
    }
}
