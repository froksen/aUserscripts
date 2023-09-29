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
      console.log("CLICK");

      //var xhttp = new XMLHttpRequest();
      //xmlhttp.open('GET', 'process.php?users=' + encodeURIComponent(users) + '&messege=' + encodeURIComponent(messege), true);

      var response_data;

      const queryString = window.location.search;
console.log( window.location.href);
console.log(window.location.href.split("https://www.aula.dk/portal/#/kalender/begivenhed/"))

      var event_id = window.location.href.split("https://www.aula.dk/portal/#/kalender/begivenhed/")[1];

      GM_xmlhttpRequest ( {
        method:     "GET",
        url:        "https://www.aula.dk/api/v17/?method=calendar.getEventById&eventId="+event_id,
        data:       null,//"image64=" + encodeURIComponent (img64),
        headers:    {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload:     function (response) {
            console.log ("gut response");
            console.log(response);

            //Sikre, at der er positivt respons på forespørgslen
            if (this.readyState == 4) {
              if (this.status == 200 ) {
                
                //Laver respons om til JSON
                var response_json = JSON.parse(this.responseText)
                console.log(response_json)
    
                //Hvis statuskoden er 0, da er alt godt.
                if (response_json["status"]["code"] == 0) {
                  console.log("SUCCESSFULL")
                  
                  response_data = response_json["data"];
                  createICS(response_data);
                  //response_json["status"]["message"]
                }
                else {
                  console.log("Unsuccessful")
                  response_json["status"]["message"]
                  return;
                }
              }
            }

          }
        } );
        
         
     })
    }

    function createICS(response_data)
    {
      var startDate = getEventDates(response_data["startDateTime"]);
         var endDate = getEventDates(response_data["endDateTime"]);
         var startTime = getEventTime(response_data["startDateTime"]);
         var endTime = getEventTime(response_data["endDateTime"]);
         var title = response_data["title"];
         var invited = getInvited(response_data["invitees"]);

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
         console.log("START DATE/TIME: " + startDate + " kl." + startTime);
         console.log("END DATE/TIME: " + endDate + " kl."+ endTime);
         console.log("Participants");
         console.log(invited[0]);
         console.log(invited[1]);
         console.log(invited[2]);
         console.log("**********************************");


         var cal = ics();
         cal.addEvent(title, datetime + "\\n Inviterede: " + invited + "\\n\\n Link til AULA begivenheden:" + window.location.href, "", startDate + "Z" + " " + startTime, endDate + " " + endTime + "Z");
         //cal.addEvent('New Years', 'Watch the ball drop!', 'New York', '01/01/2016', '01/01/2016');
         cal.download(title);
    }

    function getEventDateTime(aula_json_string)
    {
      var day;
      var month;
      var year;
      var hour;
      var minute;
      var seconds;
    }

    //Gets the events title from Popup
    function getEventTitle()
    {
        return $(".popover-header-text").text().trim();
    }

    //Gets the Event time (Start and end)
    function getEventTime(aula_date_time)
    {
      //"2023-09-12T10:55:00+00:00"
      console.log("OPRINDELIG");
      console.log(aula_date_time);

      var tSplit_full_time = aula_date_time.split("T") //Skulle give 10:55:00+00:00
      var time_without_timezone = tSplit_full_time[1].split("+")[0] //Skulle give 10:55:00

      return time_without_timezone

      return;
        var contentText = $(".popover-main-content").text();
        //const regex = RegExp('\s*Kl.\s\d\d:\d\d\s-\s\d\d:\d\d'); //Should work, but doesnt - TODO.
        var timestamp = false;

        //Goes through every line, and finds if the line contains timestamp
        var lines = contentText.split("\n");
        $.each(lines, function(n, elem) {
            elem = elem.toString().trim();
            console.log(n.toString() + " " + elem);
            //If line starts with Kl. then timestamp
            if(elem.toString().trim().startsWith("Kl."))
            {
                timestamp = elem.toString().trim();
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

    function getEventDates(aula_date_time)
    {
      //"2023-09-12T10:55:00+00:00"

      var date_with_out_time = aula_date_time.split("T")[0] //Skulle give 2023-09-12

      return date_with_out_time


      return;
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

    function getInvited(invities_list)
    {
      var all_invited = ""
       $.each(invities_list, function(n, elem){
          var new_item = elem["instProfile"]["fullName"];
          all_invited = all_invited + new_item + ",";
       }); 

       return all_invited 
      
      return;
      var startPos = $(".popover-content");
        var rows = startPos.find("div.row");
        var participating = rows.eq(0).text().replace("Deltagere","").trim();
        var not_participating = rows.eq(1).text().replace("Deltager ikke","").trim();
        var not_responed = rows.eq(2).text().replace("Mangler svar","").trim();

        return [participating,not_participating,not_responed];
    }

})();