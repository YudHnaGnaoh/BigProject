import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../components/css/style.css";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Pagination from 'react-bootstrap/Pagination';

function AdminStudent() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const [student, setStudent] = useState([]);
  const [newStudent, setNewStudent] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [addStudentPhone, setAddStudentPhone] = useState("");
  // ================= Modal Handler ==========================
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // ================= Edit Student ==========================
  const [studentName, setStudentName] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [studentId, setStudentId] = useState("");
  // ================= Paginate ==========================
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState('')
  const [lastPage, setLastPage] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('email') || localStorage.getItem('role') != 6) {
      window.location.replace('/')
    } else {
      fetch(`https://duyanh.codingfs.com/api/allStudents?page=${page}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setStudent(res.data);
          setPerPage(res.per_page)
          setLastPage(res.last_page)
        });
    }
  }, []);
  useEffect(() => {
    if (search && search != '' && search != null) {
      fetch(`https://duyanh.codingfs.com/api/searchStudents?search=${search}&page=${page}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setStudent(res.data);
          setLastPage(res.last_page)
        });
    } else {
      fetch(`https://duyanh.codingfs.com/api/allStudents?page=${page}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setStudent(res.data);
          setLastPage(res.last_page)
        });
    }
  }, [page])

  // useEffect(() => {
  //   if (search) {
  //     fetch(`https://duyanh.codingfs.com/api/searchStudents?search=${search}&page=${pageSearch}`)
  //       .then((res) => res.json())
  //       .then((res) => {
  //         // console.log(res);
  //         setStudent(res.data);
  //       });
  //   }
  // }, [pageSearch])

  const addStudent = () => {
    if (newStudent == "") {
      Toast.fire({
        icon: "error",
        title: "Điền tên",
      });
    } else if (newStudentEmail == "") {
      Toast.fire({
        icon: "error",
        title: "Điền email",
      });
    } else if (
      !newStudentEmail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      Toast.fire({
        icon: "error",
        title: "Sai email fomat",
      });
    } else if (
      !addStudentPhone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)
    ) {
      Toast.fire({
        icon: "error",
        title: "Sai fomat điện thoại",
      });
    } else {
      axios
        .post(`https://duyanh.codingfs.com/api/createStudent?page=${page}`, {
          name: newStudent,
          email: newStudentEmail,
          phone: addStudentPhone,
        })
        .then((res) => {
          console.log(res);
          if (res.data.check == false) {
            if (res.data.msg.name) {
              Toast.fire({
                icon: "error",
                title: res.data.msg.name,
              });
            } else if (res.data.msg.email) {
              Toast.fire({
                icon: "error",
                title: res.data.msg.email,
              });
            } else if (res.data.msg) {
              Toast.fire({
                icon: "error",
                title: res.data.msg,
              });
            }
          } else {
            // console.log(res.data);
            Toast.fire({
              icon: "success",
              title: "Dã thêm học sinh",
            });
            setStudent(res.data.data);
            setLastPage(res.data.last_page)
            setNewStudent('')
            setNewStudentEmail('')
            setAddStudentPhone('')
          }
        });
    }
  };

  const editStudent = () => {
    if (studentId == "") {
      Toast.fire({
        icon: "error",
        title: "Thiếu ID người dùng",
      });
    } else if (newStudentName == "") {
      Toast.fire({
        icon: "error",
        title: "Thiếu thông tin",
      });
    } else if (newStudentName == studentName && newStudentPhone == studentPhone) {
      Toast.fire({
        icon: "warning",
        title: "Chả có gì thay đổi",
      });
    } else if (!newStudentPhone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) {
      Toast.fire({
        icon: "error",
        title: "Sai fomat điện thoại",
      });
    } else {
      axios
        .post(`https://duyanh.codingfs.com/api/editStudent?page=${page}`, {
          id: studentId,
          name: newStudentName,
          phone: newStudentPhone,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.check == false) {
            if (res.data.msg.name) {
              Toast.fire({
                icon: "error",
                title: res.data.msg.name,
              });
            } else if (res.data.msg.id) {
              Toast.fire({
                icon: "error",
                title: res.data.msg.id,
              });
            } else if (res.data.msg) {
              Toast.fire({
                icon: "error",
                title: res.data.msg,
              });
            }
          } else {
            setStudent(res.data.data);
            Toast.fire({
              icon: "success",
              title: "Sửa thành công",
            });
            setStudentId("")
            setNewStudentName("");
            setNewStudentPhone("");
            setStudentName("");
            setStudentPhone("");
            handleClose();
          }
        });
    }
  };

  const switchStudent = (id) => {
    // console.log(id);
    axios
      .post(`https://duyanh.codingfs.com/api/switchStudent?page=${page}`, {
        id: id,
      })
      .then((res) => {
        // console.log(res.data);
        setStudent(res.data.data);
      });
  };

  const deleteStudent = (id) => {
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
          .post(`https://duyanh.codingfs.com/api/deleteStudent?page=${page}`, {
            id: id,
          })
          .then((res) => {
            if (res.data.check == false) {
              if (res.data.msg.id) {
                Toast.fire({
                  icon: "error",
                  title: res.data.msg.id,
                });
              } else if (res.data.msg) {
                Toast.fire({
                  icon: "error",
                  title: res.data.msg,
                });
              }
            } else {
              // console.log(res.data);
              setStudent(res.data.data);
              setLastPage(res.data.last_page)
              Toast.fire({
                icon: "success",
                title: "Xóa thành công",
              });
            }
          });
      }
    });
  };

  // ====================== Search =================================================== 
  const searchResult = async () => {
    try {
      const result = await axios.get(`https://duyanh.codingfs.com/api/searchStudents?search=${search}&page=1`);
      setStudent(result.data.data)
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

  return (
    <div>
      {/* ============================================= Modal Student ============================================================ */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Tên người dùng</label>
            <input
              type="text"
              className="form-control mb-3"
              defaultValue={studentName}
              data-id={studentId}
              onChange={(e) => setNewStudentName(e.target.value)}
            />
          </div><div className="mb-3">
            <label className="form-label">Số điện thoại</label>
            <input
              type="text"
              className="form-control mb-3"
              defaultValue={studentPhone}
              data-id={studentId}
              onChange={(e) => setNewStudentPhone(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => [editStudent()]}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ============================================= Modal Ende ============================================================ */}
      <div style={{ position: 'sticky', top: '0', zIndex: '100' }}><Navbar></Navbar></div>
      <div className="d-flex" style={{ backgroundColor: "rgb(240,247,255)" }}>
        <SideBar></SideBar>
        <div className="container mt-4">
          <div className="row">
            <h3 style={{ fontWeight: "bold" }}>Học sinh</h3>
            <div className="d-flex">
              <input type="text" className="form-control mb-2 me-2" style={{ width: '200px' }} onChange={(e) => setSearch(e.target.value)} />
              <button className="btn btn-success mb-2" onClick={() => searchResult(search)}>Tìm tên</button>
            </div>
            <div className="table-responsive">
              <table
                className="table table-striped table-hover table-bordered table-light align-middle"
                style={{ borderRadius: "10px", overflow: "hidden" }}
              >
                <thead className="align-middle">
                  <tr>
                    <th>Tên</th>
                    <th>Trạng thái</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Sửa</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {student &&
                    student != null &&
                    student.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <span className="fw-bold">{item.name}</span>
                        </td>
                        {item.status == 1 ? (
                          <td>
                            <span
                              className="text-success pointer fw-bold "
                              onClick={() => switchStudent(item.id)}
                            >
                              Mở
                            </span>
                          </td>
                        ) : (
                          <td>
                            <span
                              className="text-danger pointer fw-bold"
                              onClick={() => switchStudent(item.id)}
                            >
                              Khóa
                            </span>
                          </td>
                        )}
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>
                          <button
                            className="btn btn-warning w-100"
                            onClick={() => [
                              setStudentName(item.name),
                              setNewStudentName(item.name),
                              setStudentPhone(item.phone),
                              setNewStudentPhone(item.phone),
                              setStudentId(item.id),
                              handleShow(),
                            ]}
                          >
                            Sửa
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger w-100"
                            onClick={() => deleteStudent(item.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <td colSpan={2}>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Tên"
                        onChange={(e) => setNewStudent(e.target.value)}
                        value={newStudent}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        value={newStudentEmail}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        type="number"
                        placeholder="Số điện thoại"
                        onChange={(e) => setAddStudentPhone(e.target.value)}
                        value={addStudentPhone}
                      />
                    </td>
                    <td colSpan={2}>
                      <button
                        className="btn btn-success w-100"
                        onClick={() => addStudent()}
                      >
                        Thêm
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot></tfoot>
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
    </div>
  );
}

export default AdminStudent;
