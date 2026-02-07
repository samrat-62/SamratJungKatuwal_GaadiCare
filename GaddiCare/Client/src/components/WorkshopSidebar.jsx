import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/store/slice/userSlice";
import {
    Building,
    Clock,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    Wrench,
    X
} from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";

const WorkshopSidebar = ({serviceRequestsCount, messagesCount}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/workshopdashboard",
      badge: null
    },
    {
      name: "Booking Requests",
      icon: <Wrench className="h-5 w-5" />,
      path: "/workshopdashboard/bookingRequests",
      badge: serviceRequestsCount,
      badgeColor: "bg-orange-500"
    },
    {
      name: "Booking History",
      icon: <Clock className="h-5 w-5" />,
      path: "/workshopdashboard/bookingHistory",
      badge: null
    },
    {
      name: "Messages",
      icon: <MessageSquare className="h-5 w-5" />,
      path: "/workshopdashboard/workshopMessages",
      badge: messagesCount,
      badgeColor: "bg-blue-500"
    },
    {
      name: "Workshop Details",
      icon: <Building className="h-5 w-5" />,
      path: "/workshopdashboard/workshopDetails",
      badge: null
    }
  ];

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <aside className={`bg-gray-900 text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} min-h-screen fixed left-0 top-0 z-40`}>
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Wrench className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold">Workshop Panel</h1>
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
          className="text-gray-400 hover:text-orange-400 hover:bg-gray-800"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-orange-400'
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

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className={`w-full text-gray-300 hover:text-orange-400 hover:bg-gray-800 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default WorkshopSidebar;
