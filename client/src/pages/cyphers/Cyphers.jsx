import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllCyphers,
  selectCypherError,
  selectCypherStatus,
} from "../../redux/cypherSlice";
import { fetchCyphers } from "../../redux/cypherSlice";
import { Container, Table } from "reactstrap";

const CypherTable = () => {
  const dispatch = useDispatch();
  const cyphers = useSelector(selectAllCyphers);
  const status = useSelector(selectCypherStatus);
  const error = useSelector(selectCypherError);

  useEffect(() => {
    if (cyphers && cyphers.length === 0) {
      dispatch(fetchCyphers());
    }
  }, [cyphers, dispatch]);

  if (status === "loading") {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
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
          <tbody>
            {cyphers.map((cypher) => (
              <tr key={cypher._id}>
                <td>{cypher.plainText}</td>
                <td>{cypher.cypherMethod}</td>
                <td>{cypher.cypherText}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default CypherTable;
