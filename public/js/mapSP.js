
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style:'mapbox://styles/mapbox/dark-v10' , // style URL
center: restaurant.geometry.coordinates, // starting position [lng, lat]
zoom: 10,// starting zoom

});

new mapboxgl.Marker({
    color: "#FFFF00"
}).setLngLat(restaurant.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({className: "popup" , offset:25})
    .setHTML(
        `<h3>${restaurant.title}</h3>`
    )
)
    .addTo(map);


map.setData(restaurant.geometry.coordinates);