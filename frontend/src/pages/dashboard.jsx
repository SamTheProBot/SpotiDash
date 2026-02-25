import Ranger from '../components/range';
import TopSongs from '../components/songs';
import TopArtist from '../components/artist';
import Weekly from '../components/weekly';
import Blend from '../components/blend';
import Search from '../components/search';
import { motion } from 'framer-motion';
import {
  FRAMER_FADE_INOUT,
  FRAMER_FADE_LEFT,
} from '../util/framer';

const Dashboard = () => {
  return (
    <>
      <div className='w-[97%] sm:w-[90%] md:w-[80%] lg:w-[65%] xl:w-[50%] flex items-center h-[55%] sm:h-[80%] sm:mt-0 mt-24 transition duration-400 ease-out'>
        <motion.article
          {...FRAMER_FADE_LEFT}
          className='w-[33%] h-[100%] grid grid-rows-3 '>
          <Blend />
          <Weekly />
          <Search />
        </motion.article>
        <article className='w-[67%] h-[100%]' style={{ transition: '1s ease' }}>
          <Ranger />
          <motion.div {...FRAMER_FADE_INOUT} className='w-[100%] h-[85%] flex'>
            <TopSongs />
            <TopArtist />
          </motion.div>
        </article>
      </div>
    </>
  );
};

export default Dashboard;
