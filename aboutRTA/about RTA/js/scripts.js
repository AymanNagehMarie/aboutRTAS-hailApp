window.content={
  "English": {
    "title": "Roads &amp; Transport Authority&nbsp;",
    "header": "Umm Al Ramool, Marakesh Road",
    "pobox": "P.O. Box: 118899",
    "address": "Dubai, United Arab Emirates",
    "chat": "Talk to Mahboub available 24x7",
    "call":"Call"
  },
  "Arabic": {
    "title": "مكتب هيئة الطرق والمواصلات رئيس",
    "header": "أم رمول, شارع مراكش",
    "pobox": "١١٨٨٩٩ صندوق بريد:",
    "address": "دبي، الإمارات",
    "chat": "التحدث إلى محبوب المتاحة 24x7",
    "call": "تواصل معنا"
  },
  Germany:{

  },
  Franch:{

  },
  Spanish:{

  }
}



// Empty JS for your own code to be here

// [START Google Map]
let map;
var marker;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 25.23419543009209, lng: 55.35649426441801}, // RTA HEADQUARTERS
    zoom: 17,
    // InfoWindow: false,
    // zoomControl: false,
  });

  marker = new google.maps.Marker({
    position: {lat: 25.23419543009209, lng: 55.35649426441801},
    map,
    title: 'Click to zoom',
  });

  marker.addListener('click', () => {
    map.setZoom(17);
    map.setCenter(marker.getPosition());
  });
}

// relocate map
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('mainOfficeDiv').addEventListener('click', function (e) {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    map.setZoom(17);
    map.panTo(marker.getPosition());
  });
});

// [END Google Maps]
