require(`dotenv`).config();
const Database = require(`../model/UserInfo`);

const {
  Createplaylist,
  FetchAllUserPlaylist,
  FetchSongs,
  AddSongsIntoPlaylist,
} = require("../lib/SpotiFunc");

const WeeklyplaylistEndpoint = async (req, res) => {
  try {
    console.log("[weekly-api] hit /api/v1/weeklyplaylist");
    console.log("[weekly-api] payload keys:", Object.keys(req.body || {}));
    const Name = req.body.name;
    const Description = req.body.description;
    const weeklyPlaylistId = req.body.weeklyPlaylistId;
    const access_token = req.body.access_token;
    const userID = req.body.userID;

    if (!Name || !weeklyPlaylistId || !access_token || !userID) {
      console.warn("[weekly-api] missing required fields", {
        Name: Boolean(Name),
        weeklyPlaylistId: Boolean(weeklyPlaylistId),
        access_token: Boolean(access_token),
        userID: Boolean(userID),
      });
      return res
        .status(400)
        .json({ message: "missing required weekly setup fields" });
    }

    const user = await Database.findOne({ userKey: userID });
    if (!user) {
      return res
        .status(404)
        .json({ message: "user not found, open dashboard first" });
    }

    const userPlaylists = await FetchAllUserPlaylist(access_token);
    console.log(`[weekly-api] playlists fetched: ${userPlaylists?.length || 0}`);
    (userPlaylists || []).forEach((playlist, index) => {
      console.log(
        `[weekly-api] playlist[${index}] name="${playlist?.name}" id="${playlist?.id}" owner="${playlist?.owner?.display_name}"`,
      );
    });
    const existingArchiveId = user.weekly.playlistID;
    const hasExistingArchive =
      existingArchiveId &&
      userPlaylists?.some((playlist) => playlist.id === existingArchiveId);

    let archivePlaylistId = existingArchiveId;

    if (!user.weekly.exist || !hasExistingArchive) {
      archivePlaylistId = await Createplaylist(
        Name,
        Description,
        userID,
        access_token,
      );
      if (!archivePlaylistId) {
        return res
          .status(502)
          .json({ message: "failed to create archive playlist" });
      }
      console.log(`weekly archive playlist created for user ${userID}`);
    }

    const archiveSongs = hasExistingArchive
      ? await FetchSongs(archivePlaylistId, 50, 0, access_token)
      : [];
    const weeklySongs = await FetchSongs(weeklyPlaylistId, 50, 0, access_token);
    const archiveSet = new Set(archiveSongs);
    const songsToBeAdded = weeklySongs.filter(
      (trackUri) => !archiveSet.has(trackUri),
    );

    if (songsToBeAdded.length > 0) {
      await AddSongsIntoPlaylist(
        songsToBeAdded,
        archivePlaylistId,
        access_token,
      );
    }

    await Database.findOneAndUpdate(
      { userKey: userID },
      {
        $set: {
          "weekly.exist": true,
          "weekly.weeklyID": weeklyPlaylistId,
          "weekly.playlistID": archivePlaylistId,
        },
      },
    );

    res.status(200).json({
      message: hasExistingArchive
        ? "weekly automation confirmed"
        : "weekly automation created",
      playlistID: archivePlaylistId,
      addedTracks: songsToBeAdded.length,
    });
  } catch (e) {
    console.error(`failed to setup weekly automation`, e.message);
    res.status(500).json({ message: "failed to setup weekly automation" });
  }
};

module.exports = {
  WeeklyplaylistEndpoint,
};
