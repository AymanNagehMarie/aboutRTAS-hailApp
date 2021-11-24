var data={
    en:{
      headerAbout:"Hello, this is S'hail! ",
      contentAbout:"<span class='text'>I am your personal travel companion and I can help you to maximize your travelling experience in Dubai .</span>"+
    "<span class='text'>I can plan your trips, provide you with price comparisons, bookings your Taxis, Topup your nol card and provide you with many essential travel information.</span>"+
    "<span class='text'>Ready at your fingertips, I will guide you through a safe and joyful journey. </span>",
      ratingHeader:"Customer Ratings and Feedback. ",
       rating:"Please give us your feedback through Happiness rating and through stores so we understand how much you value the app. ",
      versionHeader:" S'hail application version",
      versionContent:"<span class='detailsContent'>Currently you are using 3.8.3 (227)</span><span>Release date 15-11-2021</span>",
      socailHeader:" RTA on Social Media",
      emergencyHeader:"Emergency Numbers",
      police:"Police & Ambulance",
      fire:"Fire Department"
    },
    ar:{

    }

}
headerAbout=document.getElementById("headerAbout");
contentAbout=document.getElementById("contentAbout");

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}



var lang=getParameterByName("lang");
if(lang){
     switch (lang) {
         case "en":
            headerAbout.innerHTML=data.en.headerAbout;
            contentAbout.innerHTML=data.en.contentAbout;

             break;
     
         default:
             break;
     }



}