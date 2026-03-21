import { Navigate } from "react-router";
import { useSelector } from "react-redux";

const VehicleOwnerOnlyRoute = ({ children }) => {
  const { data, loading } = useSelector(state => state.userData);

  if (loading) return null;

  if (!data) return children;

  if (data.userType !== "vehicleOwner") {
    if (data.userType === "admin") {
      return <Navigate to="/admindashboard" replace />;
    }
    if (data.userType === "workshop") {
      return <Navigate to="/workshopdashboard" replace />;
    }
  }

  return children;
};

export default VehicleOwnerOnlyRoute;