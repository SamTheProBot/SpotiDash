require(`dotenv`).config();

const axios = require(`axios`);
const Database = require(`../model/UserInfo`);

const {
  Createplaylist,
  FetchAllUserPlaylist,
  FetchSongs,
  AddSongsIntoPlaylist,
} = require('../lib/SpotiFunc');

const BlendplaylistEndpoint = async (req, res) => {
  let access_token = req.session.access_token;

  try {
    const blendPlaylist = await req.body.blendlist;
    let filterPlaylist = await req.body.filterlist;

    let filterPlaylistSongs = [];
    let blendPlaylistSongs = [];

    const BlendData = await Database.findOne({
      UserKey: userId,
    });
    if (BlendData?.Blend.length < 3 || BlendData?.Blend.length === (null || undefined)) {
      const currenDate = new Date();
      ISTtime = currenDate.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
      });

      const newBlendPlaylist = await Createplaylist(
        `Filtered_blend created at ${ISTtime}`,
        `your selected blends, you can change info as you want`,
        userId,
        access_token
      );

      await Database.findOneAndUpdate(
        {
          UserKey: userId,
        },
        {
          $push: {
            Blend: {
              selectedBlends: blendPlaylist,
              selectedFilter: filterPlaylist,
              PlaylistID: newBlendPlaylist,
            },
          },
        }
      );

      try {
        for (let item of blendPlaylist) {
          const PlaylistSongs = await FetchSongs(item, 50, 0, access_token);
          blendPlaylistSongs = blendPlaylistSongs.concat(PlaylistSongs);
        }
        for (let item of filterPlaylist) {
          const PlaylistSongs = await FetchSongs(item, 50, 0, access_token);
          filterPlaylistSongs = filterPlaylistSongs.concat(PlaylistSongs);
        }
      } catch (e) {
        console.log(`error while fetching songs`);
      }

      const songsToBeAdded = blendPlaylistSongs
        .map((item) => {
          const ExistFilter = !filterPlaylistSongs.some((tracks) => tracks === item);
          const ExistBlend = !blendPlaylistSongs.some((tracks) => tracks === item);
          if (ExistBlend && ExistBlend) return item;
          else return null;
        })
        .filter(Boolean);

      AddSongsIntoPlaylist(songsToBeAdded, newBlendPlaylist, access_token);

      res.status(200).send(`woking?`);
    } else {
      console.log(`too many request`);
    }
  } catch (e) {
    throw e;
  }
};

module.exports = {
  BlendplaylistEndpoint,
};
