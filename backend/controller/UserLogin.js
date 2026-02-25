require(`dotenv`).config();
const { FetchSongs, AddSongsIntoPlaylist } = require('../lib/SpotiFunc');
const Database = require(`../model/UserInfo`);

const UserIdEndpoint = async (req, res) => {
  try {
    const { userID, userName, access_token } = req.body;
    if (!userID || !access_token) {
      return res.status(400).json({ response: 'missing userID or access_token' });
    }

    try {
      let User = await Database.findOneAndUpdate(
        { userKey: userID },
        { $setOnInsert: { userKey: userID }, $set: { userName: userName || '' } },
        { new: true, upsert: true }
      );
      if (User) {
        console.log(`user upserted`);
      }

      if (
        User &&
        User.weekly.exist === true &&
        User.weekly.playlistID &&
        User.weekly.weeklyID
      ) {
        const playlistSongs = await FetchSongs(
          User.weekly.playlistID,
          50,
          0,
          access_token
        );
        const weeklySongs = await FetchSongs(User.weekly.weeklyID, 50, 0, access_token);
        const playlistSet = new Set(playlistSongs);
        const songsToBeAdded = weeklySongs.filter((trackUri) => !playlistSet.has(trackUri));

        if (songsToBeAdded.length > 0) {
          await AddSongsIntoPlaylist(
            songsToBeAdded,
            User.weekly.playlistID,
            access_token
          );
          console.log(`weekly songs updated: ${songsToBeAdded.length} tracks added`);
        } else {
          console.log(`weekly songs already up to date`);
        }
      }
      //   if (User && User.Blend !== null) {
      //     // const val = await FetchAllUserPlaylist(access_token);
      //     // const blendPlaylistIDs = User.Blend.map((item) => item.PlaylistID);
      //     // const yoi = val.map((item) => item.id).filter((item) => blendPlaylistIDs.includes(item));

      //     // for(let item of yoi){
      //     //   await Database.findOneAndUpdate(
      //     //     {
      //     //       UserKey: userID,
      //     //     },
      //     //     $pop:{

      //     //     },
      //     //   )
      //     // }

      //     for (let items of User.Blend) {
      //       let filterPlaylistSongs = [];
      //       let blendPlaylistSongs = [];
      //       try {
      //         for (let item of items.selectedBlends) {
      //           const PlaylistSongs = await FetchSongs(item, 50, 0, access_token);
      //           blendPlaylistSongs = blendPlaylistSongs.concat(PlaylistSongs);
      //         }
      //         for (let item of items.selectedFilter) {
      //           const PlaylistSongs = await FetchSongs(item, 50, 0, access_token);
      //           filterPlaylistSongs = filterPlaylistSongs.concat(PlaylistSongs);
      //         }
      //       } catch (e) {
      //         console.log(`error while fetching songs`);
      //       }

      //       const songsToBeAdded = blendPlaylistSongs
      //         .map((item) => {
      //           const Exist = !filterPlaylistSongs.some((tracks) => tracks === item);
      //           if (Exist) return item;
      //           else return null;
      //         })
      //         .filter(Boolean);
      //       console.log(`filterblend updated of ID ${items.PlaylistID}`);
      //       AddSongsIntoPlaylist(songsToBeAdded, items.PlaylistID, access_token);
      //     }
      //   }
    } catch (e) {
      console.error(`error while processing user login sync`, e.message);
    }
  } catch (e) {
    console.log(`error fetching user info`);
  }
  res.json({ response: `sucess` });
};

module.exports = {
  UserIdEndpoint,
};
