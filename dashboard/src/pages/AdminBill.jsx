import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../components/css/style.css";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Pagination from 'react-bootstrap/Pagination';


function AdminBill() {

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

  const [loading, setLoading] = useState(false)

  const [info, setInfo] = useState('')

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [student_name, setStudent_name] = useState('')
  const [student_id, setStudent_id] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState('')
  const [teacher_id, setTeacher_id] = useState('')
  const [course_id, setCourse_id] = useState('')
  const [courseName, setCourseName] = useState('')
  const [bill_id, setBill_id] = useState('')
  const [schedule, setSchedule] = useState('')
  // ================= Paginate ==========================
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState('')
  const [lastPage, setLastPage] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('email') || localStorage.getItem('role') != 6) {
      window.location.replace('/')
    } else {
      fetch(`https://duyanh.codingfs.com/api/getAllBill?page=${page}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setInfo(res.data)
          setPerPage(res.per_page)
          setLastPage(res.last_page)
          // setNextPage(res.next_page_url)
          // setPreviousPage(res.prev_page_url)
          // console.log(res.next_page_url);
          // console.log(res.prev_page_url);
          // console.log(res.last_page);

        })
      fetch("https://duyanh.codingfs.com/api/allSchedule")
        .then((res) => res.json())
        .then((res) => {
          var arr = []
          res.forEach((el) => {
            var item = new Object()
            // console.log(item);
            item.id = el.id;
            item.course_id = el.course_id;
            item.user_id = el.user_id;
            item.cate_id = el.cate_id;
            item.courseName = el.courseName;
            item.grade = el.grade;
            item.roleName = el.roleName;
            item.userName = el.userName;
            item.created_at = el.created_at;
            var parseTime = JSON.parse(el.time);
            // console.log(parseTime);
            // var str = ''
            // str += ''
            // parseTime.forEach((el1) => {
            //   str += el1
            // })
            item.time = parseTime
            arr.push(item)
          })
          // console.log(arr);
          setSchedule(arr);
        })
    }
  }, [])

  useEffect(() => {
    if (search && search != '' && search != null) {
      fetch(`https://duyanh.codingfs.com/api/searchBill?search=${search}&page=${page}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setInfo(res.data);
          setLastPage(res.last_page)
        });
    } else {
    fetch(`https://duyanh.codingfs.com/api/getAllBill?page=${page}`)
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        setInfo(res.data)
        setLastPage(res.last_page)
        // setNextPage(res.next_page_url)
        // setPreviousPage(res.prev_page_url)
        // setLastPage(res.last_page)
        // console.log(res.next_page_url);
        // console.log(res.prev_page_url);
        // console.log(res.last_page);
      })
    }
  }, [page])

  // ====================== Search =================================================== 
  const searchResult = async () => {
    try {
      const result = await axios.get(`https://duyanh.codingfs.com/api/searchBill?search=${search}&page=1`);
      setInfo(result.data.data)
      // console.log(result.data.data);
      setPage(1)
      setLastPage(result.data.last_page)
      // console.log(result.data.data);
    } catch (error) {
      console.error('Tên không tồn tại:', error);
    }
  }
  // ====================== Search End =================================================== 

  // ====================== Paginate =================================================== 
  let active = page;
  let items = [];
  for (let number = 1; number <= lastPage; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active} onClick={() => setPage(number)}>
        {number}
      </Pagination.Item>,
    );
  }
  // ====================== Paginate End =================================================== 

  const makeProcess = (() => {
    setLoading(true)
    // console.log(student_name, student_id, email, phone, time, duration, teacher_id, course_id, courseName, bill_id);
    axios.post(`https://duyanh.codingfs.com/api/createClass`, {
      student_id: student_id,
      courseName: courseName,
      teacher_id: teacher_id,
      schedule: time,
      course_id: course_id,
      duration: duration,
      bill_id: bill_id,
      email: email,
    })
      .then((res) => {
        setLoading(false)
        // console.log(res)
        if (res.data.check == false) {
          if (res.data.msg.student_id) {
            Toast.fire({
              icon: 'error',
              title: res.data.msg.student_id
            })
          } else if (res.data.msg.courseName) {
            Toast.fire({
              icon: 'error',
              title: res.data.msg.courseName
            })
          } else if (res.data.msg.teacher_id) {
            Toast.fire({
              icon: 'error',
              title: res.data.msg.teacher_id
            })
          } else if (res.data.msg.schedule) {
            Toast.fire({
              icon: 'error',
              title: res.data.msg.schedule
            })
          } else if (res.data.msg.course_id) {
            Toast.fire({
              icon: 'error',
              title: res.data.msg.course_id
            })
          } else if (res.data.msg.duration) {
            Toast.fire({
              icon: 'error',
              title: res.data.msg.duration
            })
          } else if (res.data.msg.bill_id) {
            Toast.fire({
              icon: 'error',
              title: res.data.msg.bill_id
            })
          } else if (res.data.msg.email) {
            Toast.fire({
              icon: 'error',
              title: res.data.msg.email
            })
          } else if (res.data.msg) {
            Toast.fire({
              icon: 'error',
              title: res.data.msg
            })
          }
        }
        else {
          Toast.fire({
            icon: 'success',
            title: 'Xếp lớp thành công'
          })
          handleClose();
          setStudent_id('');
          setCourseName('');
          setTeacher_id('');
          setTime('');
          setCourse_id('');
          setDuration('');
          setBill_id('');
          fetch(`https://duyanh.codingfs.com/api/getAllBill?page=${page}`)
            .then((res) => res.json())
            .then((res) => {
              // console.log(res);
              setInfo(res.data)
            })
        }
      })
  })

  return (
    <div>
      {/* ============================================= Modal Student ============================================================ */}
      <Modal show={show} onHide={handleClose}>
        {loading == true &&
          <div className='text-center position-fixed' style={{ zIndex: '100', width: '500px' }}>
            <img className='' style={{ height: '40vh', marginTop: '20vh' }} src="https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!sw800" alt="" />
          </div>
        }
        <Modal.Header closeButton>
          <Modal.Title>Xếp lớp</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label fw-bold">Tên người dùng</label>
            <input
              type="text"
              className="form-control mb-3"
              value={student_name}
              disabled
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Email</label>
            <input
              type="text"
              className="form-control mb-3"
              value={email}
              disabled
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Số điện thoại</label>
            <input
              type="text"
              className="form-control mb-3"
              value={phone}
              disabled
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Lớp đang có</label>
            {schedule && schedule.map((item, index) =>
              <div key={index}>
                <span className="text-primary" style={{ fontWeight: '600' }}>{item.courseName}</span>
                {item.time && item.time.map((item2, index2) =>
                  <div key={index2} className="d-flex ms-3">
                    <input className="me-2" type="radio" name='pickOne' id={item.id} value={item2.time} onChange={() => [setTime(item2.time), setTeacher_id(item.user_id), setCourse_id(item.course_id), setCourseName(item.courseName)]} />
                    <span dangerouslySetInnerHTML={{ __html: item2.time }}></span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => makeProcess()}>
            Xếp lớp
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ============================================= Modal Ende ============================================================ */}
      {loading == true &&
        <div className='text-center position-fixed w-100' style={{ zIndex: '100' }}>
          <img className='' style={{ height: '50vh', marginTop: '25vh' }} src="https://img.pikbest.com/png-images/20190918/cartoon-snail-loading-loading-gif-animation_2734139.png!sw800" alt="" />
        </div>
      }
      <div style={{ position: 'sticky', top: '0', zIndex: '100' }}><Navbar></Navbar></div>
      <div className='d-flex' style={{ backgroundColor: 'rgb(240,247,255)' }}>
        <SideBar></SideBar>
        <div className='container mt-4' >
          <h3 style={{ fontWeight: 'bold' }}>Hóa đơn</h3>
          <div className="d-flex">
            <input type="text" className="form-control mb-2 me-2" style={{ width: '200px' }} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-success mb-2" onClick={() => searchResult(search)}>Tìm tên học sinh</button>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered table-light align-middle" style={{ borderRadius: '10px', overflow: 'hidden' }}>
              <thead >
                <tr className='align-middle'>
                  <th>#</th>
                  <th>Thông tin học viên</th>
                  <th>Khóa học đã mua</th>
                  <th>Lịch học</th>
                  <th>Thời lượng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {info && info.map((item, index) =>
                  <tr key={index}>
                    <td>
                      <span className='fw-bold'>{(index + ((page - 1) * perPage)) + 1}</span>
                    </td>
                    <td>
                      <span className='fw-bold'>Name: {item.student_name}</span><br />
                      <span className='fw-bold'>Email: {item.email}</span><br />
                      <span className='fw-bold'>Phone: {item.phone}</span>
                    </td>
                    <td>
                      <span className='fw-bold'>{item.name}</span>
                    </td>
                    <td>
                      <span className='fw-bold' dangerouslySetInnerHTML={{ __html: item.schedule }}></span>
                    </td>
                    <td>
                      <span className='fw-bold'>{item.duration} buổi</span>
                    </td>
                    <td>
                      {item.bill_status == 0 ?
                        <button className='btn btn-warning w-100' onClick={() => [handleShow(), setBill_id(item.bill_id), setStudent_name(item.student_name), setEmail(item.email), setPhone(item.phone), setDuration(item.duration), setStudent_id(item.student_id)]}>Chưa xếp lớp</button>
                        :
                        <button className='btn btn-success w-100' disabled>Đã xếp lớp</button>
                      }
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
              </tfoot>
            </table>

            {page < 2 ?
              <div className="d-flex">
                <Pagination><Pagination.Prev disabled /></Pagination>
                <Pagination>{items}</Pagination>
                <Pagination><Pagination.Next onClick={() => setPage(page + 1)} /></Pagination>
              </div>
              : page >= lastPage ?
                <div className="d-flex">
                  <Pagination><Pagination.Prev onClick={() => setPage(page - 1)} /></Pagination>
                  <Pagination>{items}</Pagination>
                  <Pagination><Pagination.Next disabled /></Pagination>
                </div>
                :
                <div className="d-flex">
                  <Pagination><Pagination.Prev onClick={() => setPage(page - 1)} /></Pagination>
                  <Pagination>{items}</Pagination>
                  <Pagination><Pagination.Next onClick={() => setPage(page + 1)} /></Pagination>
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminBill