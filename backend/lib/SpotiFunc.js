const axios = require('axios');

const Createplaylist = async (Name, Description, UserID, access_token) => {
  try {
    await axios.post(
      `https://api.spotify.com/v1/users/${UserID}/playlists`,
      {
        name: Name,
        description: Description,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const val = await FetchAllUserPlaylist(access_token);
    return (data = val
      .filter(
        (items) => items.name === Name || items.description === Description
      )
      .map((item) => item.id)[0]);
  } catch (e) {
    console.log(`error while creating New playlist`, e);
  }
};

const FetchAllUserPlaylist = async (access_token) => {
  let allPlaylists = [];
  const limit = 50;
  let offset = 0;

  try {
    let total = 0;
    do {
      const response = await axios.get(
        `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      allPlaylists = allPlaylists.concat(response.data.items || []);
      total = response.data.total || 0;
      offset += limit;
    } while (offset < total);

    return allPlaylists;
  } catch (e) {
    console.log(`error while fetching UsersPlaylist`, e.message);
    return [];
  }
};

const FetchSongs = async (PlaylistId, limit, offset, access_token) => {
  let allSongs = [];
  try {
    do {
      var response = await axios.get(
        `https://api.spotify.com/v1/playlists/${PlaylistId}/tracks?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const data = response.data.items;
      const songs = data.map((items) => items.track.uri);
      allSongs = allSongs.concat(songs);
      offset += 50;
    } while (offset < response.data.total);
  } catch (e) {
    throw e;
  }
  return allSongs;
};

const AddSongsIntoPlaylist = async (songs, PlaylistId, access_token) => {
  try {
    let batch = [];
    for (const item of songs) {
      if (item) {
        batch.unshift(item);
      }
      if (batch.length >= 30) {
        try {
          await axios.post(
            `https://api.spotify.com/v1/playlists/${PlaylistId}/tracks`,
            {
              uris: batch,
              position: 0,
            },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          await new Promise((resolve) => setTimeout(resolve, 50));
          batch = [];
          console.log(`adding batch`);
        } catch (e) {
          console.error(`Error adding track: ${e.message}`);
        }
      }
    }
    if (batch.length > 0) {
      try {
        await axios.post(
          `https://api.spotify.com/v1/playlists/${PlaylistId}/tracks`,
          {
            uris: batch,
            position: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        await new Promise((resolve) => setTimeout(resolve, 50));
        batch = [];
      } catch (e) {
        console.error(`Error adding track: ${e.message}`);
      }
    }
  } catch (e) {
    console.error(`Error in AddSongs function: ${e.message}`);
  }
};

// const AddSongsIntoPlaylist = async (songs, PlaylistId, access_token) => {
//   try {
//     for (const item of songs) {
//       if (!item) {
//         continue;
//       }
//       try {
//         await axios.post(
//           `https://api.spotify.com/v1/playlists/${PlaylistId}/tracks`,
//           {
//             uris: [item],
//             position: 0,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${access_token}`,
//             },
//           }
//         );
//         await new Promise((resolve) => setTimeout(resolve, 50));
//       } catch (e) {
//         console.error(`Error adding track: ${e.message}`);
//       }
//     }
//   } catch (e) {
//     console.error(`Error in AddSongs function: ${e.message}`);
//   }
// };

module.exports = {
  Createplaylist,
  FetchAllUserPlaylist,
  FetchSongs,
  AddSongsIntoPlaylist,
};
