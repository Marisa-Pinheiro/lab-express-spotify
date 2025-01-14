require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (req, res) => {
  res.render("homepage");
});

//Route to receive the searched information
app.get("/artist-search", (req, res) => {
  let { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body);
      res.render("artist-search-results", { response: data.body });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  let artistId = req.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      console.log("Artist albums", data.body);
      res.render("albums", { response: data.body.items });
    })

    .catch((err) => {
      console.error(err);
    });
});

app.get("/tracks/:id", (req, res) => {
  const albumId = req.params.id;
  spotifyApi.getAlbumTracks(albumId).then(
    function (data) {
      console.log("Album tracks", data.body);
      // Render the tracks view with the list of tracks for the specified album
      res.render("tracks", { tracks: data.body.items });
    },
    function (err) {
      console.error(err);
    }
  );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
