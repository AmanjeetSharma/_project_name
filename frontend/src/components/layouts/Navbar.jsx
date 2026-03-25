// components/layout/Navbar.jsx
import { useState, useEffect, useRef, memo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu, X, LogOut, User, Settings, Shield,
    ChevronDown, GraduationCap, LayoutDashboard,
    BookOpen, Info, Sparkles, Compass, Star, Gift,
    Crown, MessageCircle, HelpCircle, ExternalLink, Zap
} from "lucide-react";

// Optimized nav links with metadata
const navLinks = [
    {
        name: "Explore",
        path: "/colleges",
        icon: Compass,
        description: "Discover your perfect match"
    },
    {
        name: "Guide",
        path: "/how-it-works",
        icon: BookOpen,
        description: "Step-by-step journey"
    },
];

// Premium Info links with enhanced styling
const infoLinks = [
    {
        label: "About",
        icon: Info,
        path: "/about",
        description: "Our story",
        gradient: "from-blue-500 to-indigo-500"
    },
    {
        label: "Contact",
        icon: MessageCircle,
        path: "/contact",
        description: "Get in touch",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        label: "FAQ",
        icon: HelpCircle,
        path: "/faq",
        description: "Common questions",
        gradient: "from-emerald-500 to-teal-500"
    }
];

// Enhanced premium button with gradient and micro-interactions
const PremiumButton = memo(({ children, onClick, href, className = "", size = "default", variant = "primary" }) => {
    const variants = {
        primary: "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl",
        secondary: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-lg hover:shadow-xl",
        outline: "border-2 border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-900 shadow-sm"
    };

    const sizeClasses = {
        sm: "px-4 py-2 text-xs gap-1.5",
        default: "px-5 py-2.5 text-sm gap-2",
        lg: "px-6 py-3 text-base gap-2.5"
    };

    const inner = (
        <button
            onClick={onClick}
            className={`
                relative group overflow-hidden inline-flex items-center justify-center
                font-semibold tracking-wide rounded-xl
                transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                ${variants[variant]} 
                ${sizeClasses[size]}
                ${className}
            `}
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {/* Animated gradient overlay */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/20 via-white/10 to-transparent" />

            {/* Shimmer effect on hover */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Glow effect */}
            <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]" />

            {children}
        </button>
    );

    return href ? <Link to={href}>{inner}</Link> : inner;
});

PremiumButton.displayName = 'PremiumButton';

// Enhanced ghost button with hover effects
const GhostButton = memo(({ children, href, onClick, icon: Icon, className = "" }) => {
    const content = (
        <button
            onClick={onClick}
            className={`
                relative inline-flex items-center gap-2 text-sm font-medium
                text-gray-600 hover:text-gray-900
                px-3 py-2 rounded-lg
                transition-all duration-300
                hover:bg-gray-100/80
                active:scale-95
                group
                ${className}
            `}
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {Icon && <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />}
            {children}
        </button>
    );

    return href ? <Link to={href}>{content}</Link> : content;
});

GhostButton.displayName = 'GhostButton';

// Memoized Logo component
const Logo = memo(() => (
    <Link to="/" className="flex items-center gap-2.5 group select-none">
        <div className="relative">
            <motion.div
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <GraduationCap className="h-4.5 w-4.5 text-white" strokeWidth={1.8} />
            </motion.div>

            {/* Animated sparkle */}
            <motion.span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />
        </div>

        <motion.span
            className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
            style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}
            whileHover={{ scale: 1.02 }}
        >
            CollegeFinder
        </motion.span>
    </Link>
));

Logo.displayName = 'Logo';

// Get initials helper
const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

