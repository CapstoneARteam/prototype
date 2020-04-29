var map = L.map('map').fitWorld();

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.locate({ setView: true, maxZoom: 16 });

var latlng = null;
function onMapClick(e)
{
    const modal = document.getElementById("pin_form");
    modal.style.display = modal.style.display !== "block"? "block": "none";
    latlng = e.latlng;
}
map.on('click',onMapClick);

const modal = document.getElementById("pin_form");
const span = document.getElementsByClassName("close")[0];
const button = document.getElementById("pin_button");
span.onclick = () => modal.style.display = "none";
button.onclick = () => {
    const image = document.getElementById("myImg");
    const file = document.getElementById("upload");
    image.src= URL.createObjectURL(file.files[0]);

    const desc = {
        desc: document.getElementById("description").value,
        hint: document.getElementById("tip_hint").value,
        dest: document.getElementById("destination").value
    }
    L.marker(latlng).addTo(map).bindPopup(`${desc.desc}<br>${desc.hint}<br>${desc.dest}<br><img src='${image.src}'>`);
};
