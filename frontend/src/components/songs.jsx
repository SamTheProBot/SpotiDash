import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FRAMER_FADE } from '../util/framer';
import { TokenContext, TimeRangeContext } from '../context/Context';

const TopSongs = () => {
  const { range } = useContext(TimeRangeContext);
  const { token } = useContext(TokenContext);
  const [data, setData] = useState([]);
  const [song, setSong] = useState(null);
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const Tracks = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/me/top/tracks?time_range=${range}_term&limit=40`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const res = response.data.items;
        setData(res);
      } catch (e) {
        console.error('Failed to fetch top tracks', e);
      }
    };
    Tracks();
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
    }
  }, [token, range]);

  useEffect(() => {
    if (playing && song) {
      audioRef.current.src = song;
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playing, song]);

  const handlePreviewSong = (PreviewUrl, trackId) => {
    if (!PreviewUrl) return;
    if (PreviewUrl === song && activeTrackId === trackId) {
      setPlaying(!playing);
    } else {
      setSong(PreviewUrl);
      setActiveTrackId(trackId);
      setPlaying(true);
    }
  };

  return (
    <>
      <section
        className={`flex flex-col sm:m-1.5 m-1 bg-orange-600 overflow-auto w-[58%] overflow-x-hidden rounded-[15px] border-[3px] sm:border-[5px] border-[rgba(0,0,0,0.1)] `}>
        <audio ref={audioRef} src={song}></audio>
        {data.map((items) => {
          let imgUrl = items.album.images.find(
            (item) => item.height === 64
          ).url;
          let Name = items.name.split(`-`)[0];
          let Artist = items.artists.map((artist) => artist.name)?.join(', ');
          let PreviewUrl = items.preview_url;
          let key = items.id || items.uri.split(':')[2];
          if (!imgUrl) {
            return <p>no valid image</p>;
          }
          return (
            <SongLayer
              key={key}
              imgUrl={imgUrl}
              Name={Name}
              Artist={Artist}
              PreviewUrl={PreviewUrl}
              handlePreviewSong={() => handlePreviewSong(PreviewUrl, key)}
              isActive={activeTrackId === key && playing}
              playing={playing}
            />
          );
        })}
      </section>
    </>
  );
};

const SongLayer = ({
  imgUrl,
  Name,
  Artist,
  PreviewUrl,
  handlePreviewSong,
  isActive,
}) => {
  return (
    <>
      <motion.article
        {...FRAMER_FADE}
        onClick={handlePreviewSong}
        className={`p-1 pt-1.5 pb-2 flex rounded-[10px] hover:text-black transition duration-150 ease-in cursor-pointer  ${isActive
          ? `bg-[rgba(0,0,0,0.2)] text-black scale-95`
          : ``
          }`}>
        <img
          src={imgUrl}
          alt={Name}
          className={`aspect-square sm:h-[64px] h-[38px] rounded-[8px] shadow-customShadow transition duration-200 ease-in
          ${PreviewUrl ? `brightness-100` : `brightness-50`}`}
        />
        <div className='flex flex-col p-0 sm:p-1 sm:pl-2 pl-1 justify-around'>
          <div className='text-[10px] sm:text-base'>{Name}</div>
          <div className='font-thin hidden text-sm sm:block'>{Artist}</div>
        </div>
      </motion.article>
    </>
  );
};

export default TopSongs;
