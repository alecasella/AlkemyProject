import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import AuthProvider from './contexts/auth'

import LoginForm from './components/login-form'
import NavBar from './components/navbar'
import Logout from './components/logout'
import AddTransactions from './components/add-transactions';
import CheckLastTransactions from './components/check-last-transactions'
import EditTransaction from './components/edit-transaction'

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
            <Route path="/addTransaccions/:idUser" component={AddTransactions}></Route>
            <Route path="/checkLastTransactions/:idUser" component={CheckLastTransactions}></Route>
            <Route path="/editTransaction" component={EditTransaction}></Route>
            
          </Switch>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
