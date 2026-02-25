import { TokenContext, PlaylistContext } from "./Context";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";

const UserPlaylistProvider = ({ children }) => {
  const { token } = useContext(TokenContext);
  const [userPlaylist, setUserPlaylist] = useState([]);

  useEffect(() => {
    const getPlaylist = async () => {
      if (!token) return;
      try {
        let allPlaylists = [];
        let offset = 0;
        const limit = 50;
        let total = 0;

        do {
          const response = await axios.get(
            `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          allPlaylists = allPlaylists.concat(response.data.items || []);
          total = response.data.total || 0;
          offset += limit;
        } while (offset < total);

        setUserPlaylist(allPlaylists);
      } catch (e) {
        console.error('Failed to fetch user playlists', e);
      }
    };
    getPlaylist();
  }, [token]);

  return (
    <PlaylistContext.Provider value={{ userPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export default UserPlaylistProvider;
