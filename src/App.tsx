import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { lazy, Suspense } from "react";

import AuthProvider from "./auth/AuthProvider";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { Loader } from "./components/AsyncState";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApplicationList from "./pages/ApplicationList";
import ApplicationForm from "./pages/ApplicationForm";
import ApplicationDetail from "./pages/ApplicationDetail";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const KanbanBoard = lazy(() => import("./pages/KanbanBoard"));

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <Suspense fallback={<Loader label="Loading page..." />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/applications" element={<ApplicationList />} />
                <Route path="/applications/new" element={<ApplicationForm />} />
                <Route path="/board" element={<KanbanBoard />} />
                <Route
                  path="/applications/:id"
                  element={<ApplicationDetail />}
                />
                <Route
                  path="/applications/:id/edit"
                  element={<ApplicationForm />}
                />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
