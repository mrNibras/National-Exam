import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Practice from "./pages/Practice.jsx";
import StudyPlan from "./pages/StudyPlan.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import TeacherQuestionManagement from "./pages/TeacherQuestionManagement.jsx";
import TeacherClassManagement from "./pages/TeacherClassManagement.jsx";
import TeacherAnalytics from "./pages/TeacherAnalytics.jsx";
import CreateQuestion from "./pages/CreateQuestion.jsx";
import EditQuestion from "./pages/EditQuestion.jsx";
import ManageClass from "./pages/ManageClass.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['Student', 'Teacher', 'School Admin', 'Regional Admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/practice" element={
            <ProtectedRoute allowedRoles={['Student', 'Teacher', 'School Admin', 'Regional Admin']}>
              <Practice />
            </ProtectedRoute>
          } />
          <Route path="/study-plan" element={
            <ProtectedRoute allowedRoles={['Student', 'Teacher', 'School Admin', 'Regional Admin']}>
              <StudyPlan />
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute allowedRoles={['Student', 'Teacher', 'School Admin', 'Regional Admin']}>
              <Leaderboard />
            </ProtectedRoute>
          } />

          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute allowedRoles={['Teacher', 'School Admin', 'Regional Admin']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          <Route path="/teacher/questions" element={
            <ProtectedRoute allowedRoles={['Teacher', 'School Admin', 'Regional Admin']}>
              <TeacherQuestionManagement />
            </ProtectedRoute>
          } />
          <Route path="/teacher/classes" element={
            <ProtectedRoute allowedRoles={['Teacher', 'School Admin', 'Regional Admin']}>
              <TeacherClassManagement />
            </ProtectedRoute>
          } />
          <Route path="/teacher/analytics" element={
            <ProtectedRoute allowedRoles={['Teacher', 'School Admin', 'Regional Admin']}>
              <TeacherAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/teacher/questions/create" element={
            <ProtectedRoute allowedRoles={['Teacher', 'School Admin', 'Regional Admin']}>
              <CreateQuestion />
            </ProtectedRoute>
          } />
          <Route path="/teacher/questions/edit/:id" element={
            <ProtectedRoute allowedRoles={['Teacher', 'School Admin', 'Regional Admin']}>
              <EditQuestion />
            </ProtectedRoute>
          } />
          <Route path="/teacher/classes/:classId" element={
            <ProtectedRoute allowedRoles={['Teacher', 'School Admin', 'Regional Admin']}>
              <ManageClass />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;