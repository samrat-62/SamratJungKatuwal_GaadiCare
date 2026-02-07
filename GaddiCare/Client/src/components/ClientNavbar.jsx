import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Menu, X, LogOut, User } from "lucide-react";
import { useWindowScroll } from "react-use";
import { useSelector, useDispatch } from "react-redux";
import { fetchAuthUser, logoutUser } from "@/store/slice/userSlice";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";


const ClientNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { y: scrollY } = useWindowScroll();
  const { data } = useSelector(state => state.userData);

  const navItems = [
    { name: "Home", path: "/", show: true },
    { name: "Workshops", path: "/workshop", show: data },
    { name: "About Us", path: "/about", show: true },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    setScrolled(scrollY > 20);
  }, [scrollY]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    await dispatch(fetchAuthUser());
    navigate("/login");
  };

  const getInitial = () => {
    if (!data?.userName) return "U";
    return data.userName.charAt(0).toUpperCase();
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 w-full px-4 md:px-8 lg:px-16 py-4 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg backdrop-blur-sm bg-white/95" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavClick("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 shadow-md">
            <img 
              src="/image/logo.png" 
              alt="GaddiCare Logo"
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-white font-bold text-lg">GC</span>';
              }}
            />
          </div>
          <h1 className={`text-2xl font-bold tracking-tight ${scrolled ? "text-gray-800" : "text-white"}`}>
            GaddiCare
          </h1>
        </motion.div>
        <div className="hidden md:flex items-center gap-10">
          {navItems.filter(item => item.show).map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <button
                onClick={() => handleNavClick(item.path)}
                className={`font-semibold text-lg px-1 ${scrolled ? "text-gray-700" : "text-orange-600"} ${
                  isActive(item.path) ? (scrolled ? "text-blue-600" : "text-blue-300") : ""
                } hover:opacity-80 transition-colors duration-200`}
              >
                {item.name}
              </button>
              <motion.div
                className={`absolute -bottom-1 left-0 h-[3px] rounded-full ${
                  scrolled ? "bg-blue-600" : "bg-orange-600"
                }`}
                initial={{ width: 0 }}
                animate={{ width: isActive(item.path) ? "100%" : 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </motion.div>
          ))}
          <div className="flex items-center gap-4 ml-6">
            {data ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer"
                  >
                    <Avatar className="border-2 border-blue-500">
                      <AvatarImage src={`${import.meta.env.VITE_SERVER_URL}/${data.userImage}`} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-lg">
                        {getInitial()}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 mt-2 mr-4 p-2" align="end">
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50 rounded-lg"
                  >
                    <User size={18} className="text-blue-600" />
                    <span className="font-medium">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-red-50 text-red-600 rounded-lg"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 border-2 ${
                    scrolled 
                      ? "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" 
                      : "border-white text-orange-600 hover:bg-white hover:text-blue-600"
                  }`}
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/register")}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                    scrolled 
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" 
                      : "bg-white text-blue-600 hover:bg-gray-100 shadow-lg"
                  }`}
                >
                  Register
                </motion.button>
              </>
            )}
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            scrolled ? "text-gray-700 hover:bg-gray-100" : "text-orange-600 hover:bg-white/20"
          }`}
        >
          {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
        </motion.button>
      </div>
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`md:hidden mt-4 rounded-xl p-6 ${
            scrolled ? "bg-white shadow-2xl" : "bg-black/90 backdrop-blur-sm"
          }`}
        >
          <div className="space-y-2 mb-8">
            {navItems.filter(item => item.show).map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <button
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full text-left px-4 py-4 rounded-xl font-semibold text-lg transition-all ${
                    isActive(item.path)
                      ? scrolled
                        ? "bg-blue-50 text-blue-600 border-2 border-blue-100"
                        : "bg-white/20 text-white border-2 border-white/30"
                      : scrolled
                        ? "text-gray-700 hover:bg-gray-100 hover:border-2 hover:border-gray-200"
                        : "text-white hover:bg-white/10 hover:border-2 hover:border-white/20"
                  }`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500"
                    />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {data ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/10">
                  <Avatar className="border-2 border-blue-500">
                    <AvatarImage src={`${import.meta.env.VITE_SERVER_URL}/${data.userImage}`} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold">
                      {getInitial()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white">{user.username}</p>
                    <p className="text-sm text-white/80">{user.email}</p>
                  </div>
                </div>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => navigate("/profile")}
                  className={`w-full py-3.5 rounded-xl font-semibold text-lg transition-all border-2 ${
                    scrolled 
                      ? "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" 
                      : "border-white text-white hover:bg-white hover:text-blue-600"
                  }`}
                >
                  Profile
                </motion.button>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  onClick={handleLogout}
                  className={`w-full py-3.5 rounded-xl font-semibold text-lg transition-all ${
                    scrolled 
                      ? "bg-red-600 text-white hover:bg-red-700" 
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => navigate("/login")}
                  className={`w-full py-3.5 rounded-xl font-semibold text-lg transition-all border-2 ${
                    scrolled 
                      ? "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" 
                      : "border-white text-white hover:bg-white hover:text-blue-600"
                  }`}
                >
                  Login
                </motion.button>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  onClick={() => navigate("/register")}
                  className={`w-full py-3.5 rounded-xl font-semibold text-lg transition-all ${
                    scrolled 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-white text-blue-600 hover:bg-gray-100"
                  }`}
                >
                  Register
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default ClientNavbar;