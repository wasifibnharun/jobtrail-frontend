import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AuthProvider from "./auth/AuthProvider";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PlaceholderPage from "./pages/PlaceholderPage";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/register"
            element={<PlaceholderPage title="Register" />}
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route
                path="/"
                element={<PlaceholderPage title="Dashboard" />}
              />
              <Route
                path="/applications"
                element={<PlaceholderPage title="Applications" />}
              />
              <Route
                path="/applications/new"
                element={<PlaceholderPage title="Add application" />}
              />
              <Route
                path="/applications/:id/edit"
                element={<PlaceholderPage title="Edit application" />}
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}