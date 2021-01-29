var debugMode = true;

(function() {
    'use strict';

    //Venter på elementet bliver synligt, og når synligt afvikler funktionen
    waitForKeyElements(".profile-header",highlightActivity);

    function highlightActivity()
    {

        setTimeout(
            function(){
                var contactsAddresses = new Array();

                //Finds all user profiles
                $(".aula-profile-container").find(".aula-contact-info-container").each(function( person_index ) {
                
                //In every profile, go through every info
                $(this).find('div.col').each(function(info_index){

                    //If line matches regexp (address) then save it to array
                    var str = $(this).text().trim();
                    //var patt = new RegExp(".* \d*,*\d*, \d* .*");
                    
                    if (str.match(/.* \d*,*\d*, \d* .*/g)) {
                        contactsAddresses.push($(this));
                     }

                })

                })
                //Runs the test, and find if any has differnt address
                var hasDifferntAddress = false;
                for (var i = 1; i < contactsAddresses.length; i++) {
                    
                    if(contactsAddresses[i].text() != contactsAddresses[i-1].text())
                    {
                        hasDifferntAddress = true;
                    }
                }

                //Print out information to user. 
                if(hasDifferntAddress)
                {
                    if(!$("#alertDifferentAddresses").length)
                    {
                        $('<span id="alertDifferentAddresses" style="background-color:yellow;width=500px"><b>OBS:</b> En eller flere personer har forskellige adresser!</span><br>').insertAfter(".contact-info-title");
                    }

                }
              },2000);
    }

})();