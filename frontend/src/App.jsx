// App.jsx
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layouts/Navbar";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <UserProvider>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <main>
                        <AppRoutes />
                    </main>
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                                borderRadius: '8px',
                                padding: '12px 16px',
                            },
                            success: {
                                duration: 3000,
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                duration: 4000,
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </div>
                </UserProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;