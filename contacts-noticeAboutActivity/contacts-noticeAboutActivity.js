var debugMode = true;

(function() {
    'use strict';

   /* if(window.location.href == "https://www.aula.dk/portal/#/beskeder/opret")
    {
        return;
    }*/

    //Venter på elementet bliver synligt, og når synligt afvikler funktionen
    waitForKeyElements(".contact-info-title",highlightActivity);

    function highlightActivity()
    {
        setTimeout(
            function(){
                //Finds all user profiles
                $(".aula-profile-container").find(".aula-contact-info-container").each(function( person_index ) {
                var lastActivityIsTooLongAgo = true;

                
                //In every profile, go through every info
                $(this).find('div.col').each(function(info_index){

                    //If info-line starts with "seneste aktivitet"
                    if ($(this).text().trim().match("^Seneste aktivitet:")) {

                        //Information about last activity
                        var lastActivity = $(this).text().trim().split(":")[1];
                        var lastActivityDay = lastActivity.split(" ")[1].replace(".","").trim();
                        var lastActivityMonth = lastActivity.split(" ")[2];

                        //AULA MonthNames
                        var monthNames = ["jan.","feb.","mar.", "apr.","maj", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "dec."];
                        
                        //Gets current date
                        var currentDate = new Date();
                        var date2 = new Date(currentDate.getFullYear(),lastActivityMonth-1,lastActivityDay,0,0,0);

                        // To calculate the time difference of two dates
                        var Difference_In_Time = date2.getTime() - date1.getTime();
                        
                        // To calculate the no. of days between two dates
                        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

                        //Finds diff
                        //var dateDiff = currentDate.getMonth() - monthNames.indexOf(lastActivityMonth);
                        /*console.log(lastActivity);
                        console.log(lastActivityDay);
                        console.log(lastActivityDay - currentDate.getDate());
                        console.log(lastActivityMonth);
                        console.log(currentDate.getMonth());
                        console.log(monthNames.indexOf(lastActivityMonth));*/
                        
                        //TODO: Fix so it can handle change of year. Unable to do as long no year is provided by AULA. 
                        if(Difference_In_Days >= 14)
                        //if(currentDate.getMonth() == monthNames.indexOf(lastActivityMonth))
                        //{
                         //   lastActivityIsTooLongAgo = false;
                        //}
                     }

                })

                //Print out information to user. 
                if(lastActivityIsTooLongAgo)
                {
                   // console.log("Det er mere end 2 mdr siden personen var på AULA.");
                   $(('<span id="" style="background-color:yellow"><b>OBS:</b> Det er mere end 14 dage siden samarbejdspartneren har været aktiv på AULA.</span><br>')).insertBefore($(this).prev());
                    //$(this).append('<span id="" style="background-color:yellow"><b>OBS:</b> Det er mere end 1 måned siden samarbejdspartneren har været aktiv på AULA.</span><br>');

                }

                    //console.log( index + ": " + $( this ).text() );
                })
              },2000);
    }

})();