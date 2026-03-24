// App.jsx
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { PasswordProvider } from "./context/PasswordContext";
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
                    <PasswordProvider>
                    <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <main>
                            <AppRoutes />
                        </main>
                        <Toaster
                            richColors={false}
                            closeButton
                            position="top-center"
                            expand={false}
                            visibleToasts={3}
                            toastOptions={{
                                className: "schaden-toast",
                                duration: 4000,
                            }}
                        />
                    </div>
                    </PasswordProvider>
                </UserProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;