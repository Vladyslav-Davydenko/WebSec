import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearUser, clearAccessToken } from "../redux/authSlice";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import { selectIsAuthenticated } from "../redux/authSlice";
import { Link } from "react-router-dom";

export default function Header() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogOut = () => {
    dispatch(clearUser());
    dispatch(clearAccessToken());
  };
  return (
    <Navbar color="light" light expand="md">
      <NavbarBrand tag={Link} to="/">
        Web Sec
      </NavbarBrand>
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink tag={Link} to="/">
            Main
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/cyphers">
            Cyphers
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/users">
            Users
          </NavLink>
        </NavItem>
        {isAuthenticated ? (
          <NavItem>
            <NavLink tag={Link} to="/login" onClick={handleLogOut}>
              Logout
            </NavLink>
          </NavItem>
        ) : (
          <>
            <NavItem>
              <NavLink tag={Link} to="/login">
                Login
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/register">
                Register
              </NavLink>
            </NavItem>
          </>
        )}
      </Nav>
    </Navbar>
  );
}
