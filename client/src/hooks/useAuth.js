import { useSelector } from "react-redux";
import { selectAccessToken } from "../redux/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectAccessToken);
  let isAdmin = false;

  if (token) {
    const decoded = jwtDecode(token);
    const { username, role } = decoded.UserInfo;

    isAdmin = role === "Admin";

    return { username, role, isAdmin };
  }

  return { username: "", role: "User" };
};

export default useAuth;
