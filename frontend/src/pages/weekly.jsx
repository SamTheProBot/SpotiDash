import { useEffect, useState, useContext } from 'react';
import { URL } from '../util/url';
import axios from 'axios';
import { PlaylistContext } from '../context/Context';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FRAMER_FADE_INOUT } from '../util/framer';

const weeklyEndpoint = `${URL}/api/v1/weeklyplaylist`;

const DiscoverWeekly = () => {
  const { userPlaylist } = useContext(PlaylistContext);
  const [weeklyPlaylist, setWeeklyPlaylist] = useState('');
  const [weeklyPlaylistExist, setWeeklyPlaylistExist] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [NewplaylistData, setNewplaylistData] = useState({
    name: '',
    description: '',
    weeklyPlaylistId: '',
    access_token: localStorage.getItem('Token'),
    userID: localStorage.getItem('UserID'),
  });

  useEffect(() => {
    console.log('[weekly] playlists loaded:', userPlaylist.length);
    const weeklyPlaylistid = userPlaylist
      .filter(
        (item) =>
          item.name === 'Discover Weekly' &&
          item.owner.display_name === `Spotify`
      )
      .map((playlist) => playlist.id)[0];
    console.log('[weekly] discovered weekly playlist id:', weeklyPlaylistid || '(none)');
    setWeeklyPlaylist(weeklyPlaylistid);
    setNewplaylistData((prevData) => ({
      ...prevData,
      weeklyPlaylistId: weeklyPlaylistid,
    }));
  }, [userPlaylist]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setNewplaylistData({
      ...NewplaylistData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('[weekly] submit clicked', {
      weeklyPlaylist,
      name: NewplaylistData.name,
      userID: NewplaylistData.userID,
      hasToken: Boolean(NewplaylistData.access_token),
      endpoint: weeklyEndpoint,
    });

    if (!weeklyPlaylist) {
      setSubmitError('Discover Weekly playlist not found on your account yet.');
      console.warn('[weekly] blocked submit: no Discover Weekly playlist id');
      return;
    }
    const postPlaylistData = async () => {
      try {
        setIsSubmitting(true);
        setStatusMessage('');
        setSubmitError('');
        console.log('[weekly] posting payload', NewplaylistData);
        const response = await axios.post(weeklyEndpoint, NewplaylistData);
        console.log('[weekly] endpoint response', response.status, response.data);
        setStatusMessage(
          `Automation is active. ${response.data?.addedTracks || 0} tracks synced now.`
        );
        setWeeklyPlaylistExist(true);
      } catch (e) {
        setSubmitError('Failed to setup automation. Please try again.');
        console.error('weekly setup failed', e?.response?.status, e?.response?.data || e);
      } finally {
        setIsSubmitting(false);
      }
    };
    postPlaylistData();
  };

  return (
    <>
      <header className='flex justify-between items-center w-[100%] px-5 lg:px-12 pt-4 overflow-hidden mb-5'>
        <div className='text-sm sm:text-base text-zinc-300'>Weekly Automation</div>
        <Link to={`/dashboard`}>
          <button className='text-black font-semibold bg-custonmGreen hover:bg-custonmGreenHover w-[7rem] lg:w-[9rem] h-[2rem] lg:h-[2.5rem] rounded-[30px] border-[5px] border-[rgba(0,0,0,0.2)]'>
            Go-Back
          </button>
        </Link>
      </header>
      <motion.section
        {...FRAMER_FADE_INOUT}
        className='w-[92%] sm:w-[84%] md:w-[76%] lg:w-[65%] xl:w-[52%] rounded-2xl border-[3px] border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(39,39,42,0.92),rgba(24,24,27,0.92))] px-4 sm:px-6 py-5 sm:py-6'>
        <div className='mb-5'>
          <h2 className='text-xl sm:text-2xl font-semibold'>Archive Your Weekly Songs</h2>
          <p className='text-xs sm:text-sm text-zinc-300 mt-2'>
            Create one playlist once, then every time you open the app it syncs fresh
            Discover Weekly tracks so they do not disappear after the week ends.
          </p>
        </div>

        {weeklyPlaylistExist ? (
          <div className='rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-5'>
            <p className='text-emerald-100 text-sm sm:text-base font-semibold'>
              Weekly automation is enabled.
            </p>
            <p className='text-emerald-50/90 text-xs sm:text-sm mt-2'>
              {statusMessage || 'Your archive playlist is set and will keep getting new songs.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <label className='flex flex-col gap-1.5 text-sm text-zinc-200'>
              Playlist Name
              <input
                required
                type='text'
                placeholder='My Weekly Archive'
                name='name'
                onChange={handleInput}
                value={NewplaylistData.name}
                className='h-11 px-3 bg-[rgba(12,12,12,0.55)] border border-[rgba(255,255,255,0.18)] rounded-lg focus:outline-none focus:border-zinc-200'
              />
            </label>
            <label className='flex flex-col gap-1.5 text-sm text-zinc-200'>
              Playlist Description
              <input
                type='text'
                placeholder='Saved songs from Discover Weekly'
                name='description'
                onChange={handleInput}
                value={NewplaylistData.description}
                className='h-11 px-3 bg-[rgba(12,12,12,0.55)] border border-[rgba(255,255,255,0.18)] rounded-lg focus:outline-none focus:border-zinc-200'
              />
            </label>
            <button
              className='mt-2 text-black font-semibold bg-custonmGreen hover:bg-custonmGreenHover h-12 rounded-xl border-[4px] border-[rgba(0,0,0,0.2)] disabled:opacity-70'
              disabled={isSubmitting}
              type='submit'>
              {isSubmitting ? 'Setting Up...' : 'Create Automation Playlist'}
            </button>
            {statusMessage && (
              <p className='text-xs sm:text-sm text-emerald-200'>{statusMessage}</p>
            )}
            {submitError && (
              <p className='text-xs sm:text-sm text-red-300'>{submitError}</p>
            )}
          </form>
        )}
      </motion.section>
    </>
  );
};

export default DiscoverWeekly;
