<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        p {
            margin: 0;
        }
    </style>
</head>

<body>
    <h3 style="color: red">Bạn đã được xếp lớp với thông tin khóa học như sau:</h3>
    <h4 style="color: black">
        Tên học sinh: {{ $mailData['studentName'] }}
    </h4>
    <h4 style="color: black">
        Khối: {{ $mailData['grade'] }}
    </h4>
    <h4 style="color: black">
        Tên lớp: {{ $mailData['courseName'] }}
    </h4>
    <h4 style="color: black">
        Tên giáo viên lớp: {{ $mailData['teacher'] }}
    </h4>
    <h4 style="color: black; display: flex;">
        <p>Lịch học: </p>&nbsp;{!! $mailData['schedule'] !!}
    </h4>
    <h4 style="color: black">
        Số buổi tổng cộng: {{ $mailData['duration'] }} buổi
    </h4>
</body>

</html>
