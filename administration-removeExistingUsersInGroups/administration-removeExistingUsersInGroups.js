(function() {
    'use strict';


    //Venter på elementet bliver synligt, og når synligt afvikler funktionen
    waitForKeyElements("#group-existing-members",add_btn_auto_removeAllUsers);

    //Funktionen der tilføjer knappen
    function add_btn_auto_removeAllUsers (jNode) {
        //console.log(jNode + " FUNDET!");
        $("#group-existing-members > label:first-child").append("  |  ");
        var ckbox = $("#group-existing-members > label:first-child").append('<input type="checkbox" autocomplete="off" class="" value="false" id="checkbox_auto_removeAllUsers"></checkbox>'); // checkbox
        ckbox.append('<label id="checkbox_auto_removeAllUsers_label" for="checkbox_auto_removeAllUsers">Vis ekstra muligheder</label>'); // checkbox lable

        $("#group-existing-members > label:first-child").append('<button id="btn_auto_removeAllUsers" class="btn btn-primary btn-sm" style="background-color: red">Fjern alle brugere </button>'); // Knappen

        //Skjuler knappen som standard
        $("#btn_auto_removeAllUsers").hide();

        //Tilføjer funktionerne til knapperne/checkbox
        addActions();
    }


   function addActions()
    {
        //Knappen
        $("#btn_auto_removeAllUsers" ).click(function() {
        console.log( "Knappen er trykket" );

            let crosses = document.querySelectorAll('.el-icon-close')
            crosses.forEach(btn => btn.click())
        });

        //Checbox
        $("#checkbox_auto_removeAllUsers" ).click(function() {
            console.log( "Checkbox er trykket" );

            //Skjuler checbox og label
            $("#checkbox_auto_removeAllUsers_label").hide();
            $("#checkbox_auto_removeAllUsers").hide();

            //Viser knap.
            $("#btn_auto_removeAllUsers").show();

        });
    }



})();
