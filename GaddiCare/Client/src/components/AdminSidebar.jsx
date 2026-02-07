import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { 
  LayoutDashboard, 
  Wrench, 
  User, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/slice/userSlice";

const AdminSidebar = ({count}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/admindashboard",
      badge: null
    },
    {
      name: "Workshop Requests",
      icon: <Wrench className="h-5 w-5" />,
      path: "/admindashboard/workshopRequests",
      badge: count,
      badgeColor: "bg-orange-500"
    },
    {
      name: "All Workshops",
      icon: <Wrench className="h-5 w-5" />,
      path: "/admindashboard/adminWorkshops",
      badge: null
    },
    {
      name: "Users",
      icon: <User className="h-5 w-5" />,
      path: "/admindashboard/adminUsers",
      badge: null
    }
  ];

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <aside className={`bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} min-h-screen fixed left-0 top-0 z-40`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Wrench className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
        )}
        {isCollapsed && (
          <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center mx-auto">
            <Wrench className="h-5 w-5" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <Badge className={`${item.badgeColor} text-white text-xs`}>
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className={`w-full text-gray-300 hover:text-white hover:bg-gray-800 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;