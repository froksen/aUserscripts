
(function() {
    'use strict';


    //Venter på elementet bliver synligt, og når synligt afvikler funktionen
    waitForKeyElements("#group-administrator",cloneButtons);


    function cloneButtons(jNode)
    {
        //Finder knapperne
       var saveButton = $("button").last();
        var cancelButton = $("button").eq(-2);
        var deleteButton = $("button").eq(-3);
        //console.log(saveButton);
        //console.log(cancelButton);

        //Cloner knapperne
        var deleteClone = deleteButton.clone().prependTo("form");
        var cancelClone = cancelButton.clone().prependTo( "form" );
        var saveClone = saveButton.clone().prependTo( "form" );


        //Knappernes funktioner
        cancelClone.click(function(){
            cancelButton.trigger("click");
        });

        saveClone.click(function(){
            saveButton.trigger("click");
        });

        deleteClone.click(function(){
            deleteButton.trigger("click");
        });

    }

})();
