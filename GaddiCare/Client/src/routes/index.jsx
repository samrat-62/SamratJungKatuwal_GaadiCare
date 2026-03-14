import App from "@/App";
import About from "@/pages/About";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminUsers from "@/pages/Admin/AdminUsers";
import AdminWorkshops from "@/pages/Admin/AdminWorkshops";
import DashboardAdmin from "@/pages/Admin/DashboardAdmin";
import WorkshopRequests from "@/pages/Admin/WorkshopRequest";
import ChatPage from "@/pages/ChatPage";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import SingleWorkshopPage from "@/pages/SingleWorkshopDetails";
import VerifyToken from "@/pages/verifyToken";
import Workshop from "@/pages/Workshop";
import DashboardWorkshop from "@/pages/Workshop/DashboardWorkshop";
import ServiceHistory from "@/pages/Workshop/ServiceHistory";
import ServiceRequests from "@/pages/Workshop/ServiceRequests";
import WorkshopChat from "@/pages/Workshop/WorkshopChat";
import WorkshopDashboard from "@/pages/Workshop/WorkshopDashboard";
import WorkshopDetails from "@/pages/Workshop/WorkshopDetails";
import { createBrowserRouter } from "react-router";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicOnlyRoute from "@/components/PublicOnlyRoute";
import VehicleOwnerOnlyRoute from "@/components/VehicleOwnerOnlyRoute";
import NotFoundPage from "@/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          { index: true, element: (
        <VehicleOwnerOnlyRoute>
          <Landing />
        </VehicleOwnerOnlyRoute>
      )},
          {
            path: "workshop",
            element: <ProtectedRoute allowedUserTypes={["vehicleOwner"]}><Workshop /></ProtectedRoute>
          },
          {
            path: "workshop/:id",
            element: <ProtectedRoute allowedUserTypes={["vehicleOwner"]}><SingleWorkshopPage /></ProtectedRoute>
          },
          { path: "about",element: (
        <VehicleOwnerOnlyRoute>
          <About />
        </VehicleOwnerOnlyRoute>
      ) },
          {
            path: "login",
            element: <PublicOnlyRoute><Login /></PublicOnlyRoute>
          },
          {
            path: "register",
            element: <PublicOnlyRoute><Register /></PublicOnlyRoute>
          },
          {
            path: "profile",
            element: <ProtectedRoute allowedUserTypes={["vehicleOwner"]}><Profile /></ProtectedRoute>
          },
          {
            path: "user-chat",
            element: <ProtectedRoute allowedUserTypes={["vehicleOwner"]}><ChatPage /></ProtectedRoute>
          }
        ]
      },
      {
        path: "workshopdashboard",
        element: <ProtectedRoute allowedUserTypes={["workshop"]}><WorkshopDashboard /></ProtectedRoute>,
        children: [
          { index: true, element: <DashboardWorkshop /> },
          { path: "bookingRequests", element: <ServiceRequests /> },
          { path: "bookingHistory", element: <ServiceHistory /> },
          { path: "workshopMessages", element: <WorkshopChat /> },
          { path: "workshopDetails", element: <WorkshopDetails /> }
        ]
      },
      {
        path: "admindashboard",
        element: <ProtectedRoute allowedUserTypes={["admin"]}><AdminDashboard /></ProtectedRoute>,
        children: [
          { index: true, element: <DashboardAdmin /> },
          { path: "workshopRequests", element: <WorkshopRequests /> },
          { path: "adminUsers", element: <AdminUsers /> },
          { path: "adminWorkshops", element: <AdminWorkshops /> }
        ]
      },
      {
        path: "verify-token/:type",
        element: <PublicOnlyRoute><VerifyToken /></PublicOnlyRoute>
      },
      {
        path: "reset-password",
        element: <PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>
      }
    ],
  },
  {
    path: "*",
    element: <NotFoundPage/>
  }
]);

export default router;