(function() {
    'use strict';
    var dialog;
    
    //When pop is present
   waitForKeyElements (
    ".aula-search",
    addButtons
    );

    /*waitForKeyElements (
      ".messages-toolbar",
      addMenuButton
      );*/

    function addMenuButton()
    {
      createDialog();


      /*$(".messages-toolbar").find("ul").eq(0).append('<li class="nav-item"><button id="changeFavorits" class="btn large btn-link""><span data-v-8b7c5970="" aria-hidden="true"><i data-v-8b7c5970="" class="icon icon-Aula_settings"></i>Tilpas favoritter</span></button></li>');
      */
     $("label.collapsible").prepend('<button id="changeFavorits" class="btn large btn-link"" title="Tilpas Favoritter"><span data-v-8b7c5970="" aria-hidden="true"><i data-v-8b7c5970="" class="icon icon-Aula_settings"> </i></span></button>');

      $("#changeFavorits").button().on( "click", function() {
        var farvorits = GM_getValue("aula_user_favorits","fornavnA efternavnA, fornavnB efternavnB");
        $("#favorits_dialog").val(farvorits);
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
      //Checks if element already exists. Makes sure only one instance of this element is present. 
      if ( $( ".collapsible" ).length) {
        console.log(".collapsible already exists. Skipping.")
        return;
      }

      //Lists favorits. Gets from External ressource 
      var savedFavorits =  GM_getValue("aula_user_favorits","fornavnA efternavnA, fornavnB efternavnB").split(","); 

      var favorits = [];
      $.each(savedFavorits, function(index, sfavorit){
        favorits.push(sfavorit);
      });

      //Appends the header for favorits
      $(".aula-search-outer").append('<label class="collapsible">Favoritmodtagere >></label>');

      //Loops through and create each favorits button
      $.each( favorits, function( index, favorit ){
        createFavoritButton(index,favorit);
      });

      //Create Collapse function
      var coll = document.getElementsByClassName("collapsible");
      var i;
      
      for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
          this.classList.toggle("active");

          $("li.favorit").each(function(index, element){
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
      $(".collapsible").click().click();

      //Adds gear/settings icon and dialog
      addMenuButton();

    }

    function createFavoritButton(index,favname){

      //console.log("Creating favButton for " + favname);
      
      //Creating favorit button
      $(".aula-search-outer").append('<ul style="list-style-type:none;"><li class="el-select-group__title favorit" id="fav_'+index.toString()+'">'+favname+'</li></ul>');

      //Adds click event
      $('#fav_'+index.toString()).on("click",function(){
        //console.log(favname + " is clicked");

        insertName(favname);
   
      });
    }


    function insertName(nameToInsert)
    {
      //console.log("Inserting Name " + nameToInsert);
    let TargetInput = document.getElementsByClassName("el-select__input")[0];

    TargetInput.addEventListener('input',function(e){
      if(!e.isTrusted){
          //Mannually triggered
          this.value += e.data;
          //this.focus();

          this.value = e.data;
      }
  }, false);


     let event = new InputEvent('input', {
      bubbles: true,
      cancelable: false,
      data: nameToInsert
    });


    TargetInput.focus();
      setTimeout(function(){
        TargetInput.dispatchEvent(event);
      },100);

      setTimeout(function(){
        $("li.el-select-dropdown__item:first").click();
      },1000);

      /*waitForKeyElements (
        "li.el-select-dropdown__item",
          function(){
            $("li.el-select-dropdown__item:first").click()
          }
        );*/
      
    }

    function createDialog()
    {
      $("head").append('<style>.ui-dialog{background-color: #e9eef1;font-size:14px;z-index:10} .ui-widget-header{background-color: #2091a2; font-size:14px; text-transform: uppercase; font-weight: bold}</style>');

      
      //Opretter dialogen
      $("main").append('<div id="favorits-dialog" title="Favoritter"><br></div>');

      //Upload området
      $("#favorits-dialog").append('<label for="favorits_dialog">Skriv dine favoritter</label><br>');
      $("#favorits-dialog").append('<input id="favorits_dialog" style="width: 100%;" type="text"><br>');
      $("#favorits-dialog").append('<p>SYNTAKS: fornavnA efternavnA, fornavnB efternavnB osv.</p>');

        //Dialog indstillinger
        dialog = $( "#favorits-dialog" ).dialog({
          autoOpen: false,
          height: 200,
          width: 450,
          draggable: false,
          modal: true,
          buttons: {
              "Gem": function(){
                GM_setValue("aula_user_favorits", $("#favorits_dialog").val());
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