var debugMode = true;

(function() {
    'use strict';

    //Afventer popup fra begivenhed
    waitForKeyElements (
        ".popover-header-text",
        addPopupColorButtons
        );

    //Venter på elementet bliver synligt, og når synligt afvikler funktionen
    waitForKeyElements(".fc-event.event,.fc-event.lesson",highlightActivity);

    function updateEventColors(event_id,color) {
        var events = GM_getValue("event_info",new Object())

        console.log("Updating colours")
        console.log(event_id)
        console.log(color)

        var event_exists = false
        if(event_id in events){
            event_exists = true
        } 

        events[event_id] = {
            "color": color
        }

        console.log(events)

        GM_setValue("event_info",events);
    }

    function getEventColor(event_id)
    {
        var events = GM_getValue("event_info",new Object())


        //Sikre at elementet findes. Hvis det findes retuneres farven.
        if (typeof events[event_id] !== "undefined")
        {
            return events[event_id]["color"]
        }

        return false
    }

    function getEventId()
    {
        var url      = window.location.href;
        console.log(url);
        var urlsplit = url.split("/")
        
        return urlsplit[urlsplit.length-1]
    }

    function addPopupColorButtons()
    {
        $( ".popover-footer" ).append('<button id="colorpickerGreen" type="button" class="btn btn-link btn-sm"><a aria-label="GRØN" class="button-text"><i class="icon-Aula_note"></i> GRØN</a></button>') 
        $( ".popover-footer" ).append('<button id="colorpickerYellow" type="button" class="btn btn-link btn-sm"><a aria-label="GUL" class="button-text"><i class="icon-Aula_note"></i> GUL</a></button>') 
        $( ".popover-footer" ).append('<button id="colorpickerRed" type="button" class="btn btn-link btn-sm"><a aria-label="RØD" class="button-text"><i class="icon-Aula_note"></i> RØD</a></button>') 


        $("#colorpickerGreen").click(function(){
            updateEventColors(getEventId(),"green!important")
            updateElementColor(getEventId())
        })

        $("#colorpickerYellow").click(function(){
            updateEventColors(getEventId(),"yellow!important")
            updateElementColor(getEventId())
        })

        $("#colorpickerRed").click(function(){
            updateEventColors(getEventId(),"red!important")
            updateElementColor(getEventId())
        })
    }

    function updateElementColor(event_id)
    {
        

        var event_color = getEventColor(event_id)
        var previous_style = $("a#"+event_id).attr("style")
        var new_style = previous_style + ";background-color: " + event_color
        $("a#"+event_id).attr("style",new_style);

    }

    function highlightActivity(node){
        var event = node[0];
        var event_title = event.innerText;
        var event_id = event.id;
        



        console.log("----------------------")
        console.log(node)
        console.log(event_title);
        console.log(event_id);

        updateElementColor(event_id)


 

        console.log("----------------------")

    }

})();