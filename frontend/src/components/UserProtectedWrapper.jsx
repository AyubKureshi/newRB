import { Navigate } from "react-router-dom";

const UserProtectedWrapper = ({ children }) => {
  const user = localStorage.getItem("rb_user");
  const token = localStorage.getItem("rb_token");

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default UserProtectedWrapper;
