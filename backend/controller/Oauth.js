require(`dotenv`).config();

const axios = require(`axios`);
const querystring = require("querystring");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://127.0.0.1:5000";

let generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

const login = async (req, res) => {
  var state = generateRandomString(16);
  var scope =
    "user-read-private user-library-read playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-top-read ";

  res.redirect(
    `https://accounts.spotify.com/authorize?` +
      querystring.stringify({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: `${req.protocol}://${req.get("host")}/callback`,
        state: state,
      }),
  );
};

const callback = async (req, res) => {
  let code = req.query.code || null;
  let state = req.query.state || null;

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        }),
    );
  } else {
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: `${req.protocol}://${req.get("host")}/callback`,
        grant_type: "authorization_code",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            encodeURIComponent(CLIENT_ID) +
              ":" +
              encodeURIComponent(CLIENT_SECRET),
          ).toString("base64"),
      },
    };
    try {
      const response = await axios.post(
        authOptions.url,
        querystring.stringify(authOptions.form),
        {
          headers: authOptions.headers,
        },
      );
      let access_token = response.data.access_token;
      let token = {
        access_token: access_token,
      };
      res.cookie(`Userdata`, token, { maxAge: 360000 });
      res.status(200).redirect(
        `${FRONTEND_URL}/dashboard?` +
          querystring.stringify({
            Token: access_token,
          }),
      );
    } catch (e) {
      console.error(e);
      res.status(500).redirect(`${FRONTEND_URL}/login`);
    }
  }
};

module.exports = {
  login,
  callback,
};
