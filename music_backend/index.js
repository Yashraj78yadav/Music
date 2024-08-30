// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');  // Import dotenv correctly
dotenv.config();
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const playlistRoutes = require("./routes/playlist");
// Initialize Express app
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

// Connect to MongoDB using mongoose
mongoose.connect(process.env.URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
    });

    // passport-jwt setup

    const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'thiskeysupposedToBeSecerate';

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      // Use await with findOne
      const user = await User.findOne({ id: jwt_payload.sub });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// Define a basic route
app.get("/", (req, res) => {
    res.send("HELLO WORLD");
});

app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);

// Start the Express server
app.listen(port, () => {
    console.log(`App is running on port ${port}`);

});


