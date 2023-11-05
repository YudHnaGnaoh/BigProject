<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Courses;
use App\Models\Schedule;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{

    public function course(Request $request, Courses $Courses)
    {
        $Validator = Validator::make($request->all(), [
            'cate_id' => 'required|exists:categories_tbl,id',
        ], [
            'cate_id.required' => 'Need category id',
            'cate_id.exists' => "Category doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }
        $Courses = Courses::where('cate_id', $request->cate_id)->orderBy('grade', 'ASC')->get();
        return response()->json($Courses);
    }

    public function allCourse(Request $request, Courses $Courses)
    {
        $Courses = DB::table('categories_tbl')->join('courses_tbl', 'categories_tbl.id', '=', 'courses_tbl.cate_id')
            ->select('categories_tbl.id', 'courses_tbl.grade')
            ->distinct()->get();
        return response()->json($Courses);
    }

    public function sameGradeCourse(Request $request, Courses $Courses)
    {
        $Courses = Courses::where('grade', $request->grade)->get();
        return response()->json($Courses);
    }

    public function singleCourse(Request $request, Courses $Courses)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:courses_tbl,id',
        ], [
            'id.required' => 'Need course id',
            'id.exists' => "Course doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }
        $Courses = Courses::where('id', $request->id)->get();
        $Teacher = DB::table('schedule_tbl')
        ->join('users_tbl', 'schedule_tbl.user_id','users_tbl.id')
        ->where('schedule_tbl.course_id', $request->id)
        ->select('schedule_tbl.*', 'schedule_tbl.id AS schedule_id', 'users_tbl.*')
        ->get();
        return response()->json([$Courses,$Teacher]);
    }

    public function homePageCourse(Request $request, Courses $Courses)
    {
        $Courses = Courses::orderByDesc('created_at')->limit(6)->get();
        return response()->json($Courses);
    }

    public function createCourse(Request $request, Courses $Courses)
    {
        $Validator = Validator::make($request->all(), [
            'name' => 'required',
            'duration' => 'required',
            'price' => 'required|numeric|min:0',
            'discount' => 'required|numeric|min:0|max:100',
            'grade' => 'required',
            'summary' => 'required',
            'description' => 'required',
            'cate_id' => 'required|exists:categories_tbl,id',
        ], [
            'name.required' => 'Fill in name',
            'duration.required' => 'Fill in duration',
            'price.required' => 'Fill in price',
            'price.numeric' => 'Price has to be a numeric',
            'price.min' => 'Min price = 0',
            'discount.required' => 'Fill in discount',
            'discount.numeric' => 'Discount has to be a numeric',
            'discount.min' => 'Min discount = 0',
            'discount.max' => 'Max discount = 100',
            'grade.required' => 'Fill in grade',
            'summary.required' => 'Fill in summary',
            'description.required' => 'Fill in description',
            'cate_id.required' => 'Need category id',
            'cate_id.exists' => "Category doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        $fileType = str_replace('image/', '', $_FILES['file']['type']);
        $accept = ["JPG", "PNG", "GIF", "WEBP", "APNG", "AVIF", "SVG", 'jpg', 'png', 'gif', "WebP", 'webp', 'svg', 'apng', 'avif'];
        if (!in_array($fileType, $accept)) {
            return response()->json(['check' => false, 'msg' => 'File is not an image file']);
        }

        $checkCourse = Courses::where('cate_id', $request->cate_id)->where('name', $request->name)->count(value('name'));
        if ($checkCourse != 0) {
            return response()->json(['check' => false, 'msg' => 'Course Name already exist in this category']);
        } else {
            $now = now()->timestamp;
            $temp = explode('.', $_FILES['file']['name']);
            $newfilename = $now . '.' . end($temp);
            $tmp_name = $_FILES['file']['tmp_name'];
            move_uploaded_file($tmp_name, 'images/' . $newfilename);
            Courses::create([
                'image' => $newfilename, 'name' => $request->name,
                'duration' => $request->duration, 'price' => $request->price,
                'discount' => $request->discount, 'grade' => $request->grade,
                'summary' => $request->summary, 'description' => $request->description,
                'cate_id' => $request->cate_id, 'created_at' => now()
            ]);
            $now++;
            $Courses = Courses::where('cate_id', $request->cate_id)->orderBy('grade', 'ASC')->get();
            return response()->json($Courses);
        }
    }

    public function deleteCourse(Request $request, Courses $Courses)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:courses_tbl,id',
            'cate_id' => 'required|exists:categories_tbl,id',
        ], [
            'id.required' => 'Choose a educations to delete',
            'id.exists' => "Courses doesn't exist",
            'cate_id.required' => 'Need category id',
            'cate_id.exists' => "Category doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }
        $img = Courses::where('id', $request->id)->select('image')->get();
        foreach ($img as $value) {
            // echo $value->image;
            unlink(public_path('images/' . $value->image));
        }
        Courses::where('id', $request->id)->delete();
        $Courses = Courses::where('cate_id', $request->cate_id)->orderBy('grade', 'ASC')->get();
        return response()->json($Courses);
    }

    public function editCourse(Request $request, Courses $Courses)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:courses_tbl,id',
            'name' => 'required',
            'duration' => 'required',
            'price' => 'required|numeric|min:0',
            'discount' => 'required|numeric|min:0|max:100',
            'grade' => 'required',
            'summary' => 'required',
            'description' => 'required',
            'cate_id' => 'required|exists:categories_tbl,id',
        ], [
            'id.required' => 'Missing id',
            'id.exists' => "Course doesn't exist",
            'name.required' => 'Fill in name',
            'duration.required' => 'Fill in duration',
            'price.required' => 'Fill in price',
            'price.numeric' => 'Price has to be a numeric',
            'price.min' => 'Min price = 0',
            'discount.required' => 'Fill in discount',
            'discount.numeric' => 'Discount has to be a numeric',
            'discount.min' => 'Min discount = 0',
            'discount.max' => 'Max discount = 100',
            'grade.required' => 'Fill in grade',
            'summary.required' => 'Fill in summary',
            'description.required' => 'Fill in description',
            'cate_id.required' => 'Need category id',
            'cate_id.exists' => "Category doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        $checkCourse = Courses::where('id', '!=', $request->id)->where('name', $request->name)->count(value('name'));
        if ($checkCourse != 0) {
            return response()->json(['check' => false, 'msg' => 'Course Name already exist in this category']);
        } else {
            if ($_FILES == null || $_FILES == '') {
                Courses::where('id', $request->id)->update([
                    'name' => $request->name, 'duration' => $request->duration,
                    'price' => $request->price, 'discount' => $request->discount,
                    'grade' => $request->grade, 'summary' => $request->summary,
                    'description' => $request->description, 'created_at' => now()
                ]);
                $Courses = Courses::where('cate_id', $request->cate_id)->orderBy('grade', 'ASC')->get();
                return response()->json($Courses);
            } else {
                $fileType = str_replace('image/', '', $_FILES['file']['type']);
                $accept = ["JPG", "PNG", "GIF", "WEBP", "APNG", "AVIF", "SVG", 'jpg', 'png', 'gif', "WebP", 'webp', 'svg', 'apng', 'avif'];
                if (!in_array($fileType, $accept)) {
                    return response()->json(['check' => false, 'msg' => 'File is not an image file']);
                }
                $now = now()->timestamp;
                $temp = explode('.', $_FILES['file']['name']);
                $newfilename = $now . '.' . end($temp);
                $tmp_name = $_FILES['file']['tmp_name'];
                move_uploaded_file($tmp_name, 'images/' . $newfilename);
                // ========== remove old image file =================================
                $img = Courses::where('id', $request->id)->select('image')->get();
                foreach ($img as $value) {
                    // echo $value->image;
                    unlink(public_path('images/' . $value->image));
                }
                Courses::where('id', $request->id)->update([
                    'image' => $newfilename, 'name' => $request->name,
                    'duration' => $request->duration, 'price' => $request->price,
                    'discount' => $request->discount, 'grade' => $request->grade,
                    'summary' => $request->summary, 'description' => $request->description,
                    'created_at' => now()
                ]);
                $now++;
                $Courses = Courses::where('cate_id', $request->cate_id)->orderBy('grade', 'ASC')->get();
                return response()->json($Courses);
            }
        }
    }

    public function switchCourse(Request $request, Courses $Courses)
    {
        $Validator = Validator::make($request->all(), [
            'id' => 'required|exists:courses_tbl,id',
            'cate_id' => 'required|exists:categories_tbl,id',
        ], [
            'id.required' => 'Choose a educations for usesr',
            'id.exists' => "Courses doesn't exist",
            'cate_id.required' => 'Need category id',
            'cate_id.exists' => "Category doesn't exist",
        ]);
        if ($Validator->fails()) {
            return response()->json(['check' => false, 'msg' => $Validator->errors()]);
        }

        $status = Courses::where('id', $request->id)->value('status');
        if ($status == 1) {
            Courses::where('id', $request->id)->update(['status' => 0, 'updated_at' => now()]);
        } else {
            Courses::where('id', $request->id)->update(['status' => 1, 'updated_at' => now()]);
        }
        $Courses = Courses::where('cate_id', $request->cate_id)->orderBy('grade', 'ASC')->get();
        return response()->json($Courses);
    }
}
