<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h3 style="color: red">Trung tâm đã nhận được thông tin của bạn, vui lòng chờ liên hệ lại:</h3>
    <h4 style="color: black">
        Tên học sinh: {{ $mailData['name'] }}
    </h4>
    <h4 style="color: black">
        Số điện thoại: {{ $mailData['phone'] }}
    </h4>
    <h4 style="color: black">
        Email: {{ $mailData['email'] }}
    </h4>
    <h4 style="color: black">
        Khóa học muốn đăng ký: {{$mailData['category']}}</div>
    </h4>
    <br>
</body>
</html>
