import { Route, Routes } from "react-router";
import "./App.css";
import Navbar from "./app/components/layout/navbar";
import { ToastContainer } from "react-toastify";
import HomePage from "./app/containers/home-page";
import NewProtocolPage from "./app/containers/new-protocol-page";
import ProtocolDetailPage from "./app/containers/protocol-detail-page";
import LoginPage from "./app/containers/login-page";
import EditProtocolPage from "./app/containers/edit-protocol-page";

function App() {
  return (
    <div className="min-h-screen bg-[#0f0e0c]">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/protocols/new" element={<NewProtocolPage />} />
          <Route path="/protocols/:slug" element={<ProtocolDetailPage />} />
          <Route path="/protocols/:slug/edit" element={<EditProtocolPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      <ToastContainer />
    </div>
  );
}

export default App;
