import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ChatbotWidget from './components/common/ChatbotWidget';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Marketplace from './pages/Marketplace';
import Learning from './pages/Learning';
import Community from './pages/Community';
import SkillVerification from './pages/SkillVerification';
import CVAnalysis from './pages/CVAnalysis';
import Courses from './pages/Courses';
import AdminCourses from './pages/AdminCourses';
import ExamPage from './pages/ExamPage';
import PaymentPage from './pages/PaymentPage';
import PaymentResult from './pages/PaymentResult';
import CourseDetail from './pages/CourseDetail';
import useAuth from './hooks/useAuth';

// حماية الصفحات اللي محتاجة تسجيل دخول
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="py-24 text-center text-white/50 text-sm">جاري التحميل...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// حماية الصفحات الإدارية العليا فقط للأدمن (Admin Route Wrapper)
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="py-24 text-center text-white/50 text-sm">جاري التحقق من الصلاحيات...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'admin') {
    return <Navigate to={user.role === 'client' ? '/client-dashboard' : '/dashboard'} replace />;
  }
  return children;
};

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/community" element={<Community />} />
          <Route path="/courses" element={<Courses />} />
          <Route
            path="/courses/:courseId"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <AdminRoute>
                <AdminCourses />
              </AdminRoute>
            }
          />
          <Route
            path="/courses/:courseId/exam"
            element={
              <ProtectedRoute>
                <ExamPage />
              </ProtectedRoute>
            }
          />
          <Route path="/payment-result" element={<PaymentResult />} />

          <Route
            path="/pay/:projectId"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pay-course/:courseId"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client-dashboard"
            element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/skill-verification"
            element={
              <ProtectedRoute>
                <SkillVerification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cv-analysis"
            element={
              <ProtectedRoute>
                <CVAnalysis />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ChatbotWidget />
      <Footer />
    </div>
  );
}

export default App;
