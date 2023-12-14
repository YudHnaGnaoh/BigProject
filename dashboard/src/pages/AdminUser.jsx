import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import axios from "axios";
import "../components/css/style.css";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Pagination from 'react-bootstrap/Pagination';

function AdminUser() {
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

  const [userRole, setUserRole] = useState([]);
  const [user, setUser] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [newUser, setNewUser] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newRole_id, setNewRole_id] = useState("6");
  // ================= Modal Handler ==========================
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  // ================= Edit Role ==========================
  const [roleName, setRoleName] = useState("");
  const [newRoleName, setNewRoleName] = useState("");
  const [roleId, setRoleId] = useState("");
  // ================= Edit User ==========================
  const [userName, setUserName] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userRoleId, setUserRoleId] = useState("");
  const [newUserRoleId, setNewUserRoleId] = useState("");
  // ================= Paginate ==========================
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState('')
  const [lastPage, setLastPage] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('email') || localStorage.getItem('role') != 6) {
      window.location.replace('/')
    } else {
      fetch(`https://duyanh.codingfs.com/api/role`)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setUserRole(res);
        });
      fetch(`https://duyanh.codingfs.com/api/user?page=${page}`)
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setUser(res.data);
          setPerPage(res.per_page)
          setLastPage(res.last_page)
        });
    }
  }, []);

  useEffect(() => {
    fetch(`https://duyanh.codingfs.com/api/user?page=${page}`)
      .then((res) => res.json())
      .then((res) => {
        setUser(res.data);
      });
  }, [page])

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

  const addRole = () => {
    if (newRole == "") {
      Toast.fire({
        icon: "error",
        title: "Điền tên",
      });
    } else {
      axios
        .post("https://duyanh.codingfs.com/api/createRole", {
          name: newRole,
        })
        .then((res) => {
          if (res.data.check == false) {
            if (res.data.msg.name) {
              Toast.fire({
                icon: "error",
                title: res.data.msg.name,
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
              title: "Dã thêm loại tài khoán",
            });
            setUserRole(res.data);
            setNewRole('')
          }
        });
    }
  };

  const editRole = () => {
    if (roleId == "") {
      Toast.fire({
        icon: "error",
        title: "Thiếu ID khóa học",
      });
    } else if (newRoleName == "") {
      Toast.fire({
        icon: "error",
        title: "Điền tên khóa học",
      });
    } else if (newRoleName == roleName) {
      Toast.fire({
        icon: "warning",
        title: "Tên vẫn thế",
      });
    } else {
      axios
        .post("https://duyanh.codingfs.com/api/editRole", {
          id: roleId,
          name: newRoleName,
        })
        .then((res) => {
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
            // console.log(res.data);
            setUserRole(res.data);
            Toast.fire({
              icon: "success",
              title: "Sửa thành công",
            });
            setNewRoleName("");
            setRoleName("");
            handleClose1();
          }
        });
    }
  };

  const switchRole = (id) => {
    // console.log(id);
    axios
      .post("https://duyanh.codingfs.com/api/switchRole", {
        id: id,
      })
      .then((res) => {
        // console.log(res.data);
        setUserRole(res.data);
      });
  };

  const deleteRole = (id) => {
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
          .post("https://duyanh.codingfs.com/api/deleteRole", {
            id: id,
          })
          .then((res) => {
            // console.log(res.data);
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
              setUserRole(res.data);
              Toast.fire({
                icon: "success",
                title: "Xóa thành công",
              });
            }
          });
      }
    });
  };

  const addUser = () => {
    // console.log(newRole_id);
    if (newUser == "") {
      Toast.fire({
        icon: "error",
        title: "Điền tên",
      });
    } else if (newUserEmail == "") {
      Toast.fire({
        icon: "error",
        title: "Điền email",
      });
    } else if (
      !newUserEmail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
    ) {
      Toast.fire({
        icon: "error",
        title: "Sai email fomat",
      });
    } else {
      axios
        .post(`https://duyanh.codingfs.com/api/createUser?page=${page}`, {
          name: newUser,
          email: newUserEmail,
          role_id: newRole_id,
        })
        .then((res) => {
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
            } else if (res.data.msg.role_id) {
              Toast.fire({
                icon: "error",
                title: res.data.msg.role_id,
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
              title: "Dã thêm người dùng",
            });
            setUser(res.data.data);
            setLastPage(res.data.last_page);
            setNewUser('');
            setNewUserEmail('');
            setNewRole_id('');
          }
        });
    }
  };

  const editUser = () => {
    if (userId == "") {
      Toast.fire({
        icon: "error",
        title: "Thiếu ID người dùng",
      });
    } else if (newUserName == "") {
      Toast.fire({
        icon: "error",
        title: "Điền tên người dùng",
      });
    } else if (newUserRoleId == "") {
      Toast.fire({
        icon: "error",
        title: "Thiếu loại tài khoản",
      });
    } else if (newUserName == userName && newUserRoleId == userRoleId) {
      Toast.fire({
        icon: "warning",
        title: "Chả có gì thay đổi",
      });
    } else {
      axios
        .post(`https://duyanh.codingfs.com/api/editUser?page=${page}`, {
          id: userId,
          name: newUserName,
          role_id: newUserRoleId
        })
        .then((res) => {
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
            } else if (res.data.msg.role_id) {
              Toast.fire({
                icon: "error",
                title: res.data.msg.role_id,
              });
            } else if (res.data.msg) {
              Toast.fire({
                icon: "error",
                title: res.data.msg,
              });
            }
          } else {
            // console.log(res.data);
            setUser(res.data.data);
            Toast.fire({
              icon: "success",
              title: "Sửa thành công",
            });
            setUserId("")
            setNewUserName("");
            setUserName("");
            setNewUserRoleId("");
            setUserRoleId("");
            handleClose2();
          }
        });
    }
  };

  const switchUser = (id) => {
    // console.log(id);
    axios
      .post(`https://duyanh.codingfs.com/api/switchUser?page=${page}`, {
        id: id,
      })
      .then((res) => {
        // console.log(res.data);
        setUser(res.data.data);
      });
  };

  const deleteUser = (id) => {
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
          .post(`https://duyanh.codingfs.com/api/deleteUser?page=${page}`, {
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
              // console.log(res);
              setUser(res.data.data);
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

  return (
    <div>
      {/* ============================================= Modal User Role ============================================================ */}
      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa loại tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Tên loại tài khoản</label>
            <input
              type="text"
              className="form-control"
              defaultValue={roleName}
              data-id={roleId}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => [editRole()]}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ============================================= Modal User ============================================================ */}
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Tên người dùng</label>
            <input
              type="text"
              className="form-control mb-3"
              defaultValue={userName}
              data-id={userId}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            <select className='form-select' defaultValue={userRoleId} onChange={(e) => setNewUserRoleId(e.target.value)} name="" id="">
              {userRole && userRole != null && userRole.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => [editUser()]}>
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
            <div className="col-lg-4">
              <h3 style={{ fontWeight: "bold" }}>Loại tài khoán</h3>
              <div className="table-responsive">
                <table
                  className="table table-striped table-hover table-bordered table-light align-middle"
                  style={{ borderRadius: "10px", overflow: "hidden" }}
                >
                  <thead>
                    <tr className="align-middle">
                      <th>Tên</th>
                      <th>Trạng thái</th>
                      <th>Sửa</th>
                      <th>Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {userRole && userRole != null && userRole.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <span className="fw-bold">{item.name}</span>
                        </td>
                        {item.status == 1 ? (
                          <td>
                            <span className="text-success pointer fw-bold "
                              onClick={() => switchRole(item.id)}>Mở</span>
                          </td>
                        ) : (
                          <td>
                            <span className="text-danger pointer fw-bold"
                              onClick={() => switchRole(item.id)}>Khóa</span>
                          </td>
                        )}
                        <td>
                          {item.name == 'Admin' || item.name == 'Giáo Viên' ?
                            <button className="btn btn-warning w-100" disabled
                              onClick={() => [setRoleName(item.name), setNewRoleName(item.name),
                              setRoleId(item.id), handleShow1()]}>
                              Sửa
                            </button>
                            :
                            <button className="btn btn-warning w-100"
                              onClick={() => [setRoleName(item.name), setNewRoleName(item.name),
                              setRoleId(item.id), handleShow1()]}>
                              Sửa
                            </button>
                          }

                        </td>
                        <td>
                          {item.name == 'Admin' || item.name == 'Giáo Viên' ?
                            <button className="btn btn-danger w-100" disabled
                              onClick={() => deleteRole(item.id)}>Xóa
                            </button>
                            :
                            <button className="btn btn-danger w-100"
                              onClick={() => deleteRole(item.id)}>Xóa
                            </button>
                          }
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={2}>
                        <input className="form-control" type="text" placeholder="Add new role"
                          onChange={(e) => setNewRole(e.target.value)} value={newRole} />
                      </td>
                      <td colSpan={2}>
                        <button className="btn btn-success w-100"
                          onClick={() => addRole()}>Thêm
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot></tfoot>
                </table>
              </div>
            </div>
            <div className="col-lg">
              <h3 style={{ fontWeight: "bold" }}>Người dùng</h3>
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
                      <th>Loại tài khoản</th>
                      <th>Sửa</th>
                      <th>Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {user &&
                      user != null &&
                      user.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <span className="fw-bold">{item.name}</span>
                          </td>
                          {item.status == 1 ? (
                            <td>
                              <span
                                className="text-success pointer fw-bold "
                                onClick={() => switchUser(item.id)}
                              >
                                Mở
                              </span>
                            </td>
                          ) : (
                            <td>
                              <span
                                className="text-danger pointer fw-bold"
                                onClick={() => switchUser(item.id)}
                              >
                                Khóa
                              </span>
                            </td>
                          )}
                          <td>{item.email}</td>
                          <td>{item.rolename}</td>
                          <td>
                            <button
                              className="btn btn-warning w-100"
                              onClick={() => [
                                setUserName(item.name),
                                setNewUserName(item.name),
                                setUserId(item.id),
                                setUserRoleId(item.role_id),
                                setNewUserRoleId(item.role_id),
                                handleShow2(),
                              ]}
                            >
                              Sửa
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-danger w-100"
                              onClick={() => deleteUser(item.id)}
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
                          onChange={(e) => setNewUser(e.target.value)}
                          value={newUser}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          type="email"
                          placeholder="Email"
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          value={newUserEmail}
                        />
                      </td>
                      <td>
                        <select
                          className="form-select"
                          onChange={(e) => setNewRole_id(e.target.value)}
                          value={newRole_id}
                          name=""
                          id=""
                        >
                          {userRole &&
                            userRole != null &&
                            userRole.map((item, index) => (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td colSpan={2}>
                        <button
                          className="btn btn-success w-100"
                          onClick={() => addUser()}
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
    </div>
  );
}

export default AdminUser;
