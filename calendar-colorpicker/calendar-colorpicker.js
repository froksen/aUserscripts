var debugMode = false;

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

        if(debugMode){
            console.log("Updating colours")
            console.log(event_id)
            console.log(color)
        }


        var event_exists = false
        if(event_id in events){
            event_exists = true
        } 

        events[event_id] = {
            "color": color
        }


        GM_setValue("event_info",events);
    }

    function removeEventColor(event_id)
    {
        var events = GM_getValue("event_info",new Object())

        //Sikre at elementet findes.
        if (typeof events[event_id] !== "undefined")
        {
            if(debugMode)
            {
                console.log("Event found, and colour reset")
            }
            delete events[event_id]


            var previous_style = $("a#"+event_id).attr("style")
            var bgColor = $("a#"+event_id).css( "background-color" );

            var new_style = previous_style + ";background: " +bgColor+ "!important"
            $("a#"+event_id).attr("style",new_style);


            $( ".popover-header" ).attr("style","background: linear-gradient(135deg, rgb(0, 122, 141) 50%, rgb(0, 122, 141) 50%)!important;")

            GM_setValue("event_info",events);
            
            return true
        }
        return false
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
        if(debugMode)
        {
            console.log(url);
        }
        var urlsplit = url.split("/")
        
        return urlsplit[urlsplit.length-1]
    }

    function updatePopupHeaderColor(color)
    {
        var bgColor = "rgb(0, 122, 141)"
        var previous_style = $( ".popover-header" ).attr("style")

        if(color == "yellow")
        {
            $(".popover-header-text").attr("style","color: black")
        }
        else
        {
            $(".popover-header-text").attr("style","color: white")
        }

        var new_style = previous_style + ";background: linear-gradient(135deg, "+color+" 50%, "+bgColor+" 50%)!important"

        $( ".popover-header" ).attr("style",new_style)
    }

    function addPopupColorButtons()
    {
        updatePopupHeaderColor(getEventColor(getEventId()))

        $( ".popover-header" ).append('<button id="colorpickerGreen" type="button" class="btn btn-link btn-sm"><a aria-label="GRØN" style="background-color:green; color:white; padding-right: 2px" class="button-text"><i class="icon-Aula_note"></i> GRØN</a></button>') 
        $( ".popover-header" ).append('<button id="colorpickerYellow" type="button" class="btn btn-link btn-sm"><a aria-label="GUL" style="background-color:yellow; color:black; padding-right: 2px" class="button-text"><i class="icon-Aula_note"></i> GUL</a></button>') 
        $( ".popover-header" ).append('<button id="colorpickerRed" type="button"  class="btn btn-link btn-sm"><a aria-label="RØD" style="background-color:red; color:white; padding-right: 2px" class="button-text"><i class="icon-Aula_note"></i> RØD</a></button>') 
        $( ".popover-header" ).append('<button id="colorpickerReset" type="button"  class="btn btn-link btn-sm"><a aria-label="NULSTIL FARVE" style="color:black; background-color: rgba(255, 255, 255, 0.5);padding-right: 2px" class="button-text"><i class="icon-Aula_note"></i> NULSTIL FARVE</a></button>') 

        $("#colorpickerReset").click(function(){
            //updateEventColors(getEventId(),"transparent")
            //updateElementColor(getEventId())
            removeEventColor(getEventId())
        })

        $("#colorpickerGreen").click(function(){
            updateEventColors(getEventId(),"green")
            updateElementColor(getEventId())
            updatePopupHeaderColor(getEventColor(getEventId()))
        })

        $("#colorpickerYellow").click(function(){
            updateEventColors(getEventId(),"yellow")
            updateElementColor(getEventId())
            updatePopupHeaderColor(getEventColor(getEventId()))
        })

        $("#colorpickerRed").click(function(){
            updateEventColors(getEventId(),"red")
            updateElementColor(getEventId())
            updatePopupHeaderColor(getEventColor(getEventId()))
        })
    }

    function updateElementColor(event_id)
    {
        var event_color = getEventColor(event_id)

        //For at kunne håndtere tidligere måde, at give farve på
        event_color = event_color.toString().replace("!important","")

        var previous_style = $("a#"+event_id).attr("style")
        var bgColor = $("a#"+event_id).css( "background-color" );
        var new_style = previous_style + ";background: " + "linear-gradient(135deg, "+event_color+" 100%, "+bgColor+" 0%)!important;"
        $("a#"+event_id).attr("style",new_style);

    }

    function highlightActivity(node){
        var event = node[0];
        var event_title = event.innerText;
        var event_id = event.id;
        


        if(debugMode)
        {
            console.log("----------------------")
            console.log(node)
            console.log(event_title);
            console.log(event_id);
            console.log("----------------------")
        }


        updateElementColor(event_id)


 


    }

})();