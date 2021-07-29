import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { AuthContext } from '../contexts/auth';

const Logout = () => {
  const history = useHistory();
  const { logout } = useContext(AuthContext)

  useEffect(() => {
    logout()

    history.replace('/')
  }, [])

  return (
    <div className="container">
      <p>
        Logging out...
      </p>
    </div>
  );
};

export default Logout;
