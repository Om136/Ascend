import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import {Routes,Route } from "react-router-dom";
function App() {
  return <Routes>
    <Route path="/Login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<ProtectedRoute>  <Dashboard /> </ProtectedRoute>} />
  </Routes>;
}

export default App;
