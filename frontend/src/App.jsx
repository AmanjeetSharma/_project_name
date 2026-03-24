// App.jsx
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layouts/Navbar";
import ScrollToTop from "./components/layouts/ScrollToTop";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
                <UserProvider>
                    <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <main>
                            <AppRoutes />
                        </main>
                        <Toaster
                            richColors
                            closeButton
                            position="top-center"
                            expand={false}
                            visibleToasts={3}
                            toastOptions={{
                                style: {
                                    background: "white",
                                    border: "1px solid rgba(0, 0, 0, 0.05)",
                                    borderRadius: "12px",
                                    padding: "12px 16px",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                },
                                className: "schaden-toast",
                                duration: 4000,
                            }}
                        />
                    </div>
                </UserProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;