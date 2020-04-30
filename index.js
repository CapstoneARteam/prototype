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
const modal = document.getElementById("pin_form");
const span = document.getElementsByClassName("close")[0];
const button = document.getElementById("pin_button");
const file = document.getElementById("upload");
const image = document.getElementById("myImg");
const audio_button = document.getElementById("audio_button");
const record_button = document.getElementById("record_button");
const stop_button = document.getElementById("stop_button");

var audio_playing = false;
const ad = new Audio("https://www.mboxdrive.com/soul.mp3");

var rec;
var audio_input;
var audio_stream;
var audio_url;


function onMapClick(e)
{
    modal.style.display = modal.style.display !== "block"? "block": "none";
    latlng = e.latlng;
}
map.on('click',onMapClick);

span.onclick = () => modal.style.display = "none";

button.onclick = () => {

    const desc = {
        desc: document.getElementById("description").value,
        hint: document.getElementById("tip_hint").value,
        dest: document.getElementById("destination").value,
        url : audio_url
    }
    L.marker(latlng).addTo(map).bindPopup(`${desc.desc}<br>${desc.hint}<br>${desc.dest}<br><Audio controls=true src=${desc.url}></Audio> <br><img src='${image.src}' style="width: 300px;">`);
    modal.style.display = "none";
};

file.onchange = () => {
    image.src= URL.createObjectURL(file.files[0]);
    image.style.display = "block";
}

audio_button.onclick = () => {
    
    if(audio_playing === false){
        ad.play();
        audio_playing = true;
    }
    else{
        ad.pause();
        audio_playing = false;
    }
}

record_button.onclick = () => {
    record_button.disabled = true;
    stop_button.disabled = false;



    navigator.mediaDevices.getUserMedia({audio: true, video:false}).then(function(stream){
 
        var audioContext = new AudioContext();

        audio_stream = stream;

        audio_input = audioContext.createMediaStreamSource(stream);

        rec = new Recorder(audio_input, {
            numChannels : 1
        });
        rec.record();
    })


}

stop_button.onclick = () => {
    stop_button.disabled = true;
    record_button.disabled = false;
    rec.stop();
    audio_stream.getAudioTracks()[0].stop();

    document.getElementById("recordingsList").innerHTML = "";
    rec.exportWAV(createDownloadLink);
}


// copy pasted from https://blog.addpipe.com/using-recorder-js-to-capture-wav-audio-in-your-html5-web-site/

function createDownloadLink(blob) {
    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');
    //add controls to the <audio> element 
    au.controls = true;
    au.src = url;
    //link the a element to the blob 
    link.href = url;
    link.download = new Date().toISOString() + '.wav';
    link.innerHTML = link.download;
    //add the new audio and a elements to the li element 
    li.appendChild(au);
    li.appendChild(link);
    //add the li element to the ordered list 
    recordingsList.appendChild(li);
    
    audio_url = url;
}