import { Route, Routes } from "react-router";
import "./App.css";
import Navbar from "./app/components/layout/navbar";
import { useToast } from "./app/hooks";
import ToastContainer from "./app/components/ui/toast-container";
import HomePage from "./app/containers/home-page";

function App() {
  const { toasts } = useToast();

  return (
    <div className="min-h-screen bg-[#0f0e0c]">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default App;
