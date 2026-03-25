// components/ChangePassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePassword } from "../context/PasswordContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Loader2,
    Eye,
    EyeOff,
    Lock
} from "lucide-react";

const ChangePassword = ({ open, onOpenChange }) => {
    const { logout } = useAuth();
    const { changePassword, loading: passwordLoading } = usePassword();
    const navigate = useNavigate();

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({});
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Password validation
    const validatePasswordForm = () => {
        const errors = {};
        
        if (!passwordForm.currentPassword) {
            errors.currentPassword = "Current password is required";
        }
        
        if (!passwordForm.newPassword) {
            errors.newPassword = "New password is required";
        } else if (passwordForm.newPassword.length < 8) {
            errors.newPassword = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(passwordForm.newPassword)) {
            errors.newPassword = "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(passwordForm.newPassword)) {
            errors.newPassword = "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(passwordForm.newPassword)) {
            errors.newPassword = "Password must contain at least one number";
        } else if (!/[^A-Za-z0-9]/.test(passwordForm.newPassword)) {
            errors.newPassword = "Password must contain at least one special character";
        }
        
        if (!passwordForm.confirmNewPassword) {
            errors.confirmNewPassword = "Please confirm your new password";
        } else if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            errors.confirmNewPassword = "Passwords do not match";
        }
        
        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (!validatePasswordForm()) {
            return;
        }
        
        setIsChangingPassword(true);
        
        try {
            await changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                confirmNewPassword: passwordForm.confirmNewPassword
            });
            
            // Reset form and close dialog
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            });
            setPasswordErrors({});
            onOpenChange(false);
            
            // Show a message before logout
            setTimeout(async () => {
                // Logout the user
                await logout();
                // Redirect to login page
                navigate("/login", { 
                    state: { 
                        message: "Password changed successfully. Please login with your new password." 
                    } 
                });
                // Refresh the page after navigation
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }, 2000);
            
        } catch (error) {
            // Error handled in context
            setIsChangingPassword(false);
        }
    };

    const handleClose = () => {
        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        });
        setPasswordErrors({});
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Lock className="h-5 w-5" />
                        Change Password
                    </DialogTitle>
                    <DialogDescription>
                        Enter your current password and choose a new password for your account.
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleChangePassword}>
                    <div className="space-y-4 py-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    className={passwordErrors.currentPassword ? "border-red-500" : ""}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {passwordErrors.currentPassword && (
                                <p className="text-xs text-red-500">{passwordErrors.currentPassword}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    className={passwordErrors.newPassword ? "border-red-500" : ""}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {passwordErrors.newPassword && (
                                <p className="text-xs text-red-500">{passwordErrors.newPassword}</p>
                            )}
                            {passwordForm.newPassword && !passwordErrors.newPassword && (
                                <div className="mt-2">
                                    <div className="text-xs text-gray-500 mb-1">Password strength:</div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full ${
                                                    passwordForm.newPassword.length >= 8 && 
                                                    /[A-Z]/.test(passwordForm.newPassword) &&
                                                    /[a-z]/.test(passwordForm.newPassword) &&
                                                    /[0-9]/.test(passwordForm.newPassword) &&
                                                    /[^A-Za-z0-9]/.test(passwordForm.newPassword)
                                                        ? level <= 4 ? "bg-green-500" : "bg-gray-200"
                                                        : passwordForm.newPassword.length >= 6 && level <= 2
                                                        ? "bg-yellow-500"
                                                        : "bg-gray-200"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmNewPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={passwordForm.confirmNewPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                                    className={passwordErrors.confirmNewPassword ? "border-red-500" : ""}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {passwordErrors.confirmNewPassword && (
                                <p className="text-xs text-red-500">{passwordErrors.confirmNewPassword}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={passwordLoading || isChangingPassword}
                            className="bg-gray-900 hover:bg-gray-800 cursor-pointer"
                        >
                            {(passwordLoading || isChangingPassword) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Change Password
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePassword;