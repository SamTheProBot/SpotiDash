require(`dotenv`).config();
require(`express-async-errors`);

const path = require(`path`);
const helmet = require(`helmet`);
const cors = require(`cors`);
const express = require(`express`);

const port = process.env.PORT || process.env.LOCALPORT;
const MONGO_URL = process.env.MONGODB_URI;

const ConnectDB = require(`./DB/connect`);
const app = express();

const Oauth = require(`./router/Oauth`);
const api = require(`./router/Api`);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "connect-src": ["'self'", "https://api.spotify.com"],
        "img-src": ["'self'", "data:", "https://i.scdn.co"],
        "script-src": ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);
app.use(cors());
app.use(express.json());

app.use(`/`, Oauth);
app.use(`/api/v1`, api);

const frontendDist = path.join(__dirname, `./dist`);
app.use(express.static(frontendDist));
app.get(`*`, (req, res) => {
  res.sendFile(path.join(frontendDist, `index.html`));
});

const Start = async () => {
  try {
    const mongoUri = MONGO_URL;
    await ConnectDB(mongoUri);

    app.listen(port, `127.0.0.1`, async () => {
      console.log(`server is running on port http://127.0.0.1:${port}...`);
    });
  } catch (e) {
    console.error("failed to start server", e.message);
    process.exit(1);
  }
};

Start();
