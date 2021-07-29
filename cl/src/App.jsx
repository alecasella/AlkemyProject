import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import AuthProvider from './contexts/auth'

import LoginForm from './components/login-form'
import NavBar from './components/navbar'
import Logout from './components/logout'
import Transactions from './components/transactions';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="container">
        <Router>
          <NavBar />
          <Switch>
            <Route exact path="/" component={LoginForm}></Route>
            <Route path="/logout" component={Logout}></Route>
            <Route path="/transaccions/:idUser" component={Transactions}></Route>
          </Switch>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
