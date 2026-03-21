import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children, allowedUserTypes = [] }) => {
  const { data, loading } = useSelector(state => state.userData);

  if (loading) return null; 

  if (!data) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedUserTypes.length > 0 &&
    !allowedUserTypes.includes(data.userType)
  ) {
    if (data.userType === "workshop") {
      return <Navigate to="/workshopdashboard" replace />;
    }
    if (data.userType === "admin") {
      return <Navigate to="/admindashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
