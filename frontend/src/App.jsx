import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Page Components
import Home from './components/Home';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import Admin from './components/Auth/Admin';
import StaffLogin from './components/Auth/StaffLogin';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import FeedbackList from './components/Feedback/FeedbackList';
import MealHistory from './components/Dashboard/MealHistory';
import QRCodeScanner from './components/QRCodeScanner';
import NotFound from './components/NotFound';
import StudentProfile from './components/Dashboard/StudentProfile';
import StaffProfile from './components/Dashboard/StaffProfile';
import AdminProfile from './components/Dashboard/AdminProfile';
import BuyToken from './components/BuyToken';

// New: AdminComplaintsScreen
import AdminComplaintsScreen from './components/Complaint/AdminComplaintsScreen';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/student-profile', element: <StudentProfile /> },
  { path: '/staff-profile', element: <StaffProfile /> },
  { path: '/admin-profile', element: <AdminProfile /> },
  { path: '/login', element: <LoginForm /> },
  { path: '/signup', element: <SignupForm /> },
  { path: '/admin', element: <Admin /> },
  { path: '/staff', element: <StaffLogin /> },
  { path: '/complaints', element: <AdminComplaintsScreen /> }, // ✅ updated here
  { path: '/feedbacks', element: <FeedbackList /> },
  { path: '/aboutus', element: <AboutUs /> },
  { path: '/contactus', element: <ContactUs /> },
  { path: '/meal-history', element: <MealHistory /> },
  { path: '/qr-scanner', element: <QRCodeScanner /> },
  { path: '/buy-token', element: <BuyToken /> },
  { path: '*', element: <NotFound /> }
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
