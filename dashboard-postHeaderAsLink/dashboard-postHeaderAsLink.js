(function() {
    'use strict';
    var dialog;
    


    //When pop is present
   waitForKeyElements (
    "#aula-posts",
    createHeaderLinks
    );

    function createHeaderLinks()
    {
      setTimeout(function(){
        $(".card-body").find(".post-title").each(function( index ) {
          console.log($(this).attr("data-id"));
          console.log( index + ": " + $( this ).text() );

          var postTitle = $( this ).text();
          var dataId = $(this).attr("data-id");
          $(this).html('<a style="color: black;" href="'+"https://www.aula.dk/portal/#/overblik/"+dataId+'">'+postTitle+'</a>');
        });

      }, 1500); 


    }

})();