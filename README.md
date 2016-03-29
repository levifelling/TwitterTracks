# TwitterTracks

A Node.js app using [Express 4](http://expressjs.com/), [Twit](https://github.com/ttezel/twit), [socket.io](https://github.com/socketio/socket.io).

This application consumes the Twitter API, pulling geolocated tweets, and plost them on a [Leaflet](http://leafletjs.com/) map.

## Test Deployment

http://glacial-bastion-76018.herokuapp.com/

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ git clone https://github.com/levifelling/TwitterTracks
$ cd TwitterTracks
$ npm install
$ npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```


## Documentation

Twitter API needs to be authorized. Go to https://apps.twitter.com/ and create a new authorized app.

Modify server.js to include your Twitter authorization.
```
var T = new Twit({  // You need to setup your own twitter configuration here!
  consumer_key:    '',
  consumer_secret: '',
  access_token:    '',
  access_token_secret:''
})
```
