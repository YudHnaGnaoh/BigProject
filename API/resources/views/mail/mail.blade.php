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
    <h3 style="color: red">Bạn đã đăng ký thành công gói học với thông tin sau:</h3>
    <h4 style="color: black">
        Tên học sinh: {{ $mailData['name'] }}
    </h4>
    <h4 style="color: black">
        Số điện thoại: {{ $mailData['phone'] }}
    </h4>
    <h4 style="color: black">
        Tên giáo viên lớp: {{ $mailData['teacher'] }}
    </h4>
    <h4 style="color: black; display: flex;">
        <p>Lịch học: </p>&nbsp;{!! $mailData['schedule'] !!}
    </h4>
    <h3 style="color: red">Bạn sẽ nhận được email khi trung tâm xếp lớp xong cho bạn</h3>
</body>

</html>
