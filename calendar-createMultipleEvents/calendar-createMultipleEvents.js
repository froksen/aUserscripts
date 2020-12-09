(function() {
    'use strict';
    var dialog;

    var eventsToCreate = {};

    //When pop is present
    waitForKeyElements (
    ".calendar-toolbar",
    addButtons
    );

    function createDialog()
    {
      $("head").append('<style>.ui-dialog{background-color: #e9eef1;font-size:14px;z-index:10} .ui-widget-header{background-color: #2091a2; font-size:14px; text-transform: uppercase; font-weight: bold}</style>');

      
      //Opretter dialogen
      $("main").append('<div id="settings-dialog" title="Masseoprettelse"><br></div>');

      //Upload området
      $("#settings-dialog").append('<label for="uploadedFile">Upload din CSV-fil</label><br>');
      $("#settings-dialog").append('<input id="uploadedFile" type="file"><br>');

        //Dialog indstillinger
        dialog = $( "#settings-dialog" ).dialog({
          autoOpen: false,
          height: 200,
          width: 450,
          draggable: false,
          modal: true,
          buttons: {
              "Masseopret": readCSV,
              Cancel: function() {
                  dialog.dialog( "close" );
              }
          }
      });

      $(".ui-dialog-titlebar-close").remove();

      $("head").append('<link rel="stylesheet" type="text/css" href="http://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">');

      dialog.dialog( "open" );

      
    }
    //Adds export btn to popup
   function addButtons()
    {
      console.log("YEA");
     $( ".navbar-nav" ).append('<li id="sDialogButton" class="nav-item mr-4"><button  data-v-648179ab="" type="button" class="btn tool-link btn-link"><i  data-v-648179ab="" class="icon icon-Aula_plus in-circle"></i>Masseopret begivenheder</button> <!----></li>' );

     createDialog();
    }

    //ORG FROM: https://stackoverflow.com/questions/29393064/reading-in-a-local-csv-file-in-javascript
    function readCSV()
    {
      var fileInput = document.getElementById("uploadedFile"),

      reader = new FileReader();
        reader.onload = function () {
            console.log(reader.result);
        };
        // start reading the file. When it is done, calls the onload event defined above.
      reader.readAsBinaryString(fileInput.files[0]);
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