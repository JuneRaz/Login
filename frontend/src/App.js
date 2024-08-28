
import Login from './Login';
import './App.css';
import Home from './components/Home';
import Layout from './components/Layout';
import User from './components/User';
import Admin from './components/Admin';
import Missing from './components/Missing';
import RequireAuth from './components/RequireAuth';
import LinkPage from './components/LinkPage';

import { Routes, Route } from 'react-router-dom';



function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="Login" element={<Login />} />
        

          <Route element ={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="admin" element={<Admin />} />
          <Route path="user" element={<User />} />
          </Route>
        

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;