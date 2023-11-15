<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Education;

class EducationController extends Controller
{

    public function education(Request $request, Education $education)
    {
        $education = Education::all();
        return response()->json($education);
    }

    public function education2(Request $request, Education $education)
    {
        $education = Education::where('status', 1)->get();
        return response()->json($education);
    }

    public function createEducation(Request $request, Education $education)
    {
        $Validator = Validator::make($request->all(), [
            'name' => 'required|unique:educations_tbl,name',
        ], [
            'name.required' => 'Fill in name',
            'name.unique' => 'Name already exist'
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        Education::create(['name' => $request->name, 'created_at' => now()]);
        $education = Education::all();
        return response()->json($education);
    }

    public function deleteEducation(Request $request, Education $education)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:educations_tbl,id',
        ], [
            'id.required' => 'Choose a educations to delete',
            'id.exists' => "Education doesn't exist"
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }
        $check = Categories::where('education_id', $request->id)->count(value('id'));
        if ($check != 0) {
            return response()->json(['check' => false, 'msg' => 'A category is using this education']);
        } else {
            Education::where('id', $request->id)->delete();
            $education = Education::all();
            return response()->json($education);
        }
    }

    public function editEducation(Request $request, Education $education)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:educations_tbl,id',
            'name' => 'required|unique:educations_tbl,name',
        ], [
            'id.required' => 'Choose a educations for usesr',
            'id.exists' => "Education doesn't exist",
            'name.required' => 'Fill in name',
            'name.unique' => 'Name already exist'
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        Education::where('id', $request->id)->update(['name' => $request->name, 'updated_at' => now()]);
        $education = Education::all();
        return response()->json($education);
    }

    public function switchEducation(Request $request, Education $education)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:educations_tbl,id',
        ], [
            'id.required' => 'Choose a educations for usesr',
            'id.exists' => "Education doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        $status = Education::where('id', $request->id)->value('status');
        if ($status == 1) {
            Education::where('id', $request->id)->update(['status' => 0, 'updated_at' => now()]);
        } else {
            Education::where('id', $request->id)->update(['status' => 1, 'updated_at' => now()]);
        }
        $education = Education::all();
        return response()->json($education);
    }
}
