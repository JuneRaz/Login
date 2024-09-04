
import Login from './components/Login';
import './App.css';
import Home from './components/Home';
import Layout from './components/Layout';
import User from './components/User';
import Admin from './components/Admin';
import Missing from './components/Missing';
import RequireAuth from './components/RequireAuth';
import LinkPage from './components/LinkPage';
import Reset from './reset';
import Unauthorized from './components/Unauthorized';
import { Routes, Route } from 'react-router-dom';
import PersistLogin from './components/PersistLogin';
const ROLES = {
  'User': 2001,
  'Editor': 1994,
  'Admin': 5150
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="Login" element={<Login />} />
        <Route path="reset" element={<Reset />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        

          <Route element={<RequireAuth allowedRoles={[1994,2001]}/>}>
          <Route path="home" element={<Home />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[1994]}/>}>
          <Route path="admin" element={<Admin />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]}/>}>
          <Route path="user" element={<User />} />
          </Route>
      
        

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;