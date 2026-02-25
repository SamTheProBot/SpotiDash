import { Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import DiscoverWeekly from './weekly';
import FilterBlend from './blend';
import DeepSearch from './search';
import Navbar from '../components/navbar';

const DashboardComp = () => {
  return (
    <main className='bg-black h-screen w-screen text-white overflow-x box-border m-0 p-0 flex items-center justify-items-center flex-col'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Dashboard />}></Route>
        <Route path='/weekly' element={<DiscoverWeekly />}></Route>
        <Route path='/blend' element={<FilterBlend />}></Route>
        <Route path='/search' element={<DeepSearch />}></Route>
      </Routes>
    </main>
  );
};

export default DashboardComp;
