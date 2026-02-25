import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TokenContext } from '../context/Context';
import { motion } from 'framer-motion';
import {
  FRAMER_FADE,
  FRAMER_FADE_INOUT,
  FRAMER_FADE_OUT,
} from '../util/framer';

const DeepSearch = () => {
  const { token } = useContext(TokenContext);
  const [inputValue, setInputValue] = useState('yours');
  const [searchParam, setSearchParam] = useState('yours');
  const [searched, setSearched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchParam(inputValue.trim() || 'yours');
    }, 450);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  useEffect(() => {
    const handleSubmit = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        setErrorMessage('');
        const data = await axios.get(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchParam)}&type=track&market=JP&limit=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSearched(data.data.tracks.items);
      } catch (e) {
        setSearched([]);
        setErrorMessage('Search failed. Try again.');
        console.error('Failed to search tracks', e);
      } finally {
        setIsLoading(false);
      }
    };
    handleSubmit();
  }, [token, searchParam]);

  return (
    <>
      <header className='flex justify-between items-center flex-row lg:h-[10%] w-[100%] px-5 lg:px-12 pt-4 overflow-hidden mb-4 sm:mb-1'>
        <div className='text-sm sm:text-base text-zinc-300'>
          Search songs from Spotify
        </div>
        <Link to={`/dashboard`}>
          <button className='text-black font-semibold bg-custonmGreen hover:bg-custonmGreenHover w-[7rem] lg:w-[9rem] h-[2rem] lg:h-[2.5rem] rounded-[30px] border-[5px] border-[rgba(0,0,0,0.2)]'>
            Go-Back
          </button>
        </Link>
      </header>
      <motion.section
        {...FRAMER_FADE_OUT}
        className='w-[92%] sm:w-[88%] md:w-[80%] lg:w-[68%] xl:w-[56%] mb-4'>
        <div className='bg-[rgba(18,18,18,0.6)] border-[3px] border-[rgba(255,255,255,0.08)] rounded-xl px-3 py-2 flex items-center'>
          <input
            placeholder='Try: daft punk, kendrick, radiohead...'
            value={inputValue}
            onChange={handleInput}
            type='text'
            className='w-full bg-transparent outline-none text-white placeholder:text-zinc-400 text-sm sm:text-base'
          />
          <span className='text-[10px] sm:text-xs text-zinc-400 ml-3'>Live</span>
        </div>
      </motion.section>
      <motion.section
        {...FRAMER_FADE_INOUT}
        className='w-[92%] sm:w-[88%] md:w-[80%] lg:w-[68%] xl:w-[56%] h-[66%] my-2 p-2 sm:p-3 overflow-y-auto overflow-x-hidden rounded-xl bg-[linear-gradient(180deg,rgba(39,39,42,0.95),rgba(24,24,27,0.95))] border-[3px] border-[rgba(255,255,255,0.07)]'>
        {isLoading && (
          <div className='h-full w-full flex items-center justify-center text-zinc-300 text-sm sm:text-base'>
            Searching...
          </div>
        )}
        {!isLoading && errorMessage && (
          <div className='h-full w-full flex items-center justify-center text-red-300 text-sm sm:text-base'>
            {errorMessage}
          </div>
        )}
        {!isLoading && !errorMessage && searched.length === 0 && (
          <div className='h-full w-full flex items-center justify-center text-zinc-400 text-sm sm:text-base'>
            No tracks found.
          </div>
        )}
        {!isLoading &&
          !errorMessage &&
          searched.map((song) => {
            const imageUrl = song.album.images.find((img) => img.height === 64)?.url;
            const name = song.name.split(`-`)[0];
            const artist = song.artists.map((artistItem) => artistItem.name).join(`, `);
            const previewUrl = song.preview_url;
            const key = song.id || song.uri;
            return (
              <Tracks
                key={key}
                imageUrl={imageUrl}
                name={name}
                artist={artist}
                album={song.album.name}
                previewUrl={previewUrl}
              />
            );
          })}
      </motion.section>
    </>
  );
};

export default DeepSearch;

const Tracks = ({ imageUrl, name, artist, album, previewUrl }) => {
  return (
    <>
      <motion.article
        {...FRAMER_FADE}
        className='flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.07)] transition duration-150 ease-in mb-2'>
        <img
          src={imageUrl || '/UserIcon.png'}
          alt={name}
          className='aspect-square h-[58px] sm:h-[68px] rounded-[8px] shadow-customShadow object-cover'
        />
        <div className='flex flex-col min-w-0'>
          <span className='text-sm sm:text-base font-semibold truncate'>{name}</span>
          <span className='font-thin text-xs sm:text-sm text-zinc-300 truncate'>{artist}</span>
          <span className='font-thin text-[11px] sm:text-xs text-zinc-400 truncate'>
            {album}
          </span>
        </div>
        <span
          className={`ml-auto text-[10px] sm:text-xs px-2 py-1 rounded-full border ${previewUrl
            ? 'text-emerald-200 border-emerald-300/40 bg-emerald-500/10'
            : 'text-zinc-300 border-zinc-300/30 bg-zinc-500/10'
            }`}>
          {previewUrl ? 'Preview' : 'No Preview'}
        </span>
      </motion.article>
    </>
  );
};
