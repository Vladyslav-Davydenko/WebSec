import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllCyphers,
  selectCypherStatus,
  deleteCypher,
} from "../../redux/cypherSlice";
import useAuth from "../../hooks/useAuth";
import { fetchCyphers } from "../../redux/cypherSlice";
import { Container, Table, Button } from "reactstrap";

const CypherTable = () => {
  const dispatch = useDispatch();
  const cyphers = useSelector(selectAllCyphers);
  const { isAdmin } = useAuth();
  const status = useSelector(selectCypherStatus);

  useEffect(() => {
    if (cyphers && cyphers.length === 0) {
      dispatch(fetchCyphers());
    }
  }, [cyphers, dispatch]);

  const handleDeleteButton = async (id) => {
    try {
      await dispatch(deleteCypher(id)).unwrap();
    } catch (error) {
      return <h1>{error}</h1>;
    }
  };

  if (status === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <h1>Cypher Table</h1>
      <Container>
        <Button color="primary" disabled={status === "loading"}>
          Add New
        </Button>
        <Table striped>
          <thead>
            <tr>
              <th>Cypher Text</th>

              <th>Cypher Method</th>
              {isAdmin && (
                <>
                  <th>Plain Text</th>
                  <th></th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {cyphers.map((cypher) => (
              <tr key={cypher._id}>
                <td>{cypher.cypherText}</td>
                <td>{cypher.cypherMethod}</td>
                {isAdmin && (
                  <>
                    <td>{cypher.plainText}</td>
                    <td>
                      <Button
                        color="primary"
                        onClick={() => handleDeleteButton(cypher._id)}
                        disabled={status === "loading"}
                      >
                        Delete
                      </Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default CypherTable;
