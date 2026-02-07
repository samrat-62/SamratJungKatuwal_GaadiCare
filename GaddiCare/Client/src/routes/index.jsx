import { createBrowserRouter } from "react-router";
import App from "@/App";
import Home from "@/pages/Home";
import WorkshopDashboard from "@/pages/Workshop/WorkshopDashboard";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import Landing from "@/pages/Landing";
import Workshop from "@/pages/Workshop";
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import VerifyToken from "@/pages/verifyToken";
import Profile from "@/pages/Profile";
import ResetPassword from "@/pages/ResetPassword";
import DashboardAdmin from "@/pages/Admin/DashboardAdmin";
import WorkshopRequests from "@/pages/Admin/WorkshopRequest";
import AdminUsers from "@/pages/Admin/AdminUsers";
import AdminWorkshops from "@/pages/Admin/AdminWorkshops";
import SingleWorkshopPage from "@/pages/SingleWorkshopDetails";
import DashboardWorkshop from "@/pages/Workshop/DashboardWorkshop";
import ServiceRequests from "@/pages/Workshop/ServiceRequests";
import ServiceHistory from "@/pages/Workshop/ServiceHistory";
import WorkshopMessage from "@/pages/Workshop/WorkshopMessage";
import WorkshopDetails from "@/pages/Workshop/WorkshopDetails";

const router=createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      { path: "/", element: <Home/>,
        children:[
            {
                index:true,
                element:<Landing/>
            },
            {
                path:"workshop",
                element:<Workshop/>
            },
            {
                path:"workshop/:id",
                element:<SingleWorkshopPage/>
            },
            {
                path:"about",
                element:<About/>
            },
            {path:"login", element:<Login />},
             {path:"register", element:<Register />},
             {
              path:"profile",
              element:<Profile/>
             }
            ]
          },
          {path:"workshopdashboard", element:<WorkshopDashboard />,
            children:[
              {
                index:true,
                element:<DashboardWorkshop/>

              },
              {
                path:"bookingRequests",
                element:<ServiceRequests/>
              },
              {
                path:"bookingHistory",
                element:<ServiceHistory/>
              },
              {
                path:"workshopMessages",
                element:<WorkshopMessage/>
              },
              {
                path:"workshopDetails",
                element:<WorkshopDetails/>
              }
            ]
          },

          {path:"admindashboard", 
            element:<AdminDashboard />,
          children:[
            {
              index:true,
              element:<DashboardAdmin/>
            },
            {
              path:"workshopRequests",
              element:<WorkshopRequests/>
            },
            {
              path:"adminUsers",
              element:<AdminUsers/>
            },
            {
                 path:"adminWorkshops",
                 element:<AdminWorkshops/>
            }
          ]},
          {path:"verify-token/:type",element:<VerifyToken />},
          {path:"reset-password", element:<ResetPassword/>}
    ],
  },
]);

export default router;
