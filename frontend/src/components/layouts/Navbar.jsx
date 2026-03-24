// components/layout/Navbar.jsx
import { useState, useEffect, useRef } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu, X, LogOut, User, Settings, Shield,
    ChevronDown, GraduationCap, LayoutDashboard,
    BookOpen, Info, Sparkles
} from "lucide-react";

/* ─── nav links config ──────────────────────────────────────── */
const navLinks = [
    { name: "How it Works", path: "/how-it-works", icon: BookOpen },
    { name: "Find Colleges", path: "/colleges", icon: Sparkles },
    { name: "About", path: "/about", icon: Info },
];

/* ─── helpers ───────────────────────────────────────────────── */
const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

/* ─── premium CTA button ─────────────────────────────────────── */
const PremiumButton = ({ children, onClick, href, className = "", size = "default" }) => {
    const inner = (
        <button
            onClick={onClick}
            className={`
                relative group overflow-hidden inline-flex items-center justify-center gap-2
                bg-gray-950 text-white font-semibold tracking-wide
                rounded-xl border border-white/10
                transition-all duration-300
                hover:shadow-[0_0_28px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.1)]
                active:scale-[0.97]
                cursor-pointer
                ${size === "sm" ? "px-4 py-2 text-sm" : "px-5 py-2.5 text-sm"}
                ${className}
            `}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            {/* shimmer sweep */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none" />
            {/* top highlight */}
            <span className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
            {children}
        </button>
    );
    return href ? <Link to={href}>{inner}</Link> : inner;
};

/* ─── ghost nav button ───────────────────────────────────────── */
const GhostButton = ({ children, href, onClick }) => (
    href
        ? <Link to={href}>
            <button
                className="relative inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200 cursor-pointer"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
                {children}
            </button>
        </Link>
        : <button
            onClick={onClick}
            className="relative inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            {children}
        </button>
);

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════ */
const Navbar = () => {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // close mobile menu on route change
    useEffect(() => { setMobileOpen(false); }, [location.pathname]);

    // close on outside click
    useEffect(() => {
        if (!mobileOpen) return;
        const handler = (e) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target))
                setMobileOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [mobileOpen]);

    const handleLogout = async () => {
        await logout();
        navigate("/");
        setMobileOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    /* ── loading skeleton ── */
    if (loading) {
        return (
            <nav className="sticky top-0 z-50 bg-white/95 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                    <Logo />
                </div>
            </nav>
        );
    }

    return (
        <>
            {/* Google font */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');`}</style>

            <nav
                className={`
                    sticky top-0 z-50 transition-all duration-300
                    ${scrolled
                        ? "bg-white/90 backdrop-blur-xl border-b border-gray-200/70 shadow-[0_1px_24px_rgba(0,0,0,0.06)]"
                        : "bg-white border-b border-gray-100"}
                `}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                ref={mobileMenuRef}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* ── Logo ── */}
                        <Logo />

                        {/* ── Desktop nav links ── */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link key={link.path} to={link.path}>
                                    <span className={`
                                        relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                                        ${isActive(link.path)
                                            ? "text-gray-900 bg-gray-100"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}
                                    `}>
                                        {isActive(link.path) && (
                                            <motion.span
                                                layoutId="nav-pill"
                                                className="absolute inset-0 bg-gray-100 rounded-lg -z-10"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                        {link.name}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {/* ── Desktop auth ── */}
                        <div className="hidden md:flex items-center gap-2">
                            {isAuthenticated && user ? (
                                <UserDropdown user={user} navigate={navigate} onLogout={handleLogout} />
                            ) : (
                                <>
                                    <GhostButton href="/login">Sign In</GhostButton>
                                    <PremiumButton href="/register">
                                        Get Started
                                        <span className="opacity-70 text-xs">→</span>
                                    </PremiumButton>
                                </>
                            )}
                        </div>

                        {/* ── Mobile hamburger ── */}
                        <button
                            onClick={() => setMobileOpen((v) => !v)}
                            aria-label="Toggle menu"
                            className="md:hidden relative z-10 w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {mobileOpen
                                    ? <motion.span key="x"
                                        initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                                        <X className="h-5 w-5" />
                                    </motion.span>
                                    : <motion.span key="m"
                                        initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                                        <Menu className="h-5 w-5" />
                                    </motion.span>
                                }
                            </AnimatePresence>
                        </button>
                    </div>
                </div>

                {/* ── Mobile drawer (overlaps page, fixed position) ── */}
                <AnimatePresence>
                    {mobileOpen && (
                        <>
                            {/* backdrop */}
                            <motion.div
                                key="backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                                onClick={() => setMobileOpen(false)}
                            />

                            {/* panel */}
                            <motion.div
                                key="panel"
                                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                className="absolute top-full left-0 right-0 z-50 md:hidden mx-3 mb-3 rounded-2xl border border-gray-200/80 bg-white/98 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] overflow-hidden"
                            >
                                {/* nav links */}
                                <div className="p-3 space-y-0.5">
                                    {navLinks.map((link, i) => {
                                        const Icon = link.icon;
                                        return (
                                            <motion.div
                                                key={link.path}
                                                initial={{ opacity: 0, x: -12 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 + 0.05 }}
                                            >
                                                <Link
                                                    to={link.path}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={`
                                                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                                                        ${isActive(link.path)
                                                            ? "bg-gray-950 text-white"
                                                            : "text-gray-700 hover:bg-gray-100"}
                                                    `}
                                                >
                                                    <Icon className={`h-4 w-4 ${isActive(link.path) ? "text-white" : "text-gray-400"}`} />
                                                    {link.name}
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* divider */}
                                <div className="h-px bg-gray-100 mx-3" />

                                {/* auth section */}
                                <div className="p-3">
                                    {isAuthenticated && user ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="space-y-0.5"
                                        >
                                            {/* user card */}
                                            <div className="flex items-center gap-3 px-3 py-3 mb-1 rounded-xl bg-gray-50 border border-gray-100">
                                                <Avatar className="h-9 w-9 ring-2 ring-gray-900/10">
                                                    <AvatarFallback className="bg-gray-900 text-white text-xs font-bold">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                </div>
                                            </div>

                                            {[
                                                { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
                                                { label: "Profile Settings", icon: Settings, path: "/profile" },
                                                { label: "Active Sessions", icon: Shield, path: "/sessions" },
                                            ].map(({ label, icon: Icon, path }, i) => (
                                                <Link
                                                    key={path}
                                                    to={path}
                                                    onClick={() => setMobileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Icon className="h-4 w-4 text-gray-400" />
                                                    {label}
                                                </Link>
                                            ))}

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
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
                                            className="flex flex-col gap-2"
                                        >
                                            <Link to="/login" onClick={() => setMobileOpen(false)}>
                                                <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
                                                    Sign In
                                                </button>
                                            </Link>
                                            <Link to="/register" onClick={() => setMobileOpen(false)}>
                                                <PremiumButton className="w-full justify-center py-2.5 rounded-xl">
                                                    Get Started →
                                                </PremiumButton>
                                            </Link>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
};

/* ─── Logo ──────────────────────────────────────────────────── */
const Logo = () => (
    <Link to="/" className="flex items-center gap-2.5 group select-none">
        <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gray-950 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.25)] group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-shadow duration-300">
                <GraduationCap className="h-4.5 w-4.5 text-white" strokeWidth={2} />
            </div>
            {/* corner sparkle */}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 border-2 border-white shadow-sm" />
        </div>
        <span
            className="text-[1.1rem] font-bold text-gray-950 tracking-[-0.02em] group-hover:text-gray-700 transition-colors"
            style={{ fontFamily: "'DM Serif Display', serif" }}
        >
            CollegeFinder
        </span>
    </Link>
);

/* ─── User dropdown ─────────────────────────────────────────── */
const UserDropdown = ({ user, navigate, onLogout }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors group">
                <Avatar className="h-7 w-7 ring-2 ring-gray-900/10">
                    <AvatarFallback className="bg-gray-900 text-white text-xs font-bold">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {user.name?.split(" ")[0] || user.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-56 rounded-xl border border-gray-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.1)] p-1.5"
        >
            <DropdownMenuLabel className="px-2.5 py-2">
                <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>{user.name}</p>
                <p className="text-xs text-gray-400 font-normal mt-0.5">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />

            {[
                { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
                { label: "Profile Settings", icon: Settings, path: "/profile" },
                { label: "Active Sessions", icon: Shield, path: "/sessions" },
            ].map(({ label, icon: Icon, path }) => (
                <DropdownMenuItem
                    key={path}
                    onClick={() => navigate(path)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    <Icon className="h-4 w-4 text-gray-400" />
                    {label}
                </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
                onClick={onLogout}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
                <LogOut className="h-4 w-4" />
                Logout
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

export default Navbar;