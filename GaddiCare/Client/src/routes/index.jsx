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
          {path:"workshopdashboard", element:<WorkshopDashboard />},
          {path:"admindashboard", element:<AdminDashboard />},
          {path:"verify-token/:type",element:<VerifyToken />},
          {path:"reset-password", element:<ResetPassword/>}
    ],
  },
]);

export default router;
