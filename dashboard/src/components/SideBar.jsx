import React from 'react'
import './css/SideBar.css'
import { BiSolidUserAccount } from 'react-icons/bi';
import { PiStudentFill } from 'react-icons/pi';
import { ImBook } from 'react-icons/im';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { MdSchedule } from 'react-icons/md';
import { TbListDetails } from 'react-icons/tb';

function SideBar() {
    return (
        <div className='boxShadow backgroundColor minHeight' style={{ width: '200px' }}>
            <nav >
                <div className="p-4" >
                    <h3 className='fw-bold' style={{ color: 'rgb(33,155,103)' }}>Dashboard</h3>
                    <ul className="list-unstyled fw-bold fs-5">
                        <li className="my-3">
                            <a href="/AdminUser">
                                <div className="row">
                                    <div className="col-sm-2 align-middle"><BiSolidUserAccount /></div>
                                    <div className="col-sm">Admin & Giáo viên</div>
                                </div>
                            </a>
                        </li>
                        <li className="my-3">
                            <a href="/AdminStudent">
                                <div className="row">
                                    <div className="col-sm-2 align-middle"><PiStudentFill /></div>
                                    <div className="col-sm">Học sinh</div>
                                </div>
                            </a>
                        </li>
                        <li className="my-3">
                            <a href="/AdminEducation">
                                <div className="row">
                                    <div className="col-sm-2 align-middle"><ImBook /></div>
                                    <div className="col-sm">Khóa học</div>
                                </div>
                            </a>
                        </li>
                        <li className="my-3">
                            <a href="/AdminSchedule">
                                <div className="row">
                                    <div className="col-sm-2 align-middle"><MdSchedule /></div>
                                    <div className="col-sm">Lịch giảng dạy</div>
                                </div>
                            </a>
                        </li>
                        <li className="my-3">
                            <a href="/AdminProcess">
                                <div className="row">
                                    <div className="col-sm-2 align-middle"><TbListDetails /></div>
                                    <div className="col-sm">Lịch lớp</div>
                                </div>
                            </a>
                        </li>
                        <li className="my-3">
                            <a href="/AdminBill">
                                <div className="row">
                                    <div className="col-sm-2 align-middle"><MdOutlineAttachMoney /></div>
                                    <div className="col-sm">Hóa đơn</div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>

    )
}

export default SideBar