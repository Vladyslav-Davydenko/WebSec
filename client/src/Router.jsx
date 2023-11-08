import { Layout } from "./layouts/Layout";
import { Home } from "./pages/home/Home";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import UserTable from "./pages/users/Users";
import CypherTable from "./pages/cyphers/Cyphers";

import { Route, Routes } from "react-router-dom";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="users" element={<UserTable />} />
        <Route path="cyphers" element={<CypherTable />} />
      </Route>
    </Routes>
  );
};
