import React, { useContext, useState } from "react";
import Axios from 'axios'
import { useHistory } from "react-router-dom";
// import bcryptjs from 'bcryptjs'

import { AuthContext } from '../contexts/auth';

const LoginForm = () => {
  const { login } = useContext(AuthContext)

  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isAValidCase = () => {
    if (!email.trim() && !password.trim()) setError('Params cant be null');
    if (!password.trim()) setError('Password cant be null');
    else return email !== '' && password !== '';
  }

  const registUser = (e) => {
    e.preventDefault();

    const validCase = isAValidCase();

    if (validCase) {

      const user = {
        email: email,
        pass: password
      }

      try {
        Axios.post("http://localhost:3001/user/addUser", user).then((resp => {
          if (resp.data.trim) setError(resp.data);
        }))
      } catch (e) { console.log(e); }

      setEmail('');
      setPassword('');
    }
  }

  const logUser = (e) => {
    e.preventDefault();

    const logUser = {
      email: email,
      pass: password
    }

    try {
      Axios.post("http://localhost:3001/user/logUser", logUser).then((resp => {
        if (resp.data.trim) setError(resp.data);
        else {
          const id = resp.data.userId;
          const email = resp.data.userEmail;
          console.log(resp.data.tkn);
          const user = {
            id: id,
            email: email
          }

          login(user);

          history.push(`/addTransaccions/${id}`);
        }
      }))
    } catch (e) { console.log(e); }

  }


  return (
    <div className="container">

      <h1 className="d-flex justify-content-center">Login Form</h1>
      <div className="d-flex justify-content-center">
        <form onSubmit={registUser} className="form-group">
          <div className="d-flex">
            <label className="mt-2 text-center w-50">Email:</label>
            <input className="form-control text-center" placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
          </div>
          <div className="d-flex  ">
            <label className="mt-3  w-50"> Password:</label>
            <input className="form-control mt-2 text-center" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
          </div>

          <input className="form-control btn btn-success btn-block mt-1" type="submit" value="Register" />

          <button className="form-control btn btn-primary btn-block mt-1" type="submit" onClick={logUser}>Log in</button>
          {
            error ?
              (
                <ul className="list-group">
                  <li className="list-group-item mt-2 bg-light">{error}</li>
                </ul>
              )
              :
              (
                <span />
              )
          }
        </form>
      </div>

    </div>
  );
};

export default LoginForm;
