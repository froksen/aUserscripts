(function() {
    'use strict';

    //When pop is present
    waitForKeyElements (
    ".popover-header-text",
    addExportButton
    );

    //Adds export btn to popup
   function addExportButton()
    {
     $( ".popover-footer" ).append('<button id="exportIcsBtn" type="button" class="btn btn-link btn-sm"><a aria-label="Eksporter til outlook" class="button-text"><i class="icon-Aula_note"></i> Eksporter til outlook</a></button>' );

     $("#exportIcsBtn").click(function(){
         var dates = getEventDates();
         var timestamps = getEventTime();
         var title = getEventTitle();
         var invited = getInvited();

         var currentdate = new Date();
         var datetime = "Information hentet fra AULA: " + currentdate.getDate() + "/"
         + (currentdate.getMonth()+1)  + "/"
         + currentdate.getFullYear() + " @ "
         + currentdate.getHours() + ":"
         + currentdate.getMinutes() + ":"
         + currentdate.getSeconds();

         //Outputs found data
         console.log("**********************************");
         console.log("-*-*-*FOUND EVENT INFORMATION");
         console.log(datetime)
         console.log("TITLE: " + title);
         console.log("START DATE/TIME: " + dates[0] + " kl." + timestamps[0]);
         console.log("END DATE/TIME: " + dates[1] + " kl."+ timestamps[1]);
         console.log("Participants");
         console.log(invited[0]);
         console.log(invited[1]);
         console.log(invited[2]);
         console.log("**********************************");


         var cal = ics();
         cal.addEvent(title, datetime + "\\n Deltagere: " + invited[0] + "\\n\\n Mangler svar: " + invited[2] + "\\n\\n Deltager ikke: " + invited[1], "", dates[0] + " " + timestamps[0], dates[1] + " " + timestamps[1]);
         //cal.addEvent('New Years', 'Watch the ball drop!', 'New York', '01/01/2016', '01/01/2016');
         cal.download(title);
     })
    }

    //Gets the events title from Popup
    function getEventTitle()
    {
        return $(".popover-header-text").text().trim();
    }

    //Gets the Event time (Start and end)
    function getEventTime()
    {
        var contentText = $(".popover-main-content").text();
        //const regex = RegExp('\s*Kl.\s\d\d:\d\d\s-\s\d\d:\d\d'); //Should work, but doesnt - TODO.
        var timestamp = false;

        //Goes through every line, and finds if the line contains timestamp
        var lines = contentText.split("\n");
        $.each(lines, function(n, elem) {
            elem = elem.trim();
            console.log(n.toString() + " " + elem);
            //If line starts with Kl. then timestamp
            if(elem.startsWith("Kl."))
            {
                timestamp = elem;
                console.log("Timestamp found in line nr " + n.toString() + " containing: " + elem);
            }
          });

        //If timestamp is found, then analyse
         if(timestamp != false)
         {
           //Template: Kl. 10:00 - 10:45
             var tSplit = timestamp.replace("Kl.","").split("-");
             var startTime = tSplit[0].trim();
             var endTime = tSplit[1].trim();

             console.log("Event starttime: " + startTime);
             console.log("Event endtime: " + endTime);

             timestamp = [startTime,endTime];
         }

        //Returns timestamp or false if not found.
        return timestamp;
    }

    function fromAulaDateToISO(aulaDateString)
    {
      var words = aulaDateString.split(" ");
      var monthNames = ["jan.","feb.","mar.", "apr.","maj", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "dec."];

      var month = false;
      var day = false;
      var year = false;

      $.each(words, function(n, word) {

          console.log(n.toString() + " " + word);
          if(monthNames.includes(word))
          {
             month = monthNames.indexOf(word) + 1;
             month = month.toString();
             console.log("Month found " + word + " is number " + month);
          }

          if(n == 2)
          {
             day = word.replace(".","").trim();
          }
      });

        var fcHeader = $(".fc-header-toolbar");
        var calendarDateText = fcHeader.find("h2").eq(0).text();
        var mSplit = calendarDateText.split(" ");

        year = mSplit[mSplit.length - 1];

        return year+"/"+month+"/"+day;
    }

    function getEventDates()
    {
        var contentText = $(".popover-main-content").text();
        var dates = false;
        var startDate = "";
        var endDate = "";
        var dayNames = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"];

        //Goes through every line, and finds if the line contains timestamp
        var lines = contentText.split("\n");

        $.each(lines, function(n, elem) {
            elem = elem.trim();

            if(n == 1)
            {
              startDate = elem.trim();
            }

            if(n == 3)
            {
              endDate = elem.replace("-","").trim();
            }
          });

          startDate = fromAulaDateToISO(startDate);
          endDate = fromAulaDateToISO(endDate);

        //Returns timestamp or false if not found.
        return [startDate,endDate];
    }

    function getInvited()
    {
        var startPos = $(".popover-content");
        var rows = startPos.find("div.row");
        var participating = rows.eq(0).text().replace("Deltagere","").trim();
        var not_participating = rows.eq(1).text().replace("Deltager ikke","").trim();
        var not_responed = rows.eq(2).text().replace("Mangler svar","").trim();

        return [participating,not_participating,not_responed];
    }

})();