var debugMode = true;

(function() {
    'use strict';

   /* if(window.location.href == "https://www.aula.dk/portal/#/beskeder/opret")
    {
        return;
    }*/

    //Venter på elementet bliver synligt, og når synligt afvikler funktionen
    waitForKeyElements(".aula-profile-container",highlightActivity);

    function highlightActivity()
    {

        setTimeout(
            function(){
                //Finds all user profiles
                $(".aula-profile-container").find(".aula-contact-info-container").each(function( person_index ) {
                var hasCustody = false;

                
                //In every profile, go through every info
                $(this).find('div.col').each(function(info_index){

                    //If info-line starts with "Har forældremyndighed"
                    if ($(this).text().trim().match("^Har forældremyndighed:")) {

                        //Information about last activity
                        var custodyInformation = $(this).text().split(":")[1].trim();
                        console.log(custodyInformation);

                        //TODO: Fix so it can handle change of year. Unable to do as long no year is provided by AULA. 
                        if(custodyInformation.toLowerCase() == "ja")
                        {
                            hasCustody = true;
                            //$(this).css('background-color:green');
                        }
                        else
                        {
                            //$(this).css('background-color:red');
                            $('<span id="" style="background-color:red"><b>OBS:</b> Personen har ikke forældremyndighed</span><br>').insertAfter($(this));
                        }


                     }

                })

                })


              },2000);
    }

})();