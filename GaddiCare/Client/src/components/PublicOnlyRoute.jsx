import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const PublicOnlyRoute = ({ children }) => {
  const { data, loading } = useSelector(state => state.userData);

  if (loading) return null;

  if (data) {
    switch (data.userType) {
      case "admin":
        return <Navigate to="/admindashboard" replace />;
      case "workshop":
        return <Navigate to="/workshopdashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PublicOnlyRoute;
