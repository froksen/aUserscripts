
(function() {
    'use strict';
    var currentRow = 1;
    var groupsInfo = [];

    var debug = false;


    setTimeout(function(){
          //handleTablerows();
        $(".administration-toolbar").append('<button id="exportGroupData">Eksporter til CSV</button>');

        $("#exportGroupData").on("click",function(){
           handleTablerows();
        });
       }, 5000);

    function findTablerows()
    {
      var rows = $(".administration-main-content").find('table tr');
      return rows;
    }

    function closeGroupdialog()
    {
      $(".icon-Aula_close").click();
        console.log("closeGroupdialog");

        setTimeout(function(){
            nextTablerow();
        }, 1000);

    }

    function clickTablerow(row)
    {
        if(debug)
        {
            console.log("clickTablerow");
        }

        row.click();

        if(debug)
        {
            console.log("clickTablerow - WAITING FOR CLOSE ICON");
        }

        if(debug)
        {
            setTimeout(function(){
                analyseGroupInformation();
            }, 2500);
        }
        else
        {
            setTimeout(function(){
                analyseGroupInformation();
            }, 1000);
        }
    }

    function nextTablerow()
    {
        if(debug)
        {
            console.log("nextTableRow - INDEX: " + currentRow + "/" + findTablerows().length);
        }
        if(currentRow<findTablerows().length)
        {
          var nextRow = findTablerows()[currentRow++];
            clickTablerow(nextRow);
        }
        else
        {
            exportDataToCSV();
            console.log("COMPLETED!");
            //return false;
        }
    }

    function analyseGroupInformation()
    {
        if(debug)
        {
            console.log("analyseGroupInformation");
        }

       var groupName = $("#group-name").val();

       var members = [];
       $("#group-existing-members > span").each(function(){
          members.push($(this).text());
       })


        var editors = [];
       $("#group-administrator").find("span.el-select__tags-text").each(function(){
          editors.push($(this).text());
       })

        var groupInformation = new Object();

        groupInformation = {
            groupName: groupName,
            members: members,
            editors: editors
        };

        console.log(groupInformation);

      groupsInfo.push(groupInformation);


        setTimeout(function(){
            closeGroupdialog();
       }, 2500);
    }

    function handleTablerows()
    {
        console.log("Starting up");

        nextTablerow();
    }

function getName(text_string)
    {
        var split = text_string.split("(");
        var name = split[0];

        return name;
    }

function getTitle(text_string)
    {
        var split = text_string.split("(");
        var text_in_parentheses = split[1].replace(")","");

        var title = text_in_parentheses.split("-")[0];

        return title;
    }

function exportDataToCSV()
    {
        console.log("EXPORTING CSV");

        var text;
        var i;
        text = "Gruppenavn;Navn;Titel;Medlemstype" + "\n";
        for (i = 0; i < groupsInfo.length; i++) {
            var groupName = groupsInfo[i].groupName;
            var membersText;
            var editorsText;
            var j;

            if(debug)
            {
             console.log("Adding MEMBERS from GROUP: " + groupName);
            }
            for (j = 0; j < groupsInfo[i].members.length; j++) {
                membersText = groupName + ";" + getName(groupsInfo[i].members[j])  + ";" + getTitle(groupsInfo[i].members[j]) + ";" + "medlem"+ "\n";

                if(debug)
                {
                    console.log("ADDING MEMBER: " + membersText);
                }

                text += membersText;
            }


            if(debug)
            {
             console.log("Adding EDITORS from GROUP: " + groupName);
            }
            for (j = 0; j < groupsInfo[i].editors.length; j++) {
                editorsText = groupName + ";" + getName(groupsInfo[i].members[j])  + ";" + getTitle(groupsInfo[i].members[j]) + ";" + "redaktør"+ "\n";

                text += editorsText;

                if(debug)
                {
                    console.log(editorsText);
                }
            }


            //text += groupsInfo[i].groupName + ";" + groupsInfo[i].members + ";" + groupsInfo[i].editors + "\n";
        }

        var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "aula_data.csv");

    }




})();