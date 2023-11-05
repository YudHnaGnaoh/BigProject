<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Categories;

class CategoryController extends Controller
{

    public function category(Request $request, Categories $categories)
    {
        $Validator = Validator::make($request->all(), [
            'education_id' => 'required|exists:educations_tbl,id',
        ], [
            'education_id.required' => 'Need education id',
            'education_id.exists' => "Education doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }
        $categories = Categories::where('education_id', $request->education_id)->get();
        return response()->json($categories);
    }

    public function allCategory(Request $request, Categories $categories)
    {
        $categories = Categories::all();
        return response()->json($categories);
    }

    public function createCategory(Request $request, Categories $categories)
    {
        $Validator = Validator::make($request->all(), [
            'name' => 'required',
            'education_id' => 'required|exists:educations_tbl,id',
        ], [
            'name.required' => 'Fill in name',
            'education_id.required' => 'Fill in education',
            'education_id.exists' => "Education doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }
        $checkCate = Categories::where('education_id', $request->education_id)->where('name', $request->name)->count(value('name'));
        if ($checkCate != 0) {
            return response()->json(['check' => false, 'msg' => 'Cate Name already exist in this education']);
        } else {
            Categories::create(['name' => $request->name, 'education_id' => $request->education_id, 'created_at' => now()]);
            $categories = Categories::where('education_id', $request->education_id)->get();
            return response()->json($categories);
        }
    }

    public function deleteCategory(Request $request, Categories $categories)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:categories_tbl,id',
            'education_id' => 'required|exists:educations_tbl,id',
        ], [
            'id.required' => 'Choose a categories to delete',
            'id.exists' => "Category doesn't exist",
            'education_id.required' => 'Fill in education',
            'education_id.exists' => "Education doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }
        Categories::where('id', $request->id)->delete();
        $categories = Categories::where('education_id', $request->education_id)->get();
        return response()->json($categories);
    }

    public function editCategory(Request $request, Categories $categories)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:categories_tbl,id',
            'name' => 'required|unique:categories_tbl,name',
            'education_id' => 'required|exists:educations_tbl,id',
        ], [
            'id.required' => 'Choose a categories for usesr',
            'id.exists' => "Category doesn't exist",
            'name.required' => 'Fill in name',
            'name.unique' => 'Name already exist',
            'education_id.required' => 'Fill in education',
            'education_id.exists' => "Education doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        Categories::where('id', $request->id)->update(['name' => $request->name, 'education_id' => $request->education_id, 'updated_at' => now()]);
        $categories = Categories::where('education_id', $request->education_id)->get();
        return response()->json($categories);
    }

    public function switchCategory(Request $request, Categories $categories)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:categories_tbl,id',
            'education_id' => 'required|exists:educations_tbl,id',
        ], [
            'id.required' => 'Choose a categories for usesr',
            'id.exists' => "Category doesn't exist",
            'education_id.required' => 'Fill in education',
            'education_id.exists' => "Education doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        $status = Categories::where('id', $request->id)->value('status');
        if ($status == 1) {
            Categories::where('id', $request->id)->update(['status' => 0, 'updated_at' => now()]);
        } else {
            Categories::where('id', $request->id)->update(['status' => 1, 'updated_at' => now()]);
        }
        $categories = Categories::where('education_id', $request->education_id)->get();
        return response()->json($categories);
    }
}
