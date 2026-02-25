import React, { useContext } from 'react';
import { TimeRangeContext } from '../context/Context';
import { FRAMER_FADE_RIGHT } from '../util/framer';
import { motion } from 'framer-motion';

const Ranger = () => {
  const { setRange, range } = useContext(TimeRangeContext);

  const ChangeRange = (e) => {
    setRange(e.target.value);
  };

  const Button = ({ value, display_name }) => {
    const handleButtonClick = () => {
      ChangeRange({ target: { value } });
    };
    return (
      <button
        onClick={handleButtonClick}
        className={`h-[75%] w-[29%] rounded-[15px] border-[2px] sm:border-[4px] border-[rgba(0,0,0,0.15)] transition ease-out duration-100 
        ${
          range === value
            ? ' scale-[0.95]  bg-[rgba(0,0,0,0.3)] shadow-customShadow'
            : 'scale-[1.05] shadow-customShadowLight bg-[rgba(0,0,0,0.1)]'
        }`}
        dangerouslySetInnerHTML={{ __html: display_name }}></button>
    );
  };

  return (
    <motion.section
      {...FRAMER_FADE_RIGHT}
      className={`flex flex-row sm:m-1.5 m-1 box-content bg-purple-700 h-[14%] overflow-auto overflow-x-hidden rounded-[15px] border-[3px] font-medium text-[12px] sm:text-base sm:border-[5px] border-[rgba(0,0,0,0.1)] justify-evenly items-center`}>
      <Button value='short' display_name='Past 4 <br /> Weeks' />
      <Button value='medium' display_name='Past 6 <br /> Months' />
      <Button value='long' display_name='All time' />
    </motion.section>
  );
};

export default Ranger;