// Enhanced Premium Info Button Group Component
const PremiumInfoButtonGroup = memo(({ navigate }) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const location = useLocation();

    return (
        <div className="ml-3 border-l border-gray-200 pl-3 flex items-center gap-1">
            {infoLinks.map((link, index) => {
                const isActive = location.pathname === link.path;

                return (
                    <motion.div
                        key={link.path}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(link.path)}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            className={`
                                relative group px-4 py-2 h-auto
                                transition-all duration-300
                                ${isActive
                                    ? "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"}
                            `}
                        >
                            {/* Animated background gradient */}
                            <motion.div
                                className="absolute inset-0 rounded-lg"
                                initial={false}
                                animate={{
                                    background: isActive
                                        ? "linear-gradient(to right, rgba(243, 244, 246, 0.8), rgba(249, 250, 251, 0.5))"
                                        : activeIndex === index
                                            ? "linear-gradient(to right, rgba(243, 244, 246, 0.4), rgba(249, 250, 251, 0.2))"
                                            : "transparent"
                                }}
                                transition={{ duration: 0.2 }}
                            />

                            {/* Icon with animation */}
                            <motion.div
                                className="relative z-10 flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <link.icon
                                    className={`
                                        h-4 w-4 transition-all duration-300
                                        ${isActive
                                            ? "text-gray-900"
                                            : activeIndex === index
                                                ? "text-gray-600"
                                                : "text-gray-400"}
                                    `}
                                />
                                <span className="text-sm font-medium">{link.label}</span>

                                {/* Premium indicator dot for active */}
                                {isActive && (
                                    <motion.span
                                        layoutId="active-info-dot"
                                        className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-gray-900"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </motion.div>

                            {/* Hover tooltip with description */}
                            {activeIndex === index && !isActive && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap z-20 pointer-events-none"
                                >
                                    {link.description}
                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                                </motion.div>
                            )}
                        </Button>

                        {/* Separator between buttons */}
                        {index < infoLinks.length - 1 && (
                            <ButtonGroupSeparator className="mx-0.5" />
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
});

PremiumInfoButtonGroup.displayName = 'PremiumInfoButtonGroup';

// Enhanced Mobile Premium Info Links Component
const MobilePremiumInfoLinks = memo(({ navigate, onClose }) => {
    const location = useLocation();

    return (
        <div className="grid grid-cols-3 gap-2 p-2">
            {infoLinks.map(({ label, icon: Icon, path, description, gradient }, index) => {
                const isActive = location.pathname === path;

                return (
                    <motion.div
                        key={path}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to={path}
                            onClick={onClose}
                            className={`
                                relative flex flex-col items-center gap-2 py-3 px-2 rounded-xl
                                transition-all duration-300 group overflow-hidden
                                ${isActive
                                    ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg"
                                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-100"}
                            `}
                        >
                            {/* Animated background gradient for active state */}
                            {isActive && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}

                            {/* Icon with animation */}
                            <motion.div
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400 }}
                                className="relative z-10"
                            >
                                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"}`} />
                            </motion.div>

                            {/* Label */}
                            <span className={`relative z-10 text-xs font-semibold ${isActive ? "text-white" : "text-gray-600"}`}>
                                {label}
                            </span>

                            {/* Description (hidden on mobile) */}
                            <span className={`relative z-10 text-[10px] ${isActive ? "text-white/80" : "text-gray-400"} hidden`}>
                                {description}
                            </span>

                            {/* Glow effect on hover */}
                            {!isActive && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "100%" }}
                                    transition={{ duration: 0.6 }}
                                />
                            )}
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
});

MobilePremiumInfoLinks.displayName = 'MobilePremiumInfoLinks';

// Main Navbar Component
const Navbar = () => {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const mobileMenuRef = useRef(null);

    // Optimized scroll handler
    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 8);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Close on outside click
    useEffect(() => {
        if (!mobileOpen) return;

        const handler = (e) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
                setMobileOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [mobileOpen]);

    // Memoized handlers
    const handleLogout = useCallback(async () => {
        await logout();
        navigate("/");
        setMobileOpen(false);
    }, [logout, navigate]);

    const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

    // Loading skeleton
    if (loading) {
        return (
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                    <Logo />
                </div>
            </nav>
        );
    }

    return (
        <>
            {/* Optimized font loading */}
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
                rel="stylesheet"
            />

            <nav
                className={`
                    sticky top-0 z-50 transition-all duration-500
                    ${scrolled
                        ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg"
                        : "bg-white border-b border-gray-100"}
                `}
                style={{ fontFamily: "'Inter', sans-serif" }}
                ref={mobileMenuRef}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <Logo />

                        {/* Desktop Navigation with Premium Info Button Group */}
                        <div className="hidden md:flex items-center gap-2">
                            {/* Main navigation links */}
                            {navLinks.map((link) => (
                                <Link key={link.path} to={link.path}>
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`
                                            relative inline-flex items-center gap-2 px-4 py-2 rounded-xl
                                            text-sm font-medium transition-all duration-300 cursor-pointer
                                            ${isActive(link.path)
                                                ? "text-gray-900 bg-gradient-to-r from-gray-100 to-gray-50 shadow-sm"
                                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}
                                        `}
                                    >
                                        <link.icon className={`h-4 w-4 transition-transform duration-300 ${isActive(link.path) ? "text-gray-900" : "text-gray-400"}`} />
                                        {link.name}

                                        {isActive(link.path) && (
                                            <motion.span
                                                layoutId="nav-indicator"
                                                className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-gray-900 to-gray-600 rounded-full"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </motion.div>
                                </Link>
                            ))}

                            {/* Premium Info Button Group */}
                            <PremiumInfoButtonGroup navigate={navigate} />
                        </div>

                        {/* Desktop Auth */}
                        <div className="hidden md:flex items-center gap-3">
                            {isAuthenticated && user ? (
                                <UserDropdown user={user} navigate={navigate} onLogout={handleLogout} />
                            ) : (
                                <>
                                    <GhostButton href="/login" icon={User}>
                                        Sign In
                                    </GhostButton>
                                    <PremiumButton href="/register" variant="primary" size="default" className="text-white">
                                        <Sparkles className="h-4 w-4" />
                                        Get Started
                                        <Zap className="h-3.5 w-3.5 opacity-70" />
                                    </PremiumButton>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileOpen(v => !v)}
                            aria-label="Toggle menu"
                            className="md:hidden relative z-10 w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {mobileOpen ? (
                                    <motion.span
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="h-5 w-5" />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="h-5 w-5" />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 top-16 bg-black/30 backdrop-blur-sm z-40 md:hidden"
                                onClick={() => setMobileOpen(false)}
                            />

                            {/* Panel */}
                            <motion.div
                                key="panel"
                                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                className="absolute top-full left-3 right-3 z-50 md:hidden rounded-2xl border border-gray-200/80 bg-white/95 backdrop-blur-xl shadow-xl overflow-hidden"
                            >
                                <div className="p-2">
                                    {/* Main Nav Links */}
                                    <div className="space-y-0.5">
                                        {navLinks.map((link, i) => {
                                            const Icon = link.icon;
                                            return (
                                                <motion.div
                                                    key={link.path}
                                                    initial={{ opacity: 0, x: -12 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                >
                                                    <Link
                                                        to={link.path}
                                                        onClick={() => setMobileOpen(false)}
                                                        className={`
                                                            flex items-center gap-3 px-3 py-3 rounded-xl
                                                            text-sm font-medium transition-all duration-200
                                                            ${isActive(link.path)
                                                                ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md"
                                                                : "text-gray-700 hover:bg-gray-100"}
                                                        `}
                                                    >
                                                        <Icon className={`h-4.5 w-4.5 ${isActive(link.path) ? "text-white" : "text-gray-400"}`} />
                                                        <div className="flex-1">
                                                            <span className="block">{link.name}</span>
                                                            {!isActive(link.path) && (
                                                                <span className="text-xs text-gray-400">{link.description}</span>
                                                            )}
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Divider with gradient */}
                                    <div className="relative my-3">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs">
                                            <span className="px-2 bg-white text-gray-400">Resources</span>
                                        </div>
                                    </div>

                                    {/* Premium Info Links - Mobile Version */}
                                    <MobilePremiumInfoLinks navigate={navigate} onClose={() => setMobileOpen(false)} />

                                    {/* Divider with gradient */}
                                    <div className="relative my-3">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-xs">
                                            <span className="px-2 bg-white text-gray-400">Account</span>
                                        </div>
                                    </div>

                                    {/* Auth Section */}
                                    <div className="p-1">
                                        {isAuthenticated && user ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="space-y-1"
                                            >
                                                {/* User Card */}
                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100">
                                                    <Avatar className="h-10 w-10 ring-2 ring-gray-200">
                                                        <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-900 text-white text-xs font-bold">
                                                            {getInitials(user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                    </div>
                                                    <Crown className="h-4 w-4 text-amber-500" />
                                                </div>

                                                {/* User Actions */}
                                                {[
                                                    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
                                                    { label: "Settings", icon: Settings, path: "/profile" },
                                                    { label: "Security", icon: Shield, path: "/sessions" },
                                                ].map(({ label, icon: Icon, path }) => (
                                                    <Link
                                                        key={path}
                                                        to={path}
                                                        onClick={() => setMobileOpen(false)}
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                                                    >
                                                        <Icon className="h-4 w-4 text-gray-400" />
                                                        {label}
                                                    </Link>
                                                ))}

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Logout
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.18 }}
                                                className="space-y-2"
                                            >
                                                <Link to="/login" onClick={() => setMobileOpen(false)}>
                                                    <GhostButton className="w-full justify-center py-2.5">
                                                        Sign In
                                                    </GhostButton>
                                                </Link>
                                                <Link to="/register" onClick={() => setMobileOpen(false)}>
                                                    <PremiumButton className="w-full justify-center" variant="primary">
                                                        <Gift className="h-4 w-4" />
                                                        Get Started Free
                                                        <Star className="h-3.5 w-3.5" />
                                                    </PremiumButton>
                                                </Link>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
};

// Enhanced UserDropdown Component
const UserDropdown = memo(({ user, navigate, onLogout }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all duration-300 group"
            >
                <Avatar className="h-7 w-7 ring-2 ring-gray-200 group-hover:ring-gray-300 transition-all">
                    <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-900 text-white text-xs font-bold">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    {user.name?.split(" ")[0] || user.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </motion.button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-56 rounded-xl border border-gray-200/80 shadow-xl p-1.5"
        >
            <DropdownMenuLabel className="px-2.5 py-2">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 font-normal mt-0.5">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />

            {[
                { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
                { label: "Profile Settings", icon: Settings, path: "/profile" },
                { label: "Security", icon: Shield, path: "/sessions" },
            ].map(({ label, icon: Icon, path }) => (
                <DropdownMenuItem
                    key={path}
                    onClick={() => navigate(path)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
                >
                    <Icon className="h-4 w-4 text-gray-400" />
                    {label}
                </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
                onClick={onLogout}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50"
            >
                <LogOut className="h-4 w-4" />
                Logout
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
));

UserDropdown.displayName = 'UserDropdown';

// Import React for JSX
import React from 'react';

export default Navbar;