
(function() {
    'use strict';
    var dialog;

    //Venter på elementet bliver synligt, og når synligt afvikler funktionen
    waitForKeyElements("#message-textarea_ifr",insertAutomaticSignatureOnNewMessage);
     waitForKeyElements("#replyMessageBox_ifr",insertAutomaticSignatureOnReply);
    waitForKeyElements(".mce-top-part",addToolbarButtons);

    waitForKeyElements(".messages-toolbar",addSignaturButton);


    function addToolbarButtons()
    {
        console.log("RAN");
        //Finder iFrame, som indeholder tekstfeltet
            var iFrame = $("#message-textarea_ifr")
            //Finder selve tekstfeltet.
            var toolbar = $(".mce-top-part");
        console.log(toolbar.length);
        var fbtn = toolbar.find(".mce-btn:first")
        console.log(fbtn.length);

        //laver de to signaturknapper
        var btn1 = fbtn.clone().attr("id","aula_insert_signature1_div").appendTo(fbtn.parent());
        var btn2 = fbtn.clone().attr("id","aula_insert_signature2_div").appendTo(fbtn.parent());

        //Laver nyt id til knapperne
        btn1.find("button:first").attr("id","aula_insert_signature1_btn");
        btn2.find("button:first").attr("id","aula_insert_signature2_btn");

        //s1.attr("aria-label","Indsæt signatur #1");
        //s2.attr("aria-label","Indsæt signatur #1");

        //Ændre ikonet på knapperne
        btn1.find("button:first > i:first").attr("class","icon-Aula_write");
        btn2.find("button:first > i:first").attr("class","icon-Aula_write");

        btn1.button().on( "click", function() {
            console.log("btn1 click");
          insertSignature("aula_user_signature");
        });

        btn2.button().on( "click", function() {
            console.log("btn2 click");
          insertSignature("aula_user_signature2");
        });
    }

    function addSignaturButton(jNode)
    {
        $("head").append('<style>.ui-dialog{background-color: #e9eef1;font-size:14px;z-index:10} .ui-widget-header{background-color: #2091a2; font-size:14px; text-transform: uppercase; font-weight: bold}</style>');


        //Indsætter knappen
        jNode.find("ul").eq(0).append('<li class="nav-item"><button id="changeSignatureButton" class="btn large btn-link""><span data-v-8b7c5970="" aria-hidden="true"><i data-v-8b7c5970="" class="icon icon-Aula_settings"></i>Tilpas beskedsignatur</span></button></li>');

        //Indsætter signatur form
        $("main").append('<div id="signature-settings" title="Tilpas signatur"><br></div>');

        //Signatur #1
        $("#signature-settings").append('<label for="signatureField1">Indtast din signatur #1</label>');
        $("#signature-settings").append('<textarea id="signatureField1" width="100%" rows="4" cols="75"></textarea>');

        //Signatur #2
        $("#signature-settings").append('<label for="signatureField2">Indtast din signatur #2</label>');
        $("#signature-settings").append('<textarea id="signatureField2" width="100%" rows="4" cols="75"></textarea>');

        //Standard signatur ved nye beskeder
        $("#signature-settings").append('<label for="defaultSignature">Vælg standard signatur ved nye beskeder</label>');
         $("#signature-settings").append('<br><select id="defaultSignature">');
          $("#defaultSignature").append('<option value="aula_user_signature">Signatur #1</option>');
          $("#defaultSignature").append('<option value="aula_user_signature2">Signatur #2</option>');
          $("#defaultSignature").append('<option value="aula_user_signatureNone">Ingen</option>');

                //Standard signatur ved svar
        $("#signature-settings").append('<br><br><label for="defaultSignatureOnReply">Vælg standard signatur ved beskedsvar</label>');
         $("#signature-settings").append('<br><select id="defaultSignatureOnReply">');
          $("#defaultSignatureOnReply").append('<option value="aula_user_signature">Signatur #1</option>');
          $("#defaultSignatureOnReply").append('<option value="aula_user_signature2">Signatur #2</option>');
          $("#defaultSignatureOnReply").append('<option value="aula_user_signatureNone">Ingen</option>');

        //Info-tekster
        $("#signature-settings").append('<br><p>OBS: Din signatur slår igennem på nye/næste gang du svarer på beskeder.</p>')

        //Dialog indstillinger
        dialog = $( "#signature-settings" ).dialog({
            autoOpen: false,
            height: 450,
            width: 600,
            draggable: false,
            modal: true,
            buttons: {
                "Gem signatur": saveSignature,
                Cancel: function() {
                    dialog.dialog( "close" );
                }
            }
        });

        $(".ui-dialog-titlebar-close").remove();

        $("head").append('<link rel="stylesheet" type="text/css" href="http://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">');


        $("#changeSignatureButton").button().on( "click", function() {
            var signature = GM_getValue("aula_user_signature", "Venlig Hilsen");
            var signature2 = GM_getValue("aula_user_signature2", "Mvh");
            var signaturedefault = GM_getValue("aula_user_signature_default", "aula_user_signature");
            var signaturedefault_onreply = GM_getValue("aula_user_signature_default_onreply", "aula_user_signature");

            $("#signatureField1").val(signature);
            $("#signatureField2").val(signature2);
            $("#defaultSignature").val(signaturedefault);
            $("#defaultSignatureOnReply").val(signaturedefault_onreply);
            dialog.dialog( "open" );
        });


    }

    function saveSignature()
    {
      //Signatur #1 - af historiske grunde er databasefeltet fortsat uden tal
      GM_setValue("aula_user_signature", $("#signatureField1").val());

      //Signatur #2
      GM_setValue("aula_user_signature2", $("#signatureField2").val());

      //Standard signatur ved nye beskeder
      GM_setValue("aula_user_signature_default", $("#defaultSignature").val());

        //Standard signatur ved nye beskeder
      GM_setValue("aula_user_signature_default_onreply", $("#defaultSignatureOnReply").val());



      dialog.dialog( "close" )
    }

    function insertAutomaticSignatureOnNewMessage(jNode)
    {
        //Så signaturen kun laves ved nye beskeder eller videresendte beskeder.
        if(window.location.href != "https://www.aula.dk/portal/#/beskeder/opret" && window.location.href.indexOf("/beskeder/videresend/") < 0)
        {
            console.log("IKKE NY BESKED ELLER VIDERESENDT BESKED");
            return;
        }

        var defaultsignature = GM_getValue("aula_user_signature_default", "");


        insertSignature(defaultsignature);
    }

    function insertAutomaticSignatureOnReply(jNode)
    {
        //Så signaturen ikke indsættes ved nye beskeder, men kun ved videresendte. 
        if(window.location.href == "https://www.aula.dk/portal/#/beskeder/opret")
        {
            return;
        }

        var defaultsignature = GM_getValue("aula_user_signature_default_onreply", "");


        insertSignature(defaultsignature);
    }

    function insertSignature(signatureToInsert)
    {
        //Venter et antal sekunder før dette gøres, da AULA lige skal loade færdig først.
        setTimeout(function(){
            //Finder iFrame, som indeholder tekstfeltet
            var iFrame = $("#message-textarea_ifr");

            //Hvis det er et "reply", da hedder iframen understående. Dette kan laves pænere!
            if(iFrame.length == 0)
            {
                iFrame = $("#replyMessageBox_ifr");
            }

            //Finder selve tekstfeltet.
            var msgField = iFrame.contents().find("#tinymce");

            var signature = GM_getValue(signatureToInsert, "").replace(/\n/g, "<br>");

            var currrentMsgParagrafs = msgField.find("p");


            //Selve "signaturen". Der kan anvendes almindelig HTML
            msgField.append (signature);


            //Fjerner denne standard tekst
            if(iFrame.next().text() == "Skriv her...")
            {
                iFrame.next().remove();
            }

        }, 300)


        //setTimeout(insertSignature, 3000);
    }

})();