var debugMode = false;

(function() {
    'use strict';

    //Venter på elementet bliver synligt, og når synligt afvikler funktionen
    waitForKeyElements(".subject-sent-to",clickDownarrow);


    function clickDownarrow(jNode)
    {
        //Trykker på pilen ned, så alle vises
        jNode.find('.icon-Aula_down-arrow').trigger( "click" );

        waitForKeyElements(".subscriber",highlightEksternal);

        if(debugMode)
        {
            console.log(".subject-sent-to EXPAND");
        }

        setTimeout(function(){
          clickUparrow();
       }, 500);

    }

    function clickUparrow()
    {
        if(debugMode)
        {
            console.log(".subject-sent-to COLLAPSE");
        }

        $(".subject-sent-to").find('.icon-Aula_up-arrow').trigger( "click" );

    }


    function addNote(jNode)
    {
        if($("#hasExternalNote").length)
        {
            return;
        }

        jNode.append("<br>");
        jNode.append('<span id="hasExternalNote" style="background-color:yellow"><b>OBS:</b> Beskedtråden indeholder eksterne samarbejdspartnere f.eks. forældre eller elever.</span>');

      //jNode.css("background-color", "yellow");
    }

    function highlightEksternal(jNode)
    {

        var externalFound = false;
        $( ".subscriber" ).each(function() {
            var subscriber = $( this ).text();
            var subscriberName = subscriber.split("(")[0].replace(")","")
            var subscriberTitles = subscriber.split("(")[1].replace(")",""); //Første filter. finder alt i parentensen. EKS: SOFUS NIELSEN (LÆRER - DYBBØL-SKOLEN), da vælges LÆRER - DYBBØL-SKOLEN
            subscriberTitles = subscriberTitles.split("-")[0].replace(/\s+/g, ''); //Vælg den tekst der står før bindestreg EKS: LÆRER - DYBBØL-SKOLEN, da vælges LÆRER


            var isExternal = true;
             //OBS: Bemærk, at der må ikke være mellemrum i stillingsbetegnelser f.eks. afd.<mellemrum>leder = afd.leder
             //Stillingsbetegnelser skal være skrevet med småt (lowercase)
            var internalTitles = ['sfo','tab','fysioterapeut','pædagogmedhjælper','skolepædagog','afdelingsleder',"lærer", "medarbejder", "leder",'pædagog',"ledelse",'teknisk/praktisk','lærervikar','vikar','afd.leder','skolesekretær','souschef','TAP','skoleleder','pædagogisk','pædagogiskassistent'];

            var subscriberTitles_split = subscriberTitles.toLowerCase().split(",");

            $.each(subscriberTitles_split, function(n, sTitle) {
                if(internalTitles.includes(sTitle.toLowerCase()))
                {
                    isExternal = false;
                }
            });




           if(isExternal)
           {
               $( this ).css("background-color", "yellow");
                   addNote($(".subject-sent-to"));
           }

            if(debugMode)
            {
                console.log("-------------");
                console.log("SUBSCRIBER: " + subscriber);
                console.log("SUBSCRIBERNAME: " + subscriberName);
                console.log("SUBSCRIBERTITLE: " + subscriberTitles);
                console.log("IS EXTERNAL: " + isExternal);
                console.log("-------------");
            }


       });
    }

    // Your code here...
})();