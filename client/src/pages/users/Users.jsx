import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllUsers } from "../../redux/userSlice";
import { fetchUsers } from "../../redux/userSlice";
import { Container, Table } from "reactstrap";

const UserTable = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);

  useEffect(() => {
    if (users && users.length === 0) {
      dispatch(fetchUsers());
    }
  }, [users, dispatch]);

  return (
    <>
      <h1>User Table</h1>
      <Container>
        <Table striped>
          <thead>
            <tr>
              <th>Username</th>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default UserTable;
