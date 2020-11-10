(function() {
    'use strict';

    //When pop is present
    waitForKeyElements (
    ".subscription-functionalities",
    addExportButton
    );

    //Adds export btn to popup
   function addExportButton()
    {
     var navigationPanel = $(".subscription-functionalities");
     var navButtons = navigationPanel.find("ul")[0];
     var remindToOutlookButton = $(".subscription-functionalities > ul").prepend('<li id="remindMeOutlookBtn" type="button" class="nav-item"><a target="_self" href="#" class="nav-link"><i class="menu-icon icon-Aula_calendar"></i> <span data-v-09e530b0="" class="thread-functions">Lav påmindelse</span></a></li>')


     $("#remindMeOutlookBtn").click(function(){
         var postTime = getPostTime();
         var title = getTitle();
         var firstMessage = getMessageBody();
         var author = getMessageAuthor();

         var currentdate = new Date();
         var datetime = "Information hentet fra AULA: " + currentdate.getDate() + "/"
         + (currentdate.getMonth()+1)  + "/"
         + currentdate.getFullYear() + " @ "
         + currentdate.getHours() + ":"
         + currentdate.getMinutes() + ":"
         + currentdate.getSeconds();

         var startDate = new Date();
         //var startDate = startDate.setMinutes(startDate.getMinutes + 30);

         var startDateText = startDate.getMonth() +1 + "/"
         + (startDate.getDate())  + "/"
         + startDate.getFullYear() + "  "
         + startDate.getHours() + ":"
         + startDate.getMinutes() + ":"
         + startDate.getSeconds();

         var endDate = new Date();
        // endDate.setMinutes(endDate.getMinutes + 45);

         var endDateText = endDate.getMonth() +1 + "/"
         + (endDate.getDate())  + "/"
         + endDate.getFullYear() + "  "
         + endDate.getHours() + ":"
         + endDate.getMinutes() + ":"
         + endDate.getSeconds();

         //Outputs found data
         console.log("**********************************");
         console.log("-*-*-*FOUND EVENT INFORMATION");
         console.log(datetime)
         console.log("TITLE: " + title);
         console.log("AUTHOR: " + author);
        console.log("POSTTIME: " + title);
         console.log("firstMessage: " + firstMessage);
         console.log("**********************************");


         var cal = ics();
         cal.addEvent("AULA-tråd: "+title, datetime + "\\n\\nAULA-samtalen startet: " + postTime + " af " + author + "\\n\\nBesked-adresse: " + window.location.href, "", startDateText, endDateText);
         //cal.addEvent('New Years', 'Watch the ball drop!', 'New York', '01/01/2016', '01/01/2016');
         cal.download(title);
     })
    }

    //Gets the events title from Popup
    function getTitle()
    {
        return $("h1.thread-subject").text().trim();
    }

    function getMessageAuthor()
    {
      return $(".thread-metadata > span.post-time").next("span").text().trim();
    }

    function getPostTime()
    {
      return $(".thread-metadata > span.post-time").text().trim();
    }

    function getMessageBody()
    {
      return $(".message-body").eq(0).text().replace("\r\n","\\n\\n");
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