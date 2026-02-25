import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TokenContext } from '../context/Context';
import { URL } from '../util/url';

const Navbar = () => {
  const { token, setToken } = useContext(TokenContext);
  const [userID, setUserID] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const accessToken = searchParams.get('Token');
    if (!accessToken) return;

    localStorage.setItem('Token', accessToken);
    setToken(accessToken);

    searchParams.delete('Token');
    const queryString = searchParams.toString();
    const cleanUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}${window.location.hash}`;
    window.history.replaceState({}, document.title, cleanUrl);
  }, [setToken]);

  useEffect(() => {
    const userInfo = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`https://api.spotify.com/v1/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const resData = response.data;
        setUserInfo(resData);
        setUserID(resData.id);
        setUserName(resData.display_name);
      } catch (e) {
        if (e.response?.status === 401) {
          localStorage.removeItem('Token');
          setToken(null);
        }
        console.error('Failed to fetch Spotify user profile', e);
      }
    };
    userInfo();
  }, [token, setToken]);

  useEffect(() => {
    if (!userID || !userName) return;

    const newUser = async () => {
      try {
        await axios.post(`${URL}/api/v1/UserId`, {
          userID: userID,
          userName: userName,
          access_token: localStorage.getItem('Token'),
        });
      } catch (e) {
        console.error('Failed to sync user id', e);
      }
    };
    localStorage.setItem('UserID', userID);
    newUser();
  }, [userID, userName]);

  return (
    <header className=' flex justify-between flex-row h-[10%] w-[100%] pt-4 pl-5 pr-4 md:pr-16 overflow-hidden font-semibold'>
      <div className='flex'>
        <img src='/logo.svg' alt='logo' className='h-8 md:h-10 pr-2' />
        <h2 className='items-center text-lg md:text-xl text-customLightGray font-semibold'>
          Welcome,
          <span className='md:text-2xl text:xl text-white'>
            {' '}
            {userInfo.display_name}{' '}
          </span>
          <span className='text-base'>({userInfo.country})</span>
        </h2>
      </div>
      <img
        src={userInfo.images?.[0]?.url || `/UserIcon.png`}
        alt={userInfo.display_name}
        className='h-10 md:h-12 aspect-square object-cover rounded-[50%] border-[3px] border-customLightGray'
      />
    </header>
  );
};

export default Navbar;
