var express = require('express'),
app = express(),
http = require('http'),
server = http.createServer(app),
Twit = require('twit'),
io = require('socket.io').listen(server)

server.listen(process.env.PORT || 3000)

// routing
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.htm')
})
app.use(express.static(__dirname + '/public'))

var world = [ '-180', '-90', '180', '90' ]
var wisc = [-97.62451171875,39.30029918615032,-82.19970703125,50.17689812200107]


var T = new Twit({  // You need to setup your own twitter configuration here!
  consumer_key:    '',
  consumer_secret: '',
  access_token:    '',
  access_token_secret:''
})

var bounds_for_socket={} // Will contains a hash association between socket_id -> map bound for this client
var clients=[]  // the list of connected clients
var streams=[]

io.sockets.on('connection', function (socket) {
  streams.push(addStreamByBounds(wisc))

  socket.on('recenter',function(msg){
    var t = JSON.parse(msg)
    bounds_for_socket[this.id]=t.query.bounds.split(",")
  })

  socket.on('disconnect',function(socket){
    for (var i = 0; i < clients.length; i++){
      client=clients[i]
      if(client.client.id == this.id){
        clients.splice(i,1)
      }
    }
    delete bounds_for_socket[this.id]
  })

  clients.push(socket)

  currentBounds = socket.handshake.query.bounds

  bounds_for_socket[socket.id] = currentBounds.split(",")
})

function addStreamByBounds(bounds){
  var stream = T.stream('statuses/filter', { locations: bounds})
  stream.on('error',function(error){
    console.log(error)
  })
  stream.on('limit', function (msg) {
    console.log("limit", JSON.stringify(msg))
  })
  stream.on('tweet', function (tweet) {
    if(tweet.geo){
      var coords=tweet.geo.coordinates

      clients.forEach(function(socket){
        var currentBounds=bounds_for_socket[socket.id]

        if(currentBounds&&(coords[1]>currentBounds[0])&&(coords[0]>currentBounds[1])
                        &&(coords[1]<currentBounds[2])&&(coords[0]<currentBounds[3])){

          var rval={
            text:tweet.text,
            user:{   screen_name:       tweet.user.screen_name,
                     profile_image_url: tweet.user.profile_image_url,
                     id_str:            tweet.user.id_str},
            geo:tweet.geo
          }
          socket.emit('stream',rval)
        }
      })
    }
  })
  return stream
}
