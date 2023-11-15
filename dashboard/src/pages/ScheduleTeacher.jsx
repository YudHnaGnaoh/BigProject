import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Navbar from "../components/Navbar"
import axios from "axios";
import '../components/css/style.css'
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ScheduleTeacher() {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    // const [user_id, setUser_id] = useState('')
    const [info, setInfo] = useState('')

    useEffect(() => {
        if (!localStorage.getItem('email') || localStorage.getItem('role') != 32) {
            window.location.replace('/')
        } else {
            fetch(`http://127.0.0.1:8000/api/teacherSchedule?email=${localStorage.getItem('email')}`)
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                    setInfo(res)
                })
        }
    }, [])

    const taught = (course_id, schedule) => {
        // console.log(localStorage.getItem('email'));
        // console.log(course_id, schedule);
        Swal.fire({
            title: 'Xác nhận đã dạy lớp?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Xác nhân',
            denyButtonText: `Hủy`,
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`http://127.0.0.1:8000/api/taught`, {
                    email: localStorage.getItem('email'),
                    course_id: course_id,
                    schedule: schedule,
                })
                    .then((res) => {
                        console.log(res);
                        if (res.data.check == false) {
                            if (res.data.msg.email) {
                                Toast.fire({
                                    icon: 'error',
                                    title: res.data.msg.email
                                })
                            } else if (res.data.msg.course_id) {
                                Toast.fire({
                                    icon: 'error',
                                    title: res.data.msg.course_id
                                })
                            } else if (res.data.msg.schedule) {
                                Toast.fire({
                                    icon: 'error',
                                    title: res.data.msg.schedule
                                })
                            } else if (res.data.msg) {
                                Toast.fire({
                                    icon: 'error',
                                    title: res.data.msg
                                })
                            }
                        }
                        else {
                            fetch(`http://127.0.0.1:8000/api/teacherSchedule?email=${localStorage.getItem('email')}`)
                                .then((res) => res.json())
                                .then((res) => {
                                    console.log(res);
                                    setInfo(res)
                                    Toast.fire({
                                        icon: 'success',
                                        title: 'Đã xác nhận!'
                                    })
                                })
                        }
                    })
            } else if (result.isDenied) {
            }
        })

    }

    return (
        <div>
            <div style={{ position: 'sticky', top: '0', zIndex: '100' }}><Navbar></Navbar></div>
            <div className="d-flex" style={{ backgroundColor: "rgb(240,247,255)", height: '90vh' }}>
                <div className="container mt-4">
                    <h3 style={{ fontWeight: 'bold' }}>Lịch lớp</h3>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover table-bordered table-light align-middle" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                            <thead >
                                <tr className='align-middle'>
                                    <th>Lớp</th>
                                    <th>Lịch học</th>
                                    <th>Số lượng học sinh</th>
                                    <th>Số buổi đã học / Tổng</th>
                                    <th>Cộng số buổi dạy</th>
                                </tr>
                            </thead>
                            <tbody className="table-group-divider">
                                {info && info.map((item, index) =>
                                    < tr key={index}>
                                        <td>
                                            <span>{item.name}</span>
                                        </td>
                                        <td>
                                            <span dangerouslySetInnerHTML={{ __html: item.schedule }}></span>
                                        </td>
                                        <td>
                                            <span>{item.student_count}</span>
                                        </td>
                                        <td>
                                            <span>{item.pass} / {item.duration}</span>
                                        </td>
                                        <td>
                                            <button className='btn btn-primary' onClick={() => taught(item.course_id, item.schedule)}>Xác nhận</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScheduleTeacher