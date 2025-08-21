import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardArea from "./components/Dashboard";
import NotFound from "./components/NotFound";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import  Company  from "./components/Company";
import CoursesSection from "./components/CourseSection";
import ProfilePage from "./pages/Profile";
import Instructor from "./components/Instructor";
import Batch from "./components/Batch";

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoutes><Layout /></ProtectedRoutes>}>
            <Route path="/home" element={<DashboardArea />} />
            <Route path="/batches" element={<Batch/>} />
            <Route path="/schedule-batches" element={<div>Schedule Batches Area</div>} />
            <Route path="/company" element={<Company onSelectCompany={() => { }} selectedCompany={null} />} />
            <Route path="/courses" element={<CoursesSection />} />
            <Route path="/instructor" element={<Instructor/>} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

    </>
  );
};

export default App;
