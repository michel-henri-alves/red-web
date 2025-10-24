import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Box as Package,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Sun,
  Moon,
  LogOut,
  Settings,
} from "lucide-react";


export default function Sidebar({ user = null, onLogout = () => { } }) {
  const location = useLocation();
  const { t } = useTranslation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("sidebar-collapsed") === "true";
    } catch {
      return false;
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try { localStorage.setItem("theme", theme); } catch { }
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem("sidebar-collapsed", collapsed ? "true" : "false"); } catch { }
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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
    <>
      <header className="lg:hidden flex items-center justify-between p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow">
        <button aria-label="Abrir menu" onClick={() => setMobileOpen(true)} className="p-2 rounded-md hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-white/30">
          <Menu className="w-6 h-6" />
        </button>
      </header>
      <AnimatePresence>
        <motion.aside
          initial={false}
          animate={collapsed ? { width: 72 } : { width: 256 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="hidden lg:flex lg:flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen shadow-2xl p-4"
        >
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">M4</div>
              {!collapsed && <div className="text-xl font-bold">M4 Dashboard</div>}
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setCollapsed(c => !c)} title={collapsed ? "Expandir" : "Recolher"} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <motion.span animate={{ rotate: collapsed ? 180 : 0 }}>
                  <X className="w-4 h-4" />
                </motion.span>
              </button>
              <button onClick={() => setTheme(s => s === "dark" ? "light" : "dark")} aria-label="Toggle theme" className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-indigo-400">
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <nav className="mt-6 flex-1">
            <motion.ul initial="hidden" animate="visible" variants={listVariants} className="space-y-1">
              {visibleNav.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.li key={item.path} variants={itemVariants}>
                    <Link to={item.path} className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${isActive ? "bg-indigo-600 text-white" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span className="font-medium">{item.name}</span>}
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>

          <div className="mt-auto px-2 py-4 border-t border-slate-200/70 dark:border-slate-800/60">
            <div className="flex items-center justify-between gap-2">
              {!collapsed && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white">{
                    (user && user.initials) ? user.initials : "JS"
                  }</div>
                  <div>
                    <div className="text-sm font-semibold">{(user && user.name) ? user.name : "Usuário"}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{(user && user.roleLabel) ? user.roleLabel : "Perfil"}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button title="Configurações" className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  <Settings className="w-5 h-5" />
                </button>
                <button onClick={() => onLogout()} title="Sair" className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      <Dialog open={mobileOpen} onClose={() => setMobileOpen(false)} className="lg:hidden">
        <div className="fixed inset-0 z-40 flex">
          <AnimatePresence>
            {mobileOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40" />
            )}
          </AnimatePresence>

          <Dialog.Panel className="relative z-50 w-3/4 max-w-xs bg-white dark:bg-slate-900 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">M4</div>
                <div className="text-lg font-semibold">M4</div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setTheme(s => s === "dark" ? "light" : "dark")} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button onClick={() => setMobileOpen(false)} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <nav className="mt-6">
              <ul className="space-y-2">
                {visibleNav.map(item => (
                  <li key={item.path}>
                    <Link to={item.path} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-150 ${location.pathname === item.path ? "bg-indigo-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-6 pt-4 border-t border-slate-200/70 dark:border-slate-800/60">
              <button className="w-full flex items-center justify-center gap-2 p-3 rounded bg-indigo-600 text-white hover:opacity-95 transition" onClick={() => {/* perfil action */ }}>
                <Users className="w-5 h-5" />
                <span>Perfil</span>
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}