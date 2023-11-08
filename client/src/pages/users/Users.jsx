import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllUsers,
  selectUserError,
  selectUserStatus,
} from "../../redux/userSlice";
import useAuth from "../../hooks/useAuth";
import { fetchUsers } from "../../redux/userSlice";
import { Container, Table } from "reactstrap";

const UserTable = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const status = useSelector(selectUserStatus);
  const { isAdmin } = useAuth();
  const error = useSelector(selectUserError);

  useEffect(() => {
    if (users && users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [users, dispatch]);

  if (status === "loading") {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <>
      <h1>User Table</h1>
      <Container>
        <Table striped>
          <thead>
            <tr>
              <th>Username</th>
              {isAdmin && <th>Roles</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                {isAdmin && <td>{user.role}</td>}
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default UserTable;
