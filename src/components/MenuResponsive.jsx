import { useState,  useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Home,
    Box as Package,
    LayoutDashboard,
    ShoppingCart,
    Users,
} from "lucide-react";

import m4 from '../assets/images/m4.png';
import control from '../assets/images/control.png';




export default function MenuResponsive({ user = null, onLogout = () => { } }) {
    const { t } = useTranslation();
    const location = useLocation();

    const [open, setOpen] = useState(true);
    // const [mobileOpen, setMobileOpen] = useState(false);
    // const [collapsed, setCollapsed] = useState(() => {
    //     try {MenuResponsive
    //         return localStorage.getItem("sidebar-collapsed") === "true";
    //     } catch {
    //         return false;
    //     }
    // });

    // useEffect(() => {
    //     try { localStorage.setItem("sidebar-collapsed", collapsed ? "true" : "false"); } catch { }
    // }, [collapsed]);

    // useEffect(() => {
    //     setMobileOpen(false);
    // }, [location.pathname]);

    const navItems = useMemo(() => ([
        { name: t("sidebar.home"), icon: Home, path: "/", roles: undefined },
        { name: t("sidebar.products"), icon: Package, path: "/products", roles: ["admin", "seller"] },
        { name: t("sidebar.sectors"), icon: LayoutDashboard, path: "/sectors", roles: ["admin"] },
        { name: t("sidebar.sales"), icon: ShoppingCart, path: "/sales", roles: ["admin", "seller", "cashier"] },
        { name: t("sidebar.customers"), icon: Users, path: "/customers", roles: ["admin", "seller"] },
    ]), []);

    const visibleNav = useMemo(() => {
        if (!user || !user.roles) return navItems;
        return navItems.filter(item => !item.roles || item.roles.some(r => user.roles.includes(r)));
    }, [navItems, user]);

    const listVariants = {
        visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
        hidden: {},
    };
    const itemVariants = {
        hidden: { opacity: 0, x: -8 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <div className="flex">
            <div className={`${open ? "w-72" : "w-20"} bg-dark-purple h-screen p-5 pt-8 relative duration-300`}>
                <img
                    src={control} alt="control"
                    className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple border-2 rounded-full ${!open && "rotate-180"}`}
                    onClick={() => setOpen(!open)}
                />

                <div className="flex gap-x-4 items-center">
                    <img
                        src={m4} alt="M4"
                        className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"}`}
                    />
                    {/* <h1 className={`text-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`}>
                        Designer
                    </h1> */}
                </div>

                <nav className="mt-6 flex-1">
                    <motion.ul initial="hidden" animate="visible" variants={listVariants} className="space-y-1">
                        {visibleNav.map(item => {
                            const isActive = location.pathname === item.path;
                            return (
                                <motion.li key={item.path} variants={itemVariants}>
                                    <Link to={item.path} className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${isActive ? "bg-indigo-600 text-white" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                                        <item.icon className="w-5 h-5" />
                                        {open && <span className="font-medium">{item.name}</span>}
                                    </Link>
                                </motion.li>
                            );
                        })}
                    </motion.ul>
                </nav>
            </div>
        </div>
    );
} 