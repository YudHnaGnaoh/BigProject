import React, { useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import Navbar from "../components/Navbar"
import axios from "axios";
import '../components/css/style.css'
import Swal from 'sweetalert2'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Pagination from 'react-bootstrap/Pagination';

function AdminProcess() {

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

  const [info, setInfo] = useState('')
  const [id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [pass, setPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [studentList, setStudentList] = useState('')
  const [allStudent, setAllStudent] = useState('')
  const [student_id, setStudent_id] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState('')
  const [lastPage, setLastPage] = useState('')

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (!localStorage.getItem('email') || localStorage.getItem('role') != 6) {
      window.location.replace('/')
    } else {
      fetch(`http://127.0.0.1:8000/api/getProcess?page=${page}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setInfo(res.data);
          setPerPage(res.per_page)
          setLastPage(res.last_page)
        });
      fetch(`http://127.0.0.1:8000/api/allStudents2`)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setAllStudent(res);
        });
    }
  }, []);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/getProcess?page=${page}`)
      .then((res) => res.json())
      .then((res) => {
        setInfo(res.data);
      });
  }, [page])

  const getStudent = (i) => {
    // console.log(i);
    fetch(`http://127.0.0.1:8000/api/getStudents?id=${i}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setStudentList(res);
      });
  };

  const editPass = (() => {
    if (newPass == '') {
      Toast.fire({
        icon: 'error',
        title: 'Số buổi không dược để rỗng'
      })
    } else if (pass == newPass) {
      Toast.fire({
        icon: 'warning',
        title: 'Không thay đổi gi'
      })
    } else {
      axios.post(`http://127.0.0.1:8000/api/editPass?page=${page}`, {
        id: id,
        pass: newPass,
      })
        .then((res) => {
          setNewPass('')
          setInfo(res.data.data)
          Toast.fire({
            icon: 'success',
            title: 'Đã thay đổi'
          })
        })
    }
  })

  const addStudent = (() => {
    // console.log(id, student_id);
    axios.post(`http://127.0.0.1:8000/api/addStudent`, {
      process_id: id,
      student_id: student_id,
    })
      .then((res) => {
        // console.log(res);
        if (res.data.check == false) {
          if (res.data.msg.process_id) {
            Toast.fire({
              icon: 'error',
              title: res.data.msg.process_id
            })
          } else if (res.data.msg.student_id) {
            Toast.fire({
              icon: 'error',
              title: res.data.msg.student_id
            })
          } else if (res.data.msg) {
            Toast.fire({
              icon: 'error',
              title: res.data.msg
            })
          }
        } else {
          setStudentList(res.data)
          Toast.fire({
            icon: 'success',
            title: 'Đã xóa học sinh'
          })
          fetch(`http://127.0.0.1:8000/api/getProcess`)
            .then((res) => res.json())
            .then((res) => {
              setInfo(res.data);
            });
        }

      })
  })

  const deleteStudent = ((i) => {
    // console.log(id, i);
    Swal.fire({
      title: "Xóa học sinh?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa học sinh!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`http://127.0.0.1:8000/api/removeStudent`, {
          process_id: id,
          student_id: i,
        })
          .then((res) => {
            // console.log(res);
            if (res.data.check == false) {
              if (res.data.msg.process_id) {
                Toast.fire({
                  icon: 'error',
                  title: res.data.msg.process_id
                })
              } else if (res.data.msg.student_id) {
                Toast.fire({
                  icon: 'error',
                  title: res.data.msg.student_id
                })
              } else if (res.data.msg) {
                Toast.fire({
                  icon: 'error',
                  title: res.data.msg
                })
              }
            } else {
              Toast.fire({
                icon: 'success',
                title: 'Đã xóa học sinh'
              })
              setStudentList(res.data)
              fetch(`http://127.0.0.1:8000/api/getProcess?page=${page}`)
                .then((res) => res.json())
                .then((res) => {
                  setInfo(res.data);
                });
            }
          });
      }
    }
    )
  })

  const deleteClass = ((i) => {
    // console.log(id, i);
    Swal.fire({
      title: "Xóa lớp?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa lớp!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`http://127.0.0.1:8000/api/removeClass?page=${page}`, {
          id: i,
        })
          .then((res) => {
            // console.log(res);
            if (res.data.check == false) {
              if (res.data.msg.id) {
                Toast.fire({
                  icon: 'error',
                  title: res.data.msg.id
                })
              } else if (res.data.msg) {
                Toast.fire({
                  icon: 'error',
                  title: res.data.msg
                })
              }
            } else {
              Toast.fire({
                icon: 'success',
                title: 'Đã xóa lớp'
              })
              setInfo(res.data.data)
              // fetch(`http://127.0.0.1:8000/api/getProcess?page=${page}`)
              //   .then((res) => res.json())
              //   .then((res) => {
              //     setInfo(res.data);
              // });
            }
          });
      }
    }
    )
  })

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
      {/* ============================================= Modal Start ============================================================ */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3 text-center">
            <label className="form-label">Sô buổi đã diễn ra</label>
            <input type="text"
              className="form-control text-center w-50 mx-auto" defaultValue={pass} onChange={(e) => setNewPass(e.target.value)} />
            <Button className='mx-auto mt-2' variant="primary" onClick={() => [editPass()]}>
              Thay đổi số buổi
            </Button>
          </div>
          <div className="mb-3">
            <label className="form-label text-center">Học sinh trong lớp</label>
            {studentList && studentList.map((item, index) =>
              <div className="row mb-2">
                <div className="col-md-10">
                  <span key={index} type="text" className="form-control">{item.name} - {item.email}</span>

                </div>
                <div className="col-md-2">
                  <button className='btn btn-danger w-100' onClick={() => deleteStudent(item.id)}>Xóa</button>
                </div>
              </div>
            )}
            <div className="row mb-2 d-flex">
              <div className="col-md-10">
                <select className="form-select mb-3" name="" id="" onChange={(e) => setStudent_id(e.target.value)}>
                  <option value='' hidden>Thêm học sinh</option>
                  {allStudent && allStudent.map((item, index) =>
                    <option key={index} value={item.id}>{item.name} - {item.email}</option>
                  )}
                </select>
              </div>
              <div className="col-md-2">
                <button className='btn btn-success' onClick={() => addStudent()}>Thêm</button>
              </div>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer> */}
      </Modal>
      {/* ============================================= Modal Ende ============================================================ */}

      <div style={{ position: 'sticky', top: '0', zIndex: '100' }}><Navbar></Navbar></div>
      <div className="d-flex" style={{ backgroundColor: "rgb(240,247,255)" }}>
        <SideBar></SideBar>
        <div className="container mt-4">
          <h3 style={{ fontWeight: 'bold' }}>Lịch lớp</h3>
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered table-light align-middle" style={{ borderRadius: '10px', overflow: 'hidden' }}>
              <thead >
                <tr className='align-middle'>
                  <th>Lớp</th>
                  <th>Giáo viên</th>
                  <th>Lịch học</th>
                  <th>Số buổi đã diễn ra trên tổng</th>
                  <th>Số lượng học sinh</th>
                  <th>Chỉnh sửa</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {info && info.map((item, index) =>
                  < tr key={index}>
                    <td>
                      <span>{item.className}</span>
                    </td>
                    <td>
                      <span>{item.teacher}</span>
                    </td>
                    <td>
                      <span dangerouslySetInnerHTML={{ __html: item.schedule }}></span>
                    </td>
                    <td>
                      <span>{item.pass} / {item.duration}</span>
                    </td>
                    <td>
                      <span>{item.student_count} bạn</span>
                    </td>
                    <td>
                      <div className="d-flex">
                        <button className='btn btn-warning me-1' onClick={() => [handleShow(), setTitle(item.className), setPass(item.pass), setNewPass(item.pass), setId(item.id), getStudent(item.id)]}>Sửa</button>
                        <button className='btn btn-danger' onClick={() => deleteClass(item.id)}>Xóa</button>
                      </div>
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

export default AdminProcess