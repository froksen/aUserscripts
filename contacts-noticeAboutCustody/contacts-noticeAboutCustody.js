var debugMode = true;

(function() {
    'use strict';

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

                        
                        var custodyInformation = $(this).text().split(":")[1].trim();
                        console.log(custodyInformation);

                        
                        if(custodyInformation.toLowerCase() == "ja")
                        {
                            hasCustody = true;
                        }
                     }
                })

                //Print out information to user. 
                if(!hasCustody)
                {
                    $(this).append('<span id="" style="background-color:yellow"><b>OBS:</b> Personen har ikke forældremyndighed!</span><br>');

                }

                    //console.log( index + ": " + $( this ).text() );
                })
              },2000);
    }

})();