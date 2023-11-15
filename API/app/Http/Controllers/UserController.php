<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\UserRole;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function getRole(Request $request, UserRole $userRole)
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
        $checkRole = DB::table('users_tbl')
            ->join('role_tbl', 'users_tbl.role_id', '=', 'role_tbl.id')
            ->where('email', $request->email)
            ->select('users_tbl.*', 'role_tbl.name as roleName')
            ->get();
        return response()->json($checkRole);
    }

    public function role(Request $request, UserRole $userRole)
    {
        $userRole = UserRole::all();
        return response()->json($userRole);;
    }

    public function user(Request $request, User $user)
    {
        // $user = User::all();
        $user = DB::Table('users_tbl')
            ->join('role_tbl', 'users_tbl.role_id', 'role_tbl.id')
            ->select('users_tbl.*', 'role_tbl.name as rolename')
            ->orderBy('users_tbl.email')->paginate(5);
        return response()->json($user);
    }

    public function loginTeacher(Request $request, User $user)
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
        $findUser = User::where('email', $request->email)->where('status', 1)->first();

        if ($findUser) {
            Auth::login($findUser, true);
            if (Auth::Check()) {
                return response()->json(Auth::user());
            } else {
                echo ('not good');
            }
        } else {
            return response()->json(['check' => false, 'msg' => 'Tài khoản bị khóa']);
        }
    }

    public function checkLogin(Request $request)
    {
        $user = Auth::user();
        return response()->json($user);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        return redirect('/');
    }

    public function createRole(Request $request, UserRole $userRole)
    {
        $Validator = Validator::make($request->all(), [
            'name' => 'required|unique:role_tbl,name',
        ], [
            'name.required' => 'Fill in name',
            'name.unique' => 'Name already exist'
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        UserRole::create(['name' => $request->name, 'created_at' => now()]);
        $userRole = UserRole::all();
        return response()->json($userRole);
    }

    public function deleteRole(Request $request, UserRole $userRole)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:role_tbl,id',
        ], [
            'id.required' => 'Choose a role to delete',
            'id.exists' => "Role doesn't exist"
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }
        $checkUser = User::where('role_id', $request->id)->count(value('id'));
        if ($checkUser == 0) {
            UserRole::where('id', $request->id)->delete();
            $userRole = UserRole::all();
            return response()->json($userRole);
        } else {
            return response()->json(['check' => false, 'msg' => 'This role is being used by an user']);
        }
    }

    public function editRole(Request $request, UserRole $userRole)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:role_tbl,id',
            'name' => 'required|unique:role_tbl,name',
        ], [
            'id.required' => 'Choose a role for usesr',
            'id.exists' => "Role doesn't exist",
            'name.required' => 'Fill in name',
            'name.unique' => 'Name already exist'
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        UserRole::where('id', $request->id)->update(['name' => $request->name, 'updated_at' => now()]);
        $userRole = UserRole::all();
        return response()->json($userRole);
    }

    public function switchRole(Request $request, UserRole $userRole)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:role_tbl,id',
        ], [
            'id.required' => 'Choose a role for usesr',
            'id.exists' => "Role doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        $status = UserRole::where('id', $request->id)->value('status');
        if ($status == 1) {
            UserRole::where('id', $request->id)->update(['status' => 0, 'updated_at' => now()]);
        } else {
            UserRole::where('id', $request->id)->update(['status' => 1, 'updated_at' => now()]);
        }
        $userRole = UserRole::all();
        return response()->json($userRole);
    }

    public function createUser(Request $request, User $user)
    {
        $Validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users_tbl,email',
            'role_id' => 'required|exists:role_tbl,id'
        ], [
            'name.required' => 'Fill in name',
            'email.required' => 'Fill in email',
            'email.email' => 'Needs to be an email address ',
            'email.unique' => 'Email already exist',
            'role_id.required' => 'Need to have a user role',
            'role_id.exists' => "Role doesn't exist"
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        User::create([
            'name' => $request->name, 'email' => $request->email,
            'role_id' => $request->role_id, 'created_at' => now()
        ]);
        $user = DB::Table('users_tbl')->join('role_tbl', 'users_tbl.role_id', 'role_tbl.id')
            ->select('users_tbl.*', 'role_tbl.name as rolename')
            ->orderBy('users_tbl.email')->paginate(5);
        return response()->json($user);
    }

    public function deleteUser(Request $request, UserRole $userRole)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:users_tbl,id',
        ], [
            'id.required' => 'Choose an user to delete',
            'id.exists' => "User doesn't exist"
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }
        $checkUser = Schedule::where('user_id', $request->id)->count(value('id'));
        if ($checkUser == 0) {
            User::where('id', $request->id)->delete();
            $user = DB::Table('users_tbl')->join('role_tbl', 'users_tbl.role_id', 'role_tbl.id')
                ->select('users_tbl.*', 'role_tbl.name as rolename')
                ->paginate(5);
            return response()->json($user);
        } else {
            return response()->json(['check' => false, 'msg' => 'This user is in a class']);
        }
    }

    public function editUser(Request $request, User $user)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:users_tbl,id',
            'name' => 'required',
            'role_id' => 'required|exists:role_tbl,id'
        ], [
            'id.required' => 'Missing id',
            'id.exists' => "User doesn't exist",
            'name.required' => 'Fill in name',
            'role_id.required' => 'Need to have a user role',
            'role_id.exists' => "Role doesn't exist"
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        User::where('id', $request->id)->update(['name' => $request->name, 'role_id' => $request->role_id, 'updated_at' => now()]);
        $user = DB::Table('users_tbl')->join('role_tbl', 'users_tbl.role_id', 'role_tbl.id')
            ->select('users_tbl.*', 'role_tbl.name as rolename')
            ->orderBy('users_tbl.email')->paginate(5);
        return response()->json($user);
    }

    public function switchUser(Request $request, UserRole $userRole)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:users_tbl,id',
        ], [
            'id.required' => 'Choose a user',
            'id.exists' => "User doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        $status = User::where('id', $request->id)->value('status');
        if ($status == 1) {
            User::where('id', $request->id)->update(['status' => 0, 'updated_at' => now()]);
        } else {
            User::where('id', $request->id)->update(['status' => 1, 'updated_at' => now()]);
        }
        $user = DB::Table('users_tbl')->join('role_tbl', 'users_tbl.role_id', 'role_tbl.id')
            ->select('users_tbl.*', 'role_tbl.name as rolename')
            ->orderBy('users_tbl.email')->paginate(5);
        return response()->json($user);
    }
}
