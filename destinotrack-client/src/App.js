import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import AddStudent from './pages/AddStudent/AddStudent';
import Attendance from './pages/Attendance/Attendance';
import SendMails from './pages/SendMails/SendMails';
import StudentsList from './pages/StudentsList/StudentsList';
import AttendanceList from './pages/AttendanceList/AttendanceList';
import AllMails from './pages/AllMails/AllMails';
import UserProfile from './pages/UserProfile/UserProfile';
import StudentDetails from './pages/StduentDetails/StudentDetails';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/addStudent' element={<AddStudent />} />
      <Route path='/attendance' element={<Attendance />} />
      <Route path='/sendMails' element={<SendMails />} />
      <Route path='/studentsList' element={<StudentsList />} />
      <Route path='/attendanceList' element={<AttendanceList />} />
      <Route path='/allMails' element={<AllMails />} />
      <Route path='/userProfile' element={<UserProfile />} />
      <Route path='/studentDetails/:studentId' element={<StudentDetails />} />
    </Routes>
  </Router>
  );
}

export default App;
