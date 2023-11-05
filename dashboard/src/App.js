import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AdminUser from "./pages/AdminUser";
import AdminStudent from "./pages/AdminStudent";
import ScheduleTeacher from "./pages/ScheduleTeacher";
import ScheduleStudent from "./pages/ScheduleStudent";
import AdminEdu from "./pages/AdminEdu";
import AdminCate from "./pages/AdminCate";
import AdminCourse from "./pages/AdminCourse";
import AdminCourseSingle from "./pages/AdminCourseSingle";
import AdminProcess from "./pages/AdminProcess";
import AdminSchedule from "./pages/AdminSchedule";
import AdminBill from "./pages/AdminBill";
import Course from "./pages/Course";
import Grade from "./pages/Grade";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/AdminUser" element={<AdminUser />} />
            <Route path="/AdminStudent" element={<AdminStudent />} />
            <Route path="/AdminEducation" element={<AdminEdu />} />
            <Route path="/AdminCategory/:id" element={<AdminCate />} />
            <Route path="/AdminCourse/:id" element={<AdminCourse />} />
            <Route path="/AdminCourseSingle/:id" element={<AdminCourseSingle />} />
            <Route path="/AdminProcess" element={<AdminProcess />} />
            <Route path="/AdminSchedule" element={<AdminSchedule />} />
            <Route path="/AdminBill" element={<AdminBill />} />
            <Route path="/ScheduleTeacher" element={<ScheduleTeacher />} />
            <Route path="/ScheduleStudent" element={<ScheduleStudent />} />
            <Route path="/Grade/:grade" element={<Grade />} />
            <Route path="/Course/:id" element={<Course />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
