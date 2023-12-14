import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Navbar from "../components/Navbar"
import axios from "axios";
import '../components/css/style.css'
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import Pagination from 'react-bootstrap/Pagination';

function AdminSchedule() {

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

  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = (() => {
    setShow2(false);
    setTime([{ time: '' }])
  });
  const handleShow2 = () => setShow2(true);

  const [schedule, setSchedule] = useState([])
  const [cate, setCate] = useState([])
  const [cate_id, setCate_id] = useState('')
  const [course, setCourse] = useState([])
  const [course_id, setCourse_id] = useState('');
  const [user_id, setUser_id] = useState('');
  const [teacher_id, setTeacher_id] = useState('');
  const [time, setTime] = useState([{ time: '' }]);
  const [edit_id, setEdit_id] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState('')
  const [lastPage, setLastPage] = useState('')
  // const [from, setFrom] = useState('');
  // console.log(schedule);
  // console.log(course_id);
  // console.log(teacher_id);

  useEffect(() => {
    if (!localStorage.getItem('email') || localStorage.getItem('role') != 6) {
      window.location.replace('/')
    } else {
      fetch(`https://duyanh.codingfs.com/api/schedule?page=${page}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          var arr = []
          res.data.forEach((el) => {
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
          setPerPage(res.per_page)
          setLastPage(res.last_page)
        });
      fetch(`https://duyanh.codingfs.com/api/getCate`)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setCate(res);
        });
      fetch(`https://duyanh.codingfs.com/api/teacher`)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setUser_id(res);
        });
    }
  }, []);

  useEffect(() => {
    fetch(`https://duyanh.codingfs.com/api/schedule?page=${page}`)
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        var arr = []
        res.data.forEach((el) => {
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
        setPerPage(res.per_page)
        setLastPage(res.last_page)
      });
  }, [page])

  const runCourse = ((cate_id) => {
    // console.log(cate_id);
    fetch(`https://duyanh.codingfs.com/api/getCourse?cate_id=${cate_id}`)
      .then((res) => res.json())
      .then((res) => {
        // console.log(res);
        setCourse(res)
      })
  })

  const addModule = () => {
    setTime([...time, { time: '' }])
    // console.log(time);
  }

  const addModulTime = ((value, index) => {
    const AMTime = [...time]
    AMTime[index].time = value
    // console.log(AMTime);
  })

  const deleteModule = (index) => {
    // console.log(index);
    const DMTime = [...time]
    DMTime.splice(index, 1)
    setTime(DMTime)
    // console.log(updateModuleTime);
  }


  const createSchedule = (() => {
    // console.log(course_id, teacher_id);
    // console.log(time);
    const stringify = JSON.stringify(time)
    console.log(stringify);
    if (course_id == '' || teacher_id == '') {
      Toast.fire({
        icon: 'error',
        title: 'Thiếu thông tin'
      })
    }
    else {
      const formData = new FormData()
      formData.append('course_id', course_id)
      formData.append('user_id', teacher_id)
      formData.append('time', stringify)
      axios.post(`https://duyanh.codingfs.com/api/createSchedule?page=${page}`,
        formData,
        { headers: { 'content-Type': 'multipart/form-data' } })
        .then((res) => {
          if (res.data.check == false) {
            if (res.data.msg.course_id) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.course_id
              })
            } else if (res.data.msg.user_id) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.user_id
              })
            } else if (res.data.msg.time) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.time
              })
            } else if (res.data.msg) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg
              })
            }
          }
          else {
            console.log(res.data);
            var arr = []
            res.data.data.forEach((el) => {
              var item = new Object()
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
              item.time = parseTime
              arr.push(item)
            })
            // console.log(arr);
            setSchedule(arr);
            setLastPage(res.data.last_page)
            Toast.fire({
              icon: 'success',
              title: 'Thêm lịch giảng dạy'
            })
            setTime([{ time: '' }]);
            handleClose1()
          }
        })
    }
  })

  const editSchedule = (() => {
    const stringify = JSON.stringify(time)
    if (edit_id == '') {
      Toast.fire({
        icon: 'error',
        title: 'Chọn chương trình để edit'
      })
    } else if (course_id == '' || teacher_id == '' || stringify == '') {
      Toast.fire({
        icon: 'error',
        title: 'Thiếu thông tin'
      })
    }
    // console.log(edit_id);
    // console.log(course_id);
    // console.log(teacher_id);
    // console.log(stringify);
    else {
      axios.post(`https://duyanh.codingfs.com/api/editSchedule?page=${page}`, {
        id: edit_id,
        course_id: course_id,
        user_id: teacher_id,
        time: stringify,
      })
        .then((res) => {
          if (res.data.check == false) {
            if (res.data.msg.id) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.id
              })
            } else if (res.data.msg.course_id) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.course_id
              })
            } else if (res.data.msg.user_id) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.user_id
              })
            } else if (res.data.msg.time) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg.time
              })
            } else if (res.data.msg) {
              Toast.fire({
                icon: 'error',
                title: res.data.msg
              })
            }
          }
          else {
            // console.log(res.data);
            var arr = []
            res.data.data.forEach((el) => {
              var item = new Object()
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
              item.time = parseTime
              arr.push(item)
            })
            // console.log(arr);
            setSchedule(arr);
            handleClose2()
            Toast.fire({
              icon: 'success',
              title: 'Sửa thành công'
            })
          }
        })
    }
  })

  const deleteSchedule = (id) => {
    Swal.fire({
      title: "Bạn có muốn xóa không?",
      text: "Xóa xong mất luôn đó!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa luôn!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`https://duyanh.codingfs.com/api/deleteSchedule?page=${page}`, {
            id: id,
          })
          .then((res) => {
            // console.log(res.data);
            if (res.data.check == false) {
              if (res.data.msg.id) {
                Toast.fire({
                  icon: 'error',
                  title: res.data.msg.id
                })
              }
              else if (res.data.msg) {
                Toast.fire({
                  icon: 'error',
                  title: res.data.msg
                })
              }
            }
            else {
              // console.log(res.data);
              var arr = []
              res.data.data.forEach((el) => {
                var item = new Object()
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
                item.time = parseTime
                arr.push(item)
              })
              // console.log(arr);
              setSchedule(arr);
              setLastPage(res.data.last_page)
              Toast.fire({
                icon: "success",
                title: "Xóa thành công",
              });
            }
          });
      }
    });
  }

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

  return (
    <div>
      {/* ============================================= Modal 1 Create Start ============================================================ */}
      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm lịch giảng dạy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Chọn khóa học</label><br />
            <select className='form-control' name="" id="" onChange={(e) => runCourse(e.target.value)}>
              {cate && cate.map((item, index) =>
                <option key={index} value={item.id} >{item.name}</option>
              )}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Chọn lớp</label><br />
            <select className='form-control' name="" value={course_id} onChange={(e) => setCourse_id(e.target.value)} id="">
            <option value={''} hidden>lớp</option>
              {!course || course == '' || course == null ?
                null
                :
                course.map((item, index) =>
                  <option key={index} value={item.id}>{item.name} -- {item.duration}</option>
                )
              }
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Chọn giảng viên</label><br />
            <select className='form-control' name="" defaultValue={teacher_id} onChange={(e) => setTeacher_id(e.target.value)} id="">
              <option value={''} hidden>Chọn giáo viên</option>
              {!user_id || user_id == '' || user_id == null ?
                null
                :
                user_id.map((item, index) =>
                  <option key={index} value={item.id}>{item.name}</option>
                )
              }
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Lịch giảng</label><br />
            {time && time.map((item, index) =>
              <div key={index}>
                <ReactQuill className='mb-3' theme="snow" defaultValue={''} value={item.time} onChange={(value) => addModulTime(value, index)} />
                <div className='text-end'>
                  <button className='btn btn-danger mb-3' onClick={() => deleteModule(index)}>Xóa Module</button>
                </div>
              </div>
            )}
            <button className='btn btn-success' onClick={addModule}>Thêm Module</button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => [createSchedule()]}>
            Thêm lịch
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ============================================= Modal 1 Create Ende ============================================================ */}

      {/* ============================================= Modal 2 Edit Start ============================================================ */}
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa lịch giảng dạy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Chọn khóa học</label><br />
            <select className='form-control' name="" id="" defaultValue={cate_id} onChange={(e) => runCourse(e.target.value)}>
              {cate && cate.map((item, index) =>
                <option key={index} value={item.id} >{item.name}</option>
              )}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Chọn lớp</label><br />
            <select className='form-control' name="" defaultValue={course_id} onChange={(e) => setCourse_id(e.target.value)} id="">
              {!course || course == '' || course == null ?
                null
                :
                course.map((item, index) =>
                  <option key={index} value={item.id}>{item.name} -- {item.duration}</option>
                )
              }
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Chọn giảng viên</label><br />
            <select className='form-control' name="" defaultValue={teacher_id} onChange={(e) => setTeacher_id(e.target.value)} id="">
              {!user_id || user_id == '' || user_id == null ?
                null
                :
                user_id.map((item, index) =>
                  <option key={index} value={item.id}>{item.name}</option>
                )
              }
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Lịch giảng</label><br />
            {time && time.map((item, index) =>
              <div key={index}>
                <ReactQuill className='mb-3' theme="snow" value={item.time} onChange={(value) => addModulTime(value, index)} />
                <div className='text-end'>
                  <button className='btn btn-danger mb-3' onClick={() => deleteModule(index)}>Xóa Module</button>
                </div>
              </div>
            )}
            <button className='btn btn-success' onClick={addModule}>Thêm Module</button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Đóng
          </Button>
          <Button variant="primary" onClick={(e) => [editSchedule(edit_id)]}>
            Sửa lịch
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ============================================= Modal 2 Edit Ende ============================================================ */}

      <div style={{ position: 'sticky', top: '0', zIndex: '100' }}><Navbar></Navbar></div>
      <div className='d-flex' style={{ backgroundColor: 'rgb(240,247,255)' }}>
        <SideBar></SideBar>
        <div className='container mt-4' >
          <h3 style={{ fontWeight: 'bold' }}>Lịch giảng dạy</h3>
          <button className='btn btn-success mb-2' onClick={() => [handleShow1(), setCourse_id(''), setCourse('')]}>Thêm</button>
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered table-light align-middle" style={{ borderRadius: '10px', overflow: 'hidden' }}>
              <thead >
                <tr className='align-middle'>
                  <th>Tên</th>
                  <th>Thời gian</th>
                  <th>Giảng viên</th>
                  <th>Sửa</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {schedule && schedule.map((item, index) =>
                  <tr key={index}>
                    <td>
                      <span className='fw-bold'>{item.courseName}</span>
                    </td>
                    <td>
                      {item.time.map((item2, index2) =>
                        <span key={index2} className='fw-bold' dangerouslySetInnerHTML={{ __html: item2.time }}></span>
                      )}
                    </td>
                    <td>
                      <span className='fw-bold'>{item.userName}</span>
                    </td>
                    <td>
                      <button className='btn btn-warning w-100' onClick={() => [handleShow2(), setEdit_id(item.id), setCate_id(item.cate_id), runCourse(item.cate_id), setCourse_id(item.course_id), setTeacher_id(item.user_id), setTime(item.time)]}>Sửa</button>
                    </td>
                    <td>
                      <button className='btn btn-danger w-100' onClick={() => deleteSchedule(item.id)}>Xóa</button>
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

export default AdminSchedule