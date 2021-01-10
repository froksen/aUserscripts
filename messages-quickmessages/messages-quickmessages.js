(function() {
    'use strict';
    var dialog;
    
    //When pop is present
   waitForKeyElements (
    "#message-textarea_ifr",
    addButtons
    );

    waitForKeyElements (
      "#replyMessageBox_ifr",
      addButtons
      );

    /*waitForKeyElements (
      ".messages-toolbar",
      addMenuButton
      );*/

    function addMenuButton()
    {
      createDialog();
      //$(".editor-container").prepend('<label class="collapsibleQuickmessages">Hurtige svar >></label>');

      //$(".messages-toolbar").find("ul").eq(0).append('<li class="nav-item"><button id="changeQuickmessages" class="btn large btn-link""><span data-v-8b7c5970="" aria-hidden="true"><i data-v-8b7c5970="" class="icon icon-Aula_settings"></i>Tilpas Hurtige svar</span></button></li>');
      $(".editor-container").prepend('<button id="changeQuickmessages" class="btn large btn-link"" title="Tilpas hurtige svar"><span data-v-8b7c5970="" aria-hidden="true"><i data-v-8b7c5970="" class="icon icon-Aula_settings"> </i></span></button>');

      $("#changeQuickmessages").button().on( "click", function() {
        var farvorits = GM_getValue("aula_user_quickmessages","Tak for beskeden jeg svarer tilbage hurtigst muligt., Tak for din besked jeg undersøger sagen og vender tilbage.");
        $("#quickmessages_dialog_input").val(farvorits);
        dialog.dialog( "open" );
    });
    
    }

    //Adds export btn to popup
   function addButtons()
    {

      //Create the buttons
      createFavoritsButtons();
      
      
    }

    function createFavoritsButtons()
    {
      //Lists favorits. Gets from External ressource 
      var savedFavorits =  GM_getValue("aula_user_quickmessages","Tak for beskeden jeg svarer tilbage hurtigst muligt., Tak for din besked jeg undersøger sagen og vender tilbage.").split(","); 

      var favorits = [];
      $.each(savedFavorits, function(index, sfavorit){
        favorits.push(sfavorit);
      });

      //Appends the header for favorits
      $(".editor-container").prepend('<label class="collapsibleQuickmessages">Hurtige svar >></label>');


          //$('<label class="collapsibleQuickmessages">Hurtige svar >></label>').insertAfter("message-textarea");

      //Loops through and create each favorits button
      $.each( favorits, function( index, favorit ){
        console.log(favorit);
        createFavoritButton(index,favorit);
      });

      //Create Collapse function
      var coll = document.getElementsByClassName("collapsibleQuickmessages");
      var i;
      
      for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
          this.classList.toggle("active");

          $("li.quickmessage").each(function(index, element){
              var content = element;
            if (content.style.display === "block") {
              content.style.display = "none";
            } else {
              content.style.display = "block";
            }
          })

          
        });
      }

      //Makes sure that favorits are hidden as default
      $(".collapsibleQuickmessages").click().click();

      addMenuButton();
    }

    function createFavoritButton(index,favname){

      //console.log("Creating favButton for " + favname);
      
      //Creating favorit button
      $('<ul style="list-style-type:none;"><li class="el-select-group__title quickmessage" id="quickmessage_'+index.toString()+'">'+favname+'</li></ul>').insertAfter(".collapsibleQuickmessages");

      //Adds click event
      $('#quickmessage_'+index.toString()).on("click",function(){
        //console.log(favname + " is clicked");

        insertName(favname);
   
      });
    }


    function insertName(nameToInsert)
    {
      setTimeout(function(){
          var iFrame = $("#message-textarea_ifr");

          //Hvis det er et "reply", da hedder iframen understående. Dette kan laves pænere!
          if(iFrame.length == 0)
          {
              iFrame = $("#replyMessageBox_ifr");
          }
            //Finder selve tekstfeltet.
            var msgField = iFrame.contents().find("#tinymce");

            var signature = nameToInsert

            //var currrentMsgParagrafs = msgField.find("p");


            //Selve "signaturen". Der kan anvendes almindelig HTML
            msgField.prepend (signature);


            //Fjerner denne standard tekst
            if(iFrame.next().text() == "Skriv her...")
            {
                iFrame.next().remove();
            }

        }, 300);

      
    }

    function createDialog()
    {
      $("head").append('<style>.ui-dialog{background-color: #e9eef1;font-size:14px;z-index:10} .ui-widget-header{background-color: #2091a2; font-size:14px; text-transform: uppercase; font-weight: bold}</style>');

      
      //Opretter dialogen
      $("main").append('<div id="quickmessages_dialog" title="Hurtige svar"><br></div>');

      //Upload området
      $("#quickmessages_dialog").append('<label for="quickmessages_dialog_input">Skriv dine hurtige svar</label><br>');
      $("#quickmessages_dialog").append('<input id="quickmessages_dialog_input" style="width: 100%;" type="text"><br>');
      $("#quickmessages_dialog").append('<p>SYNTAKS: Hurtig svar 1, hurtigt svar 2 osv.</p>');

        //Dialog indstillinger
        dialog = $( "#quickmessages_dialog" ).dialog({
          autoOpen: false,
          height: 200,
          width: 450,
          draggable: false,
          modal: true,
          buttons: {
              "Gem": function(){
                GM_setValue("aula_user_quickmessages", $("#quickmessages_dialog_input").val());
                dialog.dialog( "close" );
              },
              Cancel: function() {
                  dialog.dialog( "close" );
              }
          }
      });

      $(".ui-dialog-titlebar-close").remove();

      $("head").append('<link rel="stylesheet" type="text/css" href="http://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">');

      //dialog.dialog( "open" );

      
    }

})();