import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  useEffect(() => {
    !user && navigate("/login", { replace: true });
  }, []);
  return (
    <>
      <div className="jumbotron">
        <h1>Welcome {user ? user.name : null}</h1>
        <hr className="my-4" />
        <div className="d-flex justify-content-evenly">
          <Link to="/create" className="btn btn-info" role="button">
            Create Contact
          </Link>
          <Link to="/mycontacts" className="btn btn-info" role="button">
            View Contacts
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
