import React, { useContext } from 'react';
import Login from './pages/login';
import DashboardComp from './pages/main';
import { Route, Routes } from 'react-router-dom';
import './Tailwind.css';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />}></Route>
      <Route path='/dashboard/*' element={<DashboardComp />}></Route>
    </Routes>
  );
};

export default App;
