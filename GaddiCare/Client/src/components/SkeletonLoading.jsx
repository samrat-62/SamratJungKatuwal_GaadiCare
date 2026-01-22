import { motion } from "framer-motion";

const NavbarSkeleton = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.img
        src="/image/logo.png"
        alt="Logo"
        className="w-16 h-16"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
      />
    </div>
  );
};

export default NavbarSkeleton;