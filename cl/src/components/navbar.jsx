import React, { useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import { AuthContext } from '../contexts/auth';

const NavBar = () => {
  const { loggedUser } = useContext(AuthContext);


  const history = useHistory();

  useEffect(() => {
    if (!loggedUser) {
      history.replace('/logout')
    }
  }, [loggedUser?.id])

  return (
    <div className="container">
      <nav className=" navbar navbar-expand-lg navbar-dark bg-dark justify-content-sm-end">
        <ul className="d-flex align-items-center flex-row ">
          <li className="nav-item">
            {loggedUser ? (
              <Link className="nav-link" to={`/addTransaccions/${loggedUser.id}`}>
                {loggedUser.email}
              </Link>
            ) : null}
          </li>
        </ul>
        <ul>

          {loggedUser ? (
            <li className="nav-item">
              <Link className="nav-link" exact to="/logout">LogOut</Link>
            </li>
          ) :
            (

              <li className="nav-item">
                <Link className="nav-link" exact to="/">Register</Link>
              </li>


            )}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
