var LIMIT=5
var popups=[]
var socket=null

window.onload = function() {

  var baseLayer = L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: ''
  })

  map = new L.Map('map', {
    center: new L.LatLng(45,-90),
    zoom: 7,
    minZoom: 0,
    layers: [baseLayer]
  })
  map.on('zoomend',updateSocket)
  map.on('dragend',updateSocket)

  for(var i=0; i<LIMIT; i++){
    popups.push(new L.Popup({ offset: new L.Point(0,-10), closeButton: true, autoPan: true }))
  }

  startSocket()
}

function addPoint(tweet){
  if(tweet.geo){
    pt={lng:tweet.geo.coordinates[1],lat:tweet.geo.coordinates[0],count:1}
    popup=popups.shift()
    popup.setContent(
      "<img src="+tweet.user.profile_image_url+" align=left><b>@"+tweet.user.screen_name+"</b><br>"+tweet.text)
    .setLatLng(tweet.geo.coordinates)
    .addTo(map)
    popups.push(popup)
  }
}


function updateSocket(){
  window.history.pushState("Twitter Trax","Twitter Trax","?bounds=["+map.getBounds().toBBoxString()+"]")
  if(socket){
    var json = JSON.stringify({query: {bounds: map.getBounds().toBBoxString(),search: $('#search').val()}})
    socket.emit("recenter",json)
  }
}
function startSocket(){
  var json = {"bounds": map.getBounds().toBBoxString(),"search": $('#search').val()}
  socket = io.connect('', {query: json })
  socket.on('stream', function(tweet){
    addPoint(tweet)
  })
  socket.on('reconnect',function(){
    updateSocket()
  })
}
