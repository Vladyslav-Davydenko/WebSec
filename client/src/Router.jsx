import { Layout } from "./layouts/Layout";
import { Home } from "./pages/home/Home";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "./redux/authSlice";
import LoginPage from "./pages/login/LoginPage";
import UserTable from "./pages/users/Users";
import CypherTable from "./pages/cyphers/Cyphers";

import { Route, Routes } from "react-router-dom";

export const Router = () => {
  const user = useSelector(selectIsAuthenticated);
  console.log(user);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="users" element={<UserTable />} />
        <Route path="cyphers" element={<CypherTable />} />
      </Route>
    </Routes>
  );
};
