import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/authSlice";
import { Container, Table } from "reactstrap";

const CypherTable = () => {
  const user = useSelector(selectUser);

  if (user?.role !== "Admin") {
    return <h1>Forbidden 403</h1>;
  }

  return (
    <>
      <h1>Cypher Table</h1>
      <Container>
        <Table striped>
          <thead>
            <tr>
              <th>Plain Text</th>
              <th>Cypher Method</th>
              <th>Cypher Text</th>
            </tr>
          </thead>
          <tbody></tbody>
        </Table>
      </Container>
    </>
  );
};

export default CypherTable;
