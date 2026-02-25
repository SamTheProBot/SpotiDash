import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FRAMER_FADE, FRAMER_FADE_INOUT } from '../util/framer';
import { TokenContext, TimeRangeContext } from '../context/Context';

const TopArtist = () => {
  const { range } = useContext(TimeRangeContext);
  const { token } = useContext(TokenContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getArtists = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/me/top/artists?time_range=${range}_term&limit=25`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const res = response.data.items;
        setData(res);
      } catch (e) {
        console.error('Failed to fetch top artists', e);
      }
    };

    getArtists();
  }, [token, range]);

  return (
    <>
      <section
        className={`flex flex-col sm:m-1.5 m-1 bg-green-600 overflow-auto w-[42%] rounded-[15px] overflow-x-hidden border-[3px] sm:border-[5px] border-[rgba(0,0,0,0.1)] `}>
        {data.map((items) => {
          let key = items.id;
          let Name = items.name;
          let imgUrl = items.images.find(
            (item) => item.height === 160 || item.height === 64
          )?.url;
          let Genres = items.genres.map((genre) => genre.name).join(', ');
          let ArtistUrl = items.external_urls.spotify;

          return (
            <ArtistLayer
              key={key}
              Name={Name}
              imgUrl={imgUrl}
              Genres={Genres}
              ArtistUrl={ArtistUrl}
            />
          );
        })}
      </section>
    </>
  );
};

const ArtistLayer = ({ imgUrl, Name, Genres, ArtistUrl }) => {
  const handleClick = () => {
    window.location.href = ArtistUrl;
  };

  return (
    <>
      <motion.article
        {...FRAMER_FADE}
        onClick={handleClick}
        className='p-1 sm:pb-3 pb-2 pt-1 flex hover:scale-[1.03] hover:text-black hover:underline transition duration-150 ease-in cursor-pointer '>
        <img
          src={imgUrl}
          alt={Name}
          className='aspect-square sm:h-[64px] h-[38px] rounded-[8px] shadow-customShadow hover:opacity-90 transition duration-200 ease-in'
        />
        <div className='flex flex-col p-1 pl-2 justify-around'>
          <div className='text-[10px] sm:text-base'>{Name}</div>
        </div>
      </motion.article>
    </>
  );
};

export default TopArtist;
