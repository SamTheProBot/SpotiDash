import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  return (
    <>
      <div className='sm:border-[5px] border-[3px] hover:shadow-customWhiteShadow border-[rgba(0,0,0,0.1)] rounded-[15px]  flex justify-center items-center overflow-hidden sm:m-1.5 m-1 bg-yellow-600'>
        <Link to={`search`}>
          <img
            src={`/Search.jpg`}
            alt='Discover Weekly'
            className='rounded-[15px] hover:scale-[1.03] opacity-80 hover:opacity-50 transition duration-150 ease-in'
          />
        </Link>
      </div>
    </>
  );
};

export default Search;
