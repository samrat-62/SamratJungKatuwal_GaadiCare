import { motion } from "framer-motion";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  MapPin, 
  Phone, 
  Mail,
  ChevronRight
} from "lucide-react";

const ClientFooter = () => {
  const quickLinks = [
    { name: "Find Workshops", path: "/workshop" },
    { name: "About Us", path: "/about" },

  ];

  const helpCenter = [
    { name: "Help Center", path: "/help" },
    { name: "Contact Us", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
  ];

  const socialLinks = [
    { icon: <Facebook size={18} />, path: "https://facebook.com" },
    { icon: <Twitter size={18} />, path: "https://twitter.com" },
    { icon: <Instagram size={18} />, path: "https://instagram.com" },
    { icon: <Linkedin size={18} />, path: "https://linkedin.com" },
  ];

  const contactInfo = [
    { icon: <MapPin size={18} />, text: "123 Vehicle Street, Auto City" },
    { icon: <Phone size={18} />, text: "+1 (555) 123-4567" },
    { icon: <Mail size={18} />, text: "support@gaddicare.com" },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center overflow-hidden">
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
              <h2 className="text-2xl font-bold">GaddiCare</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your trusted partner for complete vehicle care. Find verified workshops, track services, and manage your vehicle maintenance all in one place.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors duration-200"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-700">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={link.path}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ChevronRight size={14} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-700">Help Center</h3>
            <ul className="space-y-4">
              {helpCenter.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={link.path}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ChevronRight size={14} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-700">Contact Info</h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 text-gray-300"
                >
                  <span className="text-blue-400 mt-0.5">{info.icon}</span>
                  <span>{info.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t border-gray-800 text-center"
        >
          <p className="text-gray-400">
            © 2025 GaddiCare. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default ClientFooter;