import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Navbar from "../components/Navbar"
import axios from "axios";
import '../components/css/style.css'
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ScheduleStudent() {

  const [info, setInfo] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('email')) {
      window.location.replace('/')
    } else {
      fetch(`https://duyanh.codingfs.com/api/studentSchedule?email=${localStorage.getItem('email')}`)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          setInfo(res)
        })
    }
  }, [])

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
                  <th>Giáo viên</th>
                  <th>Lịch học</th>
                  <th>Tổng số buổi</th>
                  <th>Số buổi đã học</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {info && info.map((item, index) =>
                  < tr key={index}>
                    <td>
                      <span>{item.className}</span>
                    </td>
                    <td>
                      <span>{item.teacherName}</span>
                    </td>
                    <td>
                      <span dangerouslySetInnerHTML={{ __html: item.schedule }}></span>
                    </td>
                    <td>
                      <span>{item.duration}</span>
                    </td>
                    <td>
                      <span>{item.pass}</span>
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

export default ScheduleStudent