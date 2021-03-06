jQuery(document).ready(function($) { 
    // Add Explorer button on main plugin page: when button is clicked, create content for modalAddExplorer         
    $( "#btnAddExplorers" ).click(function() {
        var newcontent;
        $.get(ajaxdata_nonexpusers.ajax_url, {
            _ajax_nonce: ajaxdata_nonexpusers.nonce,
            action: "get_nonexpusers",
        }, function(newdata) {
            newcontent = "\t\t\t\t<form name=\"frmAllExplorers\" id=\"frmAllExplorers\" method=\"POST\" action=\"\">\n";
            newcontent = newcontent + "\t\t\t\t<table class=\"table-sm\">\n";
            // List of explorers goes here from JSON data
            // var nonexpusers = JSON.parse(data);
            if (newdata.expno > 0) {
                if (newdata.ExpTypesNo > 0) {
                    for (var i = 0 ; i < newdata.ExpTypesNo ; i++) {
                        newcontent = newcontent + "\t\t\t\t\t<tr><td><input type=\"radio\" id=\"rdoType" + newdata.ExpTypes[i].TypeID + "\" name=\"rdoType\" value=\"" + newdata.ExpTypes[i].TypeID + "\"";
                        if (newdata.ExpTypeID == newdata.ExpTypes[i].TypeID) newcontent = newcontent + " checked";
                        newcontent = newcontent + "></td><td><label for=\"rdoType" + newdata.ExpTypes[i].TypeID + "\">"  + newdata.ExpTypes[i].Description + "</label></td><tr>\n";
                    }
                } else {
                    newcontent = newcontent + "\t\t<tr><td class=\"text-align-center\">Could not retrieve data from server.</td></tr>\n";
                }
                newcontent = newcontent + "\t\t\t\t<tr><td>From:</td><td><input type=\"date\" id=\"dateFrom\" name=\"dateFrom\"></td></td>\n";   
                for (var i = 0 ; i < newdata.expno ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<tr><td><input type=\"checkbox\" id=\"chk" + newdata.explist[i].id + "\" name=\"chk" + newdata.explist[i].id + "\" value=\"" + newdata.explist[i].id + "\"></td>";
                    newcontent = newcontent + "<td><label for =\"chk" + newdata.explist[i].id + "\">" + newdata.explist[i].display_name + "</label></td></tr>\n";
                }
            } else {
                newcontent = newcontent + "\t\t<tr><td class=\"text-align-center\">There are no explorer records in the database.</td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t</table>\n";
            newcontent = newcontent + "\t\t\t\t</form>\n";
            document.getElementById("modalAddExplorersBody").innerHTML = newcontent;
        });
    });
    // Click handler for explorer list on modalAddExplorer
    $( '#btnSaveExplorers' ).click(function() {
        var i = 0;
        var nonexpform = $("#frmAllExplorers").serializeArray()
        rdoType = document.getElementById("frmAllExplorers")["rdoType"].value;
        var dateFrom = document.getElementById("dateFrom").value;
        $.post(ajaxdata_newexplorers.ajax_url, {
            _ajax_nonce: ajaxdata_newexplorers.nonce,
            action: "save_newexplorers",
            dbdata: nonexpform,
            rdoType: rdoType,
            dateFrom: dateFrom,
        }, function(newdata) {
            alert("Inserted " + newdata.dbrecords + " records.");
            $('#modalAddExplorers').modal('hide');
            window.location.reload();
        });
    });
    $( '#btnCloseExplorers' ).click(function() {
        window.location.reload();
    })
     // Click handler for explorer list on main plugin page: displays an explorer (badges, hikes, NA, etc.)
    $( ".explorer" ).click(function() {
        var newcontent;
        $.get(ajaxdata_getexplorer.ajax_url, {
            _ajax_nonce: ajaxdata_getexplorer.nonce,
            action: "get_explorer",
            ExpID: this.id,
        }, function(newdata) {
            updateExplorerView(newdata);
        });
    });
    $( '#btnExplorerClose' ).click(function() {
        window.location.reload();
    });
    // Edit Status button on modalGetExplorer (edits a single explorer) 
    $( "#btnEditStatus" ).click(function() {
        var ExplorerID = document.getElementById("ExplorerID");
        var ExplorerName = document.getElementById("ExplorerName");
        var expID = ExplorerID.value;
        var expName = ExplorerName.value;

        var newcontent;
        $.get(ajaxdata_getexplorerdata.ajax_url, {
            _ajax_nonce: ajaxdata_getexplorerdata.nonce,
            action: "get_explorerdata",
            actiontype: "EditStatus",
            ExpID: expID,
        }, function(newdata) {
            console.log("callback");
            newcontent = "\t\t\t\t<form name=\"frmExplorerData\" id=\"frmExplorerData\" method=\"POST\" action=\"\">\n";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"UpdateType\" name=\"UpdateType\" value=\"EditStatus\" required>";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"ExplorerID\" name=\"ExplorerID\" value=\"" + expID + "\" required>";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"ExplorerName\" name=\"ExplorerName\" value=\"" + expName + "\" required>";
            newcontent = newcontent + "\t\t\t\t<table class=\"table-sm\">\n";
            if (newdata.ExpStatusNo > 0) {
                for (var i = 0 ; i < newdata.ExpStatusNo ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<tr><td><input type=\"radio\" id=\"rdoStatus" + newdata.ExpStatus[i].StatusID + "\" name=\"rdoStatus\" value=\"" + newdata.ExpStatus[i].StatusID + "\"";
                    if (newdata.ExpStatusID == newdata.ExpStatus[i].StatusID) newcontent = newcontent + " checked";
                    newcontent = newcontent + "></td><td><label for=\"rdoStatus" + newdata.ExpStatus[i].StatusID + "\">"  + newdata.ExpStatus[i].Description + "</label></td><tr>\n";
                }
            } else {
                newcontent = newcontent + "\t\t<tr><td class=\"text-align-center\">Could not retrieve data from server.</td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t</table>\n";
            newcontent = newcontent + "\t\t\t\t</form>\n";
            document.getElementById("modalUpdateExplorerLabel").innerHTML = expName + " (id: " + expID + ")";
            document.getElementById("modalUpdateExplorerBody").innerHTML = newcontent;
        });
    });
    $( "#btnEditLinks" ).click(function() {
        var ExplorerID = document.getElementById("ExplorerID");
        var ExplorerName = document.getElementById("ExplorerName");
        var expID = ExplorerID.value;
        var expName = ExplorerName.value;

        var newcontent;
        $.get(ajaxdata_getexplorerdata.ajax_url, {
            _ajax_nonce: ajaxdata_getexplorerdata.nonce,
            action: "get_explorerdata",
            actiontype: "EditLinks",
            ExpID: expID,
        }, function(newdata) {
            newcontent = "\t\t\t\t<form name=\"frmExplorerData\" id=\"frmExplorerData\" method=\"POST\" action=\"\">\n";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"UpdateType\" name=\"UpdateType\" value=\"EditLinks\" required>";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"ExplorerID\" name=\"ExplorerID\" value=\"" + expID + "\" required>";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"ExplorerName\" name=\"ExplorerName\" value=\"" + expName + "\" required>";
            newcontent = newcontent + "\t\t\t\t<table class=\"table-sm\">\n";
            if (newdata.ParentsNo > 0) {
                newcontent = newcontent + "\t\t\t\t\t<tr><td>Link 1:</td><td><select id=\"selLink1\" name=\"selLink1\" required=\"required\">\n";
                newcontent = newcontent + "\t\t\t\t\t<option value=-1";
                if (newdata.Link1ID == null) newcontent = newcontent + " selected";
                newcontent = newcontent + ">None selected</option>\n";
                for (var i = 0 ; i < newdata.ParentsNo ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<option value=\"" + newdata.Parents[i].ID + "\"";
                    if (newdata.Link1ID == newdata.Parents[i].ID) newcontent = newcontent + " selected";
                    newcontent = newcontent + ">" + newdata.Parents[i].Description; + "</option>\n";
                }
                newcontent = newcontent + "\t\t\t\t\t</select></td></tr>\n";
                newcontent = newcontent + "\t\t\t\t\t<tr><td>Link 2:</td><td><select id=\"selLink2\" name=\"selLink2\" required=\"required\">\n";
                newcontent = newcontent + "\t\t\t\t\t<option value=-1";
                if (newdata.Link2ID == null) newcontent = newcontent + " selected";
                newcontent = newcontent + ">None selected</option>\n";
                for (var i = 0 ; i < newdata.ParentsNo ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<option value=\"" + newdata.Parents[i].ID + "\"";
                    if (newdata.Link2ID == newdata.Parents[i].ID) newcontent = newcontent + " selected";
                    newcontent = newcontent + ">" + newdata.Parents[i].Description; + "</option>\n";
                }
                newcontent = newcontent + "\t\t\t\t\t</select></td></tr>\n";
                newcontent = newcontent + "\t\t\t\t\t<tr><td>Link 3:</td><td><select id=\"selLink3\" name=\"selLink3\" required=\"required\">\n";
                newcontent = newcontent + "\t\t\t\t\t<option value=-1";
                if (newdata.Link3ID == null) newcontent = newcontent + " selected";
                newcontent = newcontent + ">None selected</option>\n";
                for (var i = 0 ; i < newdata.ParentsNo ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<option value=\"" + newdata.Parents[i].ID + "\"";
                    if (newdata.Link3ID == newdata.Parents[i].ID) newcontent = newcontent + " selected";
                    newcontent = newcontent + ">" + newdata.Parents[i].Description; + "</option>\n";
                }
                newcontent = newcontent + "\t\t\t\t\t</select></td></tr>\n";
            } else {
                newcontent = newcontent + "\t\t<tr><td colspan=2 class=\"text-align-center\">Could not retrieve data from server.</td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t</table>\n";
            newcontent = newcontent + "\t\t\t\t</form>\n";
            document.getElementById("modalUpdateExplorerLabel").innerHTML = expName + " (id: " + expID + ")";
            document.getElementById("modalUpdateExplorerBody").innerHTML = newcontent;
        });
    });
    // Edit explorer type button on modalGetExplorer (edits a single explorer)
    $( "#btnEditType" ).click(function() {
        var ExplorerID = document.getElementById("ExplorerID");
        var ExplorerName = document.getElementById("ExplorerName");
        var expID = ExplorerID.value;
        var expName = ExplorerName.value;

        var newcontent;
        $.get(ajaxdata_getexplorerdata.ajax_url, {
            _ajax_nonce: ajaxdata_getexplorerdata.nonce,
            action: "get_explorerdata",
            actiontype: "EditType",
            ExpID: expID,
        }, function(newdata) {
            newcontent = "\t\t\t\t<form name=\"frmExplorerData\" id=\"frmExplorerData\" method=\"POST\" action=\"\">\n";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"UpdateType\" name=\"UpdateType\" value=\"EditType\" required>";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"ExplorerID\" name=\"ExplorerID\" value=\"" + expID + "\" required>";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"ExplorerName\" name=\"ExplorerName\" value=\"" + expName + "\" required>";
            newcontent = newcontent + "\t\t\t\t<table class=\"table-sm\">\n";
            if (newdata.ExpTypesNo > 0) {
                for (var i = 0 ; i < newdata.ExpTypesNo ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<tr><td><input type=\"radio\" id=\"rdoType" + newdata.ExpTypes[i].TypeID + "\" name=\"rdoType\" value=\"" + newdata.ExpTypes[i].TypeID + "\"";
                    if (newdata.ExpTypeID == newdata.ExpTypes[i].TypeID) newcontent = newcontent + " checked";
                    newcontent = newcontent + "></td><td><label for=\"rdoType" + newdata.ExpTypes[i].TypeID + "\">"  + newdata.ExpTypes[i].Description + "</label></td></tr>\n";
                }
            } else {
                newcontent = newcontent + "\t\t<tr><td colspan=2 class=\"text-align-center\">Could not retrieve data from server.</td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t<tr><td>From:</td><td><input type=\"date\" id=\"dateFrom\" name=\"dateFrom\"></td></tr>\n";
            newcontent = newcontent + "\t\t\t\t</table>\n";
            newcontent = newcontent + "\t\t\t\t</form>\n";
            document.getElementById("modalUpdateExplorerLabel").innerHTML = expName + " (id: " + expID + ")";
            document.getElementById("modalUpdateExplorerBody").innerHTML = newcontent;
        });
    });
    // Add Night Away button on modalGetExplorer (adds to single explorer)
    $( "#btnAddNA" ).click(function() {
        var ExplorerID = document.getElementById("ExplorerID");
        var ExplorerName = document.getElementById("ExplorerName");
        var expID = ExplorerID.value;
        var expName = ExplorerName.value;
        newcontent = "\t\t\t\t<form name=\"frmExplorerData\" id=\"frmExplorerData\" method=\"POST\" action=\"\">\n";
        newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"UpdateType\" name=\"UpdateType\" value=\"AddNA\" required>\n";
        newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"ExplorerID\" name=\"ExplorerID\" value=\"" + expID + "\" required>\n";
        newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"ExplorerName\" name=\"ExplorerName\" value=\"" + expName + "\" required>\n";
        newcontent = newcontent + "\t\t\t\t<table class=\"table-sm\">\n";
        newcontent = newcontent + "\t\t\t\t<tr><td>Description:</td><td><input type=\"text\" id=\"txtDescription\" name=\"txtDescription\" size=50 required></td></tr>\n";
        newcontent = newcontent + "\t\t\t\t<tr><td>Location:</td><td><input type=\"text\" id=\"txtLocation\" name=\"txtLocation\" size=50 required></td></tr>\n";
        newcontent = newcontent + "\t\t\t\t<tr><td>No of Nights Away:</td><td><input type=\"text\" id=\"txtDays\" name=\"txtDays\" size=10 required></td></tr>\n";
        newcontent = newcontent + "\t\t\t\t<tr><td>Start:</td><td><input type=\"date\" id=\"dateStart\" name=\"dateStart\" required></td></tr>\n";
        newcontent = newcontent + "\t\t\t\t<tr><td>End:</td><td><input type=\"date\" id=\"dateEnd\" name=\"dateEnd\" required></td></tr>\n";
        newcontent = newcontent + "\t\t\t\t</table>\n";
        newcontent = newcontent + "\t\t\t\t</form>\n";
        document.getElementById("modalUpdateExplorerLabel").innerHTML = expName + " (id: " + expID + ")";
        document.getElementById("modalUpdateExplorerBody").innerHTML = newcontent;
    });
    // Add hike button on modalGetExplorer (adds to single explorer)
    $( "#btnAddHike" ).click(function() {
        var ExplorerID = document.getElementById("ExplorerID");
        var ExplorerName = document.getElementById("ExplorerName");
        var expID = ExplorerID.value;
        var expName = ExplorerName.value;
        newcontent = "\t\t\t\t<form name=\"frmExplorerData\" id=\"frmExplorerData\" method=\"POST\" action=\"\">\n";
        newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"UpdateType\" name=\"UpdateType\" value=\"AddHike\" required=\"required\">\n";
        newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"ExplorerID\" name=\"ExplorerID\" value=\"" + expID + "\" required=\"required\">\n";
        newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"ExplorerName\" name=\"ExplorerName\" value=\"" + expName + "\" required=\"required\">\n";
        newcontent = newcontent + "\t\t\t\t<table class=\"table-sm\">\n";
        newcontent = newcontent + "\t\t\t\t<tr><td>Description:</td><td><input type=\"text\" id=\"txtDescription\" name=\"txtDescription\" size=50 required=\"required\"></td></tr>\n";
        newcontent = newcontent + "\t\t\t\t<tr><td>No of Days:</td><td><input type=\"text\" id=\"txtHikeDays\" name=\"txtHikeDays\" size=10 required=\"required\"></td></tr>\n";
        newcontent = newcontent + "\t\t\t\t<tr><td>Start:</td><td><input type=\"date\" id=\"dateStart\" name=\"dateStart\" required=\"required\"></td></tr>\n";
        newcontent = newcontent + "\t\t\t\t<tr><td>End:</td><td><input type=\"date\" id=\"dateEnd\" name=\"dateEnd\" required=\"required\"></td></tr>\n";
        newcontent = newcontent + "\t\t\t\t</table>\n";
        newcontent = newcontent + "\t\t\t\t</form>\n";
        document.getElementById("modalUpdateExplorerLabel").innerHTML = expName + " (id: " + expID + ")";
        document.getElementById("modalUpdateExplorerBody").innerHTML = newcontent;
    });
    // Add badge button on modalGetExplorer (adds to single explorer)
    $( "#btnAddBadge" ).click(function() {
        var ExplorerID = document.getElementById("ExplorerID");
        var ExplorerName = document.getElementById("ExplorerName");
        var expID = ExplorerID.value;
        var expName = ExplorerName.value;
        // console.log("Edit Type: " + expID);

        var newcontent;
        $.get(ajaxdata_getexplorerdata.ajax_url, {
            _ajax_nonce: ajaxdata_getexplorerdata.nonce,
            action: "get_explorerdata",
            actiontype: "AddBadge",
            ExpID: expID,
        }, function(newdata) {
            // console.log("callback");
            newcontent = "\t\t\t\t<form name=\"frmExplorerData\" id=\"frmExplorerData\" method=\"POST\" action=\"\">\n";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"UpdateType\" name=\"UpdateType\" value=\"AddBadge\" required=\"required\">\n";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"ExplorerID\" name=\"ExplorerID\" value=\"" + expID + "\" required=\"required\">\n";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"ExplorerName\" name=\"ExplorerName\" value=\"" + expName + "\" required=\"required\">\n";
            newcontent = newcontent + "\t\t\t\t<table class=\"table-sm\">\n";
            if (newdata.BadgesNo > 0) {
                newcontent = newcontent + "\t\t\t\t\t<tr><td>Badge:</td><td><select id=\"selBadge\" name=\"selBadge\" class=\"expbadgereqts\" required=\"required\">\n";
                for (var i = 0 ; i < newdata.BadgesNo ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<option value=\"" + newdata.Badges[i].BadgeID + "\">" + newdata.Badges[i].Description + "</option>\n";
                }
                newcontent = newcontent + "\t\t\t\t\t</select></td></tr>\n";
            } else {
                newcontent = newcontent + "\t\t<tr><td colspan=2 class=\"text-align-center\">Could not retrieve data from server.</td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t<tr><td>Req'ts:</td><td name=\"tdBadgeReqts\" id=\"tdBadgeReqts\">Select a badge to load requirements.</td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>Start:</td><td><input type=\"date\" id=\"dateStart\" name=\"dateStart\" required=\"required\"></td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>End:</td><td><input type=\"date\" id=\"dateEnd\" name=\"dateEnd\" required=\"required\"></td></tr>\n";           
            newcontent = newcontent + "\t\t\t\t<tr class=\"align-text-top\"><td>Badge Issued:</td><td>";
            newcontent = newcontent + "<input type=\"radio\" id=\"BadgeNotIssued\" name=\"BadgeIssued\" required=\"required\" value=\"0\" checked> <label for=\"BadgeNotIssued\">Badge not issued to explorer</label>";
            newcontent = newcontent + "<br /><input type=\"radio\" id=\"BadgeIssued\" name=\"BadgeIssued\" required=\"required\" value=\"1\"> <label for=\"BadgeIssued\">Badge issued to explorer</label>";
            newcontent = newcontent + "</td></tr>\n";
            newcontent = newcontent + "\t\t\t\t</table>\n";
            newcontent = newcontent + "\t\t\t\t</form>\n";
            document.getElementById("modalUpdateExplorerLabel").innerHTML = expName + " (id: " + expID + ")";
            document.getElementById("modalUpdateExplorerBody").innerHTML = newcontent;
        });
    });
    // 
    $( "#btnUpdateSave" ).click(function() {
        var i = 0;
        var formdata = $("#frmExplorerData").serializeArray();
        var updatetype = document.getElementById("UpdateType").value;
        $.post(ajaxdata_updateexplorerdata.ajax_url, {
            _ajax_nonce: ajaxdata_updateexplorerdata.nonce,
            action: "update_explorerdata",
            actiontype: updatetype,
            dbdata: formdata,
        }, function(newdata) {
            if (newdata.success == 1) {
                alert("Database succesfully updated.");
                $('#modalUpdateExplorer').modal('hide');
                $('#modalGetExplorer').modal('show');
            } else {
                document.getElementById("modalUpdateExplorerBody").innerHTML = "<h5 class=\"text-align-center\">An error occured: the database was not updated.</h5>\n";
            }
            // REFRESH THE MODAL WINDOW WITH THE UPDATED DATA
            switch (newdata.actiontype) {
                case "AddNA":
                    newcontent = "\t\t\t\t\t\t<table class=\"table\">\n"; 
                    if (newdata.NANo > 0) {
                        for (i = 0 ; i < newdata.ExpNAs.length ; i++)
                        newcontent = newcontent + "\t\t\t\t\t\t<tr><td>" + newdata.ExpNAs[i].Description + " ("+ newdata.ExpNAs[i].NALocation + ": " + newdata.ExpNAs[i].NADays + " night(s) - " + newdata.ExpNAs[i].DateStart + " - " + newdata.ExpNAs[i].DateEnd  + ")</td><tr>";
                    }
                    newcontent = newcontent + "\t\t\t\t\t\t</table>\n";
                    document.getElementById('tdExpNAs').innerHTML = newcontent;
                    break;
                case "AddHike":
                    newcontent = "\t\t\t\t\t<table class=\"table\">\n"; 
                    if (newdata.HikeNo > 0) {
                        for (i = 0 ; i < newdata.ExpHikes.length ; i++)
                        newcontent = newcontent + "\t\t\t\t\t\t<tr><td>" + newdata.ExpHikes[i].Description + " (" + newdata.ExpHikes[i].HikeDays + " hikes: " + newdata.ExpHikes[i].DateStart + " - " + newdata.ExpHikes[i].DateEnd  + ")</td><tr>";
                    }
                    newcontent = newcontent + "\t\t\t\t\t\t</table>\n";
                    document.getElementById('tdExpHikes').innerHTML = newcontent;
                    break;
                case "AddBadge":
                    badgecontent = getExplorerBadgeTable(newdata);
                    document.getElementById('tdExpBadges').innerHTML = badgecontent;
                    break
            } 
        });
    });
    // Add badge button on main plugin page (adds to selected explorers)
    $( "#btnAddEventBadge" ).click(function() {
        var newcontent;
        $.get(ajaxdata_geteventdata.ajax_url, {
            _ajax_nonce: ajaxdata_geteventdata.nonce,
            action: "get_eventdata",
            actiontype: "AddEventBadge",
        }, function(newdata) {
            // console.log("callback");
            newcontent = "\t\t\t\t<form name=\"frmAddEvent\" id=\"frmAddEvent\" method=\"POST\" action=\"\">\n";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"AddEventType\" name=\"AddEventType\" value=\"AddEventBadge\">\n";
            newcontent = newcontent + "\t\t\t\t<table class=\"table-sm\">\n";
            if (newdata.ExpNo > 0) {
                for (var i = 0 ; i < newdata.ExpNo ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<tr><td><input type=\"checkbox\" id=\"chk" + newdata.Explorers[i].ExpID + "\" name=\"chk" + newdata.Explorers[i].ExpID + "\" value=\"" + newdata.Explorers[i].ExpID + "\"></td>";
                    newcontent = newcontent + "<td><label for =\"chk" + newdata.Explorers[i].ExpID + "\">" + newdata.Explorers[i].ExpName + " (" + newdata.Explorers[i].ExpType + " - " + newdata.Explorers[i].ExpStatus + ")</label></td></tr>\n";
                }
            } else {
                newcontent = newcontent + "\t\t<tr><td colspan=2 class=\"text-align-center\">There are no explorer records in the database.</td></tr>\n";
            }
            if (newdata.BadgesNo > 0) {
                newcontent = newcontent + "\t\t\t\t\t<tr><td>Badge:</td><td><select id=\"selBadge\" name=\"selBadge\" class=\"expbadgereqts\">\n";
                for (var i = 0 ; i < newdata.BadgesNo ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<option value=\"" + newdata.Badges[i].BadgeID + "\">" + newdata.Badges[i].Description + "</option>\n";
                }
                newcontent = newcontent + "\t\t\t\t\t</select></td></tr>\n";
            } else {
                newcontent = newcontent + "\t\t<tr><td colspan=2 class=\"text-align-center\">Could not retrieve data from server.</td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t<tr><td>Req'ts:</td><td name=\"tdBadgeReqts\" id=\"tdBadgeReqts\">Select a badge to load requirements.</td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>Start:</td><td><input type=\"date\" id=\"dateStart\" name=\"dateStart\" required></td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>End:</td><td><input type=\"date\" id=\"dateEnd\" name=\"dateEnd\" required></td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr class=\"align-text-top\"><td>Badge Issued:</td><td>";
            newcontent = newcontent + "<input type=\"radio\" id=\"BadgeNotIssued\" name=\"BadgeIssued\" required=\"required\" value=\"0\" checked> <label for=\"BadgeNotIssued\">Badge not issued to explorer</label>";
            newcontent = newcontent + "<br /><input type=\"radio\" id=\"BadgeIssued\" name=\"BadgeIssued\" required=\"required\" value=\"1\"> <label for=\"BadgeIssued\">Badge issued to explorer</label>";
            newcontent = newcontent + "</td></tr>\n";

            newcontent = newcontent + "\t\t\t\t</table>\n";
            newcontent = newcontent + "\t\t\t\t</form>\n";
            // console.log(newcontent);
            document.getElementById("modalAddEventLabel").innerHTML = "Add Badge for multiple explorers";
            document.getElementById("modalAddEventBody").innerHTML = newcontent;
        });
    });
    // Add NA button on main plugin page (adds to all selected explorers explorer)
    $( "#btnAddEventNA" ).click(function() {
        var newcontent;
        $.get(ajaxdata_geteventdata.ajax_url, {
            _ajax_nonce: ajaxdata_geteventdata.nonce,
            action: "get_eventdata",
            actiontype: "AddEventNA",
        }, function(newdata) {
            // console.log("callback");
            newcontent = "\t\t\t\t<form name=\"frmAddEvent\" id=\"frmAddEvent\" method=\"POST\" action=\"\">\n";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"AddEventType\" name=\"AddEventType\" value=\"AddEventNA\">\n";
            newcontent = newcontent + "\t\t\t\t<table class=\"table-sm\">\n";
            if (newdata.ExpNo > 0) {
                for (var i = 0 ; i < newdata.ExpNo ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<tr><td><input type=\"checkbox\" id=\"chk" + newdata.Explorers[i].ExpID + "\" name=\"chk" + newdata.Explorers[i].ExpID + "\" value=\"" + newdata.Explorers[i].ExpID + "\"></td>";
                    newcontent = newcontent + "<td><label for =\"chk" + newdata.Explorers[i].ExpID + "\">" + newdata.Explorers[i].ExpName + " (" + newdata.Explorers[i].ExpType + " - " + newdata.Explorers[i].ExpStatus + ")</label></td></tr>\n";
                }
            } else {
                newcontent = newcontent + "\t\t<tr><td colspan=2 class=\"text-align-center\">There are no explorer records in the database.</td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t<tr><td>Description:</td><td><input type=\"text\" id=\"txtDescription\" name=\"txtDescription\" size=50></td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>Location:</td><td><input type=\"text\" id=\"txtLocation\" name=\"txtLocation\" size=50></td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>No of NA:</td><td><input type=\"text\" id=\"txtDays\" name=\"txtDays\" size=10></td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>Start:</td><td><input type=\"date\" id=\"dateStart\" name=\"dateStart\"></td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>End:</td><td><input type=\"date\" id=\"dateEnd\" name=\"dateEnd\"></td></tr>\n";
            newcontent = newcontent + "\t\t\t\t</table>\n";
            newcontent = newcontent + "\t\t\t\t</form>\n";
            document.getElementById("modalAddEventLabel").innerHTML = "Add Night Away for multiple explorers";
            document.getElementById("modalAddEventBody").innerHTML = newcontent;
        });
    });
    $( "#btnAddEventReqt" ).click(function() {
        var newcontent;
        $.get(ajaxdata_geteventdata.ajax_url, {
            _ajax_nonce: ajaxdata_geteventdata.nonce,
            action: "get_eventdata",
            actiontype: "AddEventReqt",
        }, function(newdata) {
            newcontent = "\t\t\t\t<form name=\"frmAddEvent\" id=\"frmAddEvent\" method=\"POST\" action=\"\">\n";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"AddEventType\" name=\"AddEventType\" value=\"AddEventReqt\">\n";
            newcontent = newcontent + "\t\t\t\t<table class=\"table-sm\">\n";
            if (newdata.ExpNo > 0) {
                for (var i = 0 ; i < newdata.ExpNo ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<tr><td><input type=\"checkbox\" id=\"chk" + newdata.Explorers[i].ExpID + "\" name=\"chk" + newdata.Explorers[i].ExpID + "\" value=\"" + newdata.Explorers[i].ExpID + "\"></td>";
                    newcontent = newcontent + "<td><label for =\"chk" + newdata.Explorers[i].ExpID + "\">" + newdata.Explorers[i].ExpName + " (" + newdata.Explorers[i].ExpType + " - " + newdata.Explorers[i].ExpStatus + ")</label></td></tr>\n";
                }
            } else {
                newcontent = newcontent + "\t\t<tr><td colspan=2 class=\"text-align-center\">There are no explorer records in the database.</td></tr>\n";
            }
            if (newdata.BadgesNo > 0) {
                newcontent = newcontent + "\t\t\t\t\t<tr><td>Badge:</td><td><select id=\"selBadgeReqt\" name=\"selBadgeReqt\" class=\"badgereqts\">\n";
                for (var i = 0 ; i < newdata.BadgesNo ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<option value=\"" + newdata.Badges[i].BadgeID + "\">" + newdata.Badges[i].Description + "</option>\n";
                }
                newcontent = newcontent + "\t\t\t\t\t</select></td></tr>\n";
            } else {
                newcontent = newcontent + "\t\t<tr><td colspan=2 class=\"text-align-center\">Could not retrieve data from server.</td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t<tr><td>Req'ts:</td><td name=\"tdBadgeReqts\" id=\"tdBadgeReqts\">Select a badge to load requirements.</td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>Start:</td><td><input type=\"date\" id=\"dateStart\" name=\"dateStart\"></td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>End:</td><td><input type=\"date\" id=\"dateEnd\" name=\"dateEnd\"></td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr class=\"align-text-top\"><td>Badge Issued:</td><td>";
            if (newdata.BadgeIssued == 1) {
                newcontent = newcontent + "<input type=\"radio\" id=\"BadgeNotIssued\" name=\"BadgeIssued\" required=\"required\" value=\"0\"> <label for=\"BadgeNotIssued\">Badge not issued to explorer</label>";
                newcontent = newcontent + "<br /><input type=\"radio\" id=\"BadgeIssued\" name=\"BadgeIssued\" required=\"required\" value=\"1\" checked> <label for=\"BadgeIssued\">Badge issued to explorer</label>";
            } else {
                newcontent = newcontent + "<input type=\"radio\" id=\"BadgeNotIssued\" name=\"BadgeIssued\" required=\"required\" value=\"0\" checked> <label for=\"BadgeNotIssued\">Badge not issued to explorer</label>";
                newcontent = newcontent + "<br /><input type=\"radio\" id=\"BadgeIssued\" name=\"BadgeIssued\" required=\"required\" value=\"1\"> <label for=\"BadgeIssued\">Badge issued to explorer</label>";
            }
            newcontent = newcontent + "</td></tr>\n";
            newcontent = newcontent + "\t\t\t\t</table>\n";
            newcontent = newcontent + "\t\t\t\t</form>\n";
            // console.log(newcontent);
            document.getElementById("modalAddEventLabel").innerHTML = "Add Badge Requirements for multiple explorers";
            document.getElementById("modalAddEventBody").innerHTML = newcontent;
        });
    });  
    // Add Hike button on main plugin page (adds to all selected explorers explorer)
    $( "#btnAddEventHike" ).click(function() {
        $.get(ajaxdata_geteventdata.ajax_url, {
            _ajax_nonce: ajaxdata_geteventdata.nonce,
            action: "get_eventdata",
            actiontype: "AddEventHike",
        }, function(newdata) {
            // console.log("callback");
            var newcontent = "\t\t\t\t<form name=\"frmAddEvent\" id=\"frmAddEvent\" method=\"POST\" action=\"\">\n";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"AddEventType\" name=\"AddEventType\" value=\"AddEventHike\" required=\"required\">\n";
            newcontent = newcontent + "\t\t\t\t<table class=\"table-sm\">\n";
            if (newdata.ExpNo > 0) {
                for (var i = 0 ; i < newdata.ExpNo ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<tr><td><input type=\"checkbox\" id=\"chk" + newdata.Explorers[i].ExpID + "\" name=\"chk" + newdata.Explorers[i].ExpID + "\" value=\"" + newdata.Explorers[i].ExpID + "\"></td>";
                    newcontent = newcontent + "<td><label for =\"chk" + newdata.Explorers[i].ExpID + "\">" + newdata.Explorers[i].ExpName + " (" + newdata.Explorers[i].ExpType + " - " + newdata.Explorers[i].ExpStatus + ")</label></td></tr>\n";
                }
            } else {
                newcontent = newcontent + "\t\t<tr><td colspan=2 class=\"text-align-center\">There are no explorer records in the database.</td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t<tr><td>Description:</td><td><input type=\"text\" id=\"txtDescription\" name=\"txtDescription\" size=50 required=\"required\"></td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>No of Days:</td><td><input type=\"text\" id=\"txtHikeDays\" name=\"txtHikeDays\" size=10v></td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>Start:</td><td><input type=\"date\" id=\"dateStart\" name=\"dateStart\" required=\"required\"></td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>End:</td><td><input type=\"date\" id=\"dateEnd\" name=\"dateEnd\" required=\"required\"></td></tr>\n";
            newcontent = newcontent + "\t\t\t\t</table>\n";
            newcontent = newcontent + "\t\t\t\t</form>\n";
            document.getElementById("modalAddEventLabel").innerHTML = "Add Hike for multiple explorers";
            document.getElementById("modalAddEventBody").innerHTML = newcontent;
        });
    });
    $( "#btnUpdateEvent" ).click(function() {
        var i = 0;
        var formdata = $("#frmUpdateEvent").serializeArray();
        var updatetype = document.getElementById("UpdateType").value;
        $.post(ajaxdata_updateexplorerdata.ajax_url, {
            _ajax_nonce: ajaxdata_updateexplorerdata.nonce,
            action: "update_explorerdata",
            actiontype: updatetype,
            dbdata: formdata,
        }, function(newdata) {
            if (newdata.success == 1) {
                if (newdata.BadgesNo > 0) {
                    badgecontent = getExplorerBadgeTable(newdata);
                    document.getElementById("tdExpBadges").innerHTML = badgecontent;
                }
                $('#modalUpdateEvent').modal('hide');
            } else {
                document.getElementById("modalUpdateEventBody").innerHTML = "<h5 class=\"text-align-center\">An error occured: the database was not updated.</h5>\n";
            }
        });
    });
    $( "#btnSaveEvent" ).click(function() {
        var i = 0;
        var formdata = $("#frmAddEvent").serializeArray();
        var updatetype = document.getElementById("AddEventType").value;

        $.post(ajaxdata_addeventdata.ajax_url, {
            _ajax_nonce: ajaxdata_addeventdata.nonce,
            action: "add_eventdata",
            actiontype: updatetype,
            dbdata: formdata,
        }, function(newdata) {
            if (newdata.success > 0) {
                alert("Event added succesfully (" + newdata.success + " event rows added).");
                $('#modalAddEvent').modal('hide');
            } else {
                alert("An error occured: the database was not updated.");
                document.getElementById("modalAddEventBody").innerHTML = "<h5 class=\"text-align-center\">An error occured: the database was not updated.</h5>\n";
            }
        });
    });
    $( "body" ).on('change', 'select.expbadgereqts', function() {
        $.get(ajaxdata_getbadgereqts.ajax_url, {
            _ajax_nonce: ajaxdata_getbadgereqts.nonce,
            action: "get_badgereqts",
            actiontype: document.getElementById("selBadge").value,
        }, function(newdata) {
            var newcontent = "\t\t\t\t\t<table class=\"table-sm\">\n";
            if (newdata.reqtsno > 0) {
                for (var i = 0 ; i < newdata.reqtsno ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<tr><td><input type=\"checkbox\" id=\"reqt" + newdata.reqts[i].reqtid + "\" name=\"reqt" + newdata.reqts[i].reqtid + "\" value=\"" + newdata.reqts[i].reqtid + "\"></td>";
                    newcontent = newcontent + "<td><label for =\"reqt" + newdata.reqts[i].reqtid + "\">" + newdata.reqts[i].reqtdesc + "</label></td></tr>\n";
                }
            } else {
                newcontent = newcontent + "\t\t\t\t\t<tr><td colspan=2 class=\"text-align-center\">There are no matching badge requirements records in the database.</td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t\t</table>\n";
            document.getElementById("tdBadgeReqts").innerHTML = newcontent;
        });
    });
    $( "body" ).on('change', 'select.badgereqts', function() {
        $.get(ajaxdata_getbadgereqts.ajax_url, {
            _ajax_nonce: ajaxdata_getbadgereqts.nonce,
            action: "get_badgereqts",
            actiontype: document.getElementById("selBadgeReqt").value,
        }, function(newdata) {
            var newcontent = "\t\t\t\t\t<table class=\"table-sm\">\n";
            if (newdata.reqtsno > 0) {
                for (var i = 0 ; i < newdata.reqtsno ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<tr><td><input type=\"checkbox\" id=\"reqt" + newdata.reqts[i].reqtid + "\" name=\"reqt" + newdata.reqts[i].reqtid + "\" value=\"" + newdata.reqts[i].reqtid + "\"></td>";
                    newcontent = newcontent + "<td><label for =\"reqt" + newdata.reqts[i].reqtid + "\">" + newdata.reqts[i].reqtdesc + "</label></td></tr>\n";
                }
            } else {
                newcontent = newcontent + "\t\t\t\t\t<tr><td colspan=2 class=\"text-align-center\">There are no matching badge requirements records in the database.</td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t\t</table>\n";
            document.getElementById("tdBadgeReqts").innerHTML = newcontent;
        });
    });
    $( "body" ).on('click', '.badges', function() {
        var newcontent;
        $.get(ajaxdata_getexpeventdata.ajax_url, {
            _ajax_nonce: ajaxdata_getexpeventdata.nonce,
            action: "get_expeventdata",
            actiontype: "getbadgedata",
            ExpBadgeID: this.id,
        }, function(newdata) {
            // console.log("callback");
            newcontent = "\t\t\t\t<form name=\"frmUpdateEvent\" id=\"frmUpdateEvent\" method=\"POST\" action=\"\">\n";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"UpdateType\" name=\"UpdateType\" value=\"UpdateBadge\">\n";
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"BadgeID\" name=\"BadgeID\" value=\"" + newdata.BadgeID + "\">\n"
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"ExpBadgeID\" name=\"ExpBadgeID\" value=\"" + newdata.ExpBadgeID + "\">\n"
            newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"ExplorerID\" name=\"ExplorerID\" value=\"" + newdata.ExpID + "\">\n"
            newcontent = newcontent + "\t\t\t\t<table class=\"table-sm\">\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>Explorer:</td><td>" + newdata.ExpName + "</td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>Badge:</td><td>" + newdata.BadgeName + "</td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>Start:</td><td><input type=\"date\" id=\"dateStart\" name=\"dateStart\" value=\"" + newdata.ExpBadgeStart + "\"></td></tr>\n";
            if (newdata.ExpBadgeEnd != null) {
                newcontent = newcontent + "\t\t\t\t<tr><td>End:</td><td><input type=\"date\" id=\"dateEnd\" name=\"dateEnd\" value=\"" + newdata.ExpBadgeEnd + "\"></td></tr>\n";
            } else {
                newcontent = newcontent + "\t\t\t\t<tr><td>End:</td><td><input type=\"date\" id=\"dateEnd\" name=\"dateEnd\"></td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t<tr class=\"align-text-top\"><td>Badge Issued:</td><td>";
            if (newdata.BadgeIssued == 1) {
                newcontent = newcontent + "<input type=\"radio\" id=\"BadgeNotIssued\" name=\"BadgeIssued\" required=\"required\" value=\"0\"> <label for=\"BadgeNotIssued\">Badge not issued to explorer</label>";
                newcontent = newcontent + "<br /><input type=\"radio\" id=\"BadgeIssued\" name=\"BadgeIssued\" required=\"required\" value=\"1\" checked> <label for=\"BadgeIssued\">Badge issued to explorer</label>";
            } else {
                newcontent = newcontent + "<input type=\"radio\" id=\"BadgeNotIssued\" name=\"BadgeIssued\" required=\"required\" value=\"0\" checked> <label for=\"BadgeNotIssued\">Badge not issued to explorer</label>";
                newcontent = newcontent + "<br /><input type=\"radio\" id=\"BadgeIssued\" name=\"BadgeIssued\" required=\"required\" value=\"1\"> <label for=\"BadgeIssued\">Badge issued to explorer</label>";
            }
            newcontent = newcontent + "</td></tr>\n";
            if (newdata.BadgeReqtsNo > 0) {
                for (var i = 0 ; i < newdata.BadgeReqtsNo ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<tr><td><input type=\"checkbox\" id=\"chk" + newdata.BadgeReqts[i].BadgeReqtID + "\" name=\"chk" + newdata.BadgeReqts[i].BadgeReqtID + "\" value=\"" + newdata.BadgeReqts[i].BadgeReqtID + "\"";
                    if (newdata.ExpBadgeReqtsNo > 0) {
                        for (var j = 0 ; j < newdata.ExpBadgeReqtsNo ; j++) {
                            if (newdata.ExpBadgeReqts[j].BadgeReqtID == newdata.BadgeReqts[i].BadgeReqtID ) {
                                newcontent = newcontent + " checked";
                            }
                        }
                    }
                    newcontent = newcontent + "></td>";                   
                    newcontent = newcontent + "<td><label for =\"chk" + newdata.BadgeReqts[i].BadgeReqtID + "\">" + newdata.BadgeReqts[i].ReqtDesc + "</label></td></tr>\n";
                }
            } else {
                newcontent['Error'] = "No Badge requirements match this BadgeID.";
                newcontent = newcontent + "\t\t<tr><td colspan=2 class=\"text-align-center\">Could not load database data.</td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t</table>\n";
            newcontent = newcontent + "\t\t\t\t</form>\n";
            // console.log(newcontent);
            document.getElementById("modalUpdateEventLabel").innerHTML = "Update badge progress information";
            document.getElementById("modalUpdateEventBody").innerHTML = newcontent;
        });
    });
    $( "body" ).on('click', '.expbadge', function() {
        var newcontent;
        $.get(ajaxdata_getexpeventdata.ajax_url, {
            _ajax_nonce: ajaxdata_getexpeventdata.nonce,
            action: "get_expeventdata",
            actiontype: "getbadgedata",
            ExpBadgeID: this.id,
        }, function(newdata) {
            // console.log("callback");
            newcontent = "\t\t\t\t<table class=\"table-sm\">\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>Badge:</td><td>" + newdata.BadgeName + "</td></tr>\n";
            newcontent = newcontent + "\t\t\t\t<tr><td>Start:</td><td>" + newdata.ExpBadgeStart + "</td></tr>\n";
            if (newdata.ExpBadgeEnd != null) {
                newcontent = newcontent + "\t\t\t\t<tr><td>End:</td><td>" + newdata.ExpBadgeEnd + "</td></tr>\n";
            } else {
                newcontent = newcontent + "\t\t\t\t<tr><td>End:</td><td>In progress</td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t<tr><td>Badge issued:</td><td>";
            if (newdata.BadgeIssued == 0) {
                newcontent = newcontent + "Not";
            }
            newcontent = newcontent + " issued</td></tr>\n";
            if (newdata.BadgeReqtsNo > 0) {
                for (var i = 0 ; i < newdata.BadgeReqtsNo ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<tr><td><input type=\"checkbox\" id=\"chk" + newdata.BadgeReqts[i].BadgeReqtID + "\" name=\"chk" + newdata.BadgeReqts[i].BadgeReqtID + "\" value=\"" + newdata.BadgeReqts[i].BadgeReqtID + "\"";
                    if (newdata.ExpBadgeReqtsNo > 0) {
                        for (var j = 0 ; j < newdata.ExpBadgeReqtsNo ; j++) {
                            if (newdata.ExpBadgeReqts[j].BadgeReqtID == newdata.BadgeReqts[i].BadgeReqtID ) {
                                newcontent = newcontent + " checked";
                            }
                        }
                    }
                    newcontent = newcontent + "></td>";                   
                    newcontent = newcontent + "<td><label for =\"chk" + newdata.BadgeReqts[i].BadgeReqtID + "\">" + newdata.BadgeReqts[i].ReqtDesc + "</label></td></tr>\n";
                }
            } else {
                newcontent['Error'] = "No Badge requirements match this BadgeID.";
                newcontent = newcontent + "\t\t<tr><td colspan=2 class=\"text-align-center\">Could not load database data.</td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t</table>\n";
            // console.log(newcontent);
            document.getElementById("modalExpUpdateEventLabel").innerHTML = "Badge progress information";
            document.getElementById("modalExpUpdateEventBody").innerHTML = newcontent;
        });
    });
    $( "body" ).on('click', '.nightaway', function() {
        $.get(ajaxdata_getbadgereqts.ajax_url, {
            _ajax_nonce: ajaxdata_getbadgereqts.nonce,
            action: "get_badgereqts",
            actiontype: document.getElementById("selBadgeReqt").value,
        }, function(newdata) {
            var newcontent = "\t\t\t\t\t<table class=\"table-sm\">\n";
            if (newdata.reqtsno > 0) {
                for (var i = 0 ; i < newdata.reqtsno ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<tr><td><input type=\"checkbox\" id=\"reqt" + newdata.reqts[i].reqtid + "\" name=\"reqt" + newdata.reqts[i].reqtid + "\" value=\"" + newdata.reqts[i].reqtid + "\"></td>";
                    newcontent = newcontent + "<td><label for =\"reqt" + newdata.reqts[i].reqtid + "\">" + newdata.reqts[i].reqtdesc + "</label></td></tr>\n";
                }
            } else {
                newcontent = newcontent + "\t\t\t\t\t<tr><td colspan=2 class=\"text-align-center\">There are no matching badge requirements records in the database.</td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t\t</table>\n";
            document.getElementById("tdBadgeReqts").innerHTML = newcontent;
        });
    });
    $( "body" ).on('click', '.hike', function() {
        $.get(ajaxdata_getbadgereqts.ajax_url, {
            _ajax_nonce: ajaxdata_getbadgereqts.nonce,
            action: "get_badgereqts",
            actiontype: document.getElementById("selBadgeReqt").value,
        }, function(newdata) {
            var newcontent = "\t\t\t\t\t<table class=\"table-sm\">\n";
            if (newdata.reqtsno > 0) {
                for (var i = 0 ; i < newdata.reqtsno ; i++) {
                    newcontent = newcontent + "\t\t\t\t\t<tr><td><input type=\"checkbox\" id=\"reqt" + newdata.reqts[i].reqtid + "\" name=\"reqt" + newdata.reqts[i].reqtid + "\" value=\"" + newdata.reqts[i].reqtid + "\"></td>";
                    newcontent = newcontent + "<td><label for =\"reqt" + newdata.reqts[i].reqtid + "\">" + newdata.reqts[i].reqtdesc + "</label></td></tr>\n";
                }
            } else {
                newcontent = newcontent + "\t\t\t\t\t<tr><td colspan=2 class=\"text-align-center\">There are no matching badge requirements records in the database.</td></tr>\n";
            }
            newcontent = newcontent + "\t\t\t\t\t</table>\n";
            document.getElementById("tdBadgeReqts").innerHTML = newcontent;
        });
    });
    $( '.modal' ).on("hidden.bs.modal", function (e) { 
        if ($('.modal:visible').length) { 
            $('body').addClass('modal-open');
        }
    });
});

function updateExplorerView(newdata) {
    let newcontent;

    newcontent = "\t\t\t\t<form name=\"frmExplorer\" id=\"frmExplorer\" method=\"POST\" action=\"\">\n";
    newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"ExplorerID\" name=\"ExplorerID\" value=\"" + newdata.ExpID + "\">\n"
    newcontent = newcontent + "\t\t\t\t<input type=\"hidden\" id=\"ExplorerName\" name=\"ExplorerName\" value=\"" + newdata.Name + "\">";
    newcontent = newcontent + "\t\t\t\t<table class=\"table\">\n";
    newcontent = newcontent + "\t\t\t\t\t<tr><td>Login:</td><td>" + newdata.Login + " (" + newdata.Status + " - " + newdata.ExpType + " - " + newdata.DateStart + " - " + newdata.DateEnd + ")</td></tr>\n";
    newcontent = newcontent + "\t\t\t\t\t<tr><td class=\"align-text-top\">" + newdata.BadgesNo + " Awards / Badges:</td><td name=\"tdExpBadges\" id=\"tdExpBadges\"></td></tr>\n";
    newcontent = newcontent + "\t\t\t\t\t<tr><td class=\"align-text-top\">" + newdata.NightsAway + " nights away:</td><td name=\"tdExpNAs\" id=\"tdExpNAs\">\n\t\t\t\t\t\t<table class=\"table\">\n"; 
    if (newdata.NANo > 0) {
        for (i = 0 ; i < newdata.ExpNAs.length ; i++) {
            newcontent = newcontent + "\t\t\t\t\t\t<tr><td>" + newdata.ExpNAs[i].Description + " ("+ newdata.ExpNAs[i].NALocation + ": " + newdata.ExpNAs[i].NADays + " night(s) - " + newdata.ExpNAs[i].DateStart + " - " + newdata.ExpNAs[i].DateEnd  + ")</td><tr>";
        }
    }
    newcontent = newcontent + "\t\t\t\t\t\t</table></td></tr>\n";
    newcontent = newcontent + "\t\t\t\t\t<tr><td class=\"align-text-top\">" + newdata.Hikes + " Hikes:</td><td name=\"tdExpHikes\" id=\"tdExpHikes\">\n\t\t\t\t\t\t<table class=\"table\">\n"; 
    if (newdata.HikeNo > 0) {
        for (i = 0 ; i < newdata.ExpHikes.length ; i++) {
            newcontent = newcontent + "\t\t\t\t\t\t<tr><td>" + newdata.ExpHikes[i].Description + " (" + newdata.ExpHikes[i].HikeDays + " hikes: " + newdata.ExpHikes[i].DateStart + " - " + newdata.ExpHikes[i].DateEnd  + ")</td><tr>";
        }
    }
    newcontent = newcontent + "\t\t\t\t\t\t</table></td></tr>\n";
    newcontent = newcontent + "\t\t\t\t</table>\n";
    newcontent = newcontent + "\t\t\t\t</form>\n";

    badgecontent = getExplorerBadgeTable(newdata);

    document.getElementById("modalGetExplorerLabel").innerHTML = newdata.Name + " (id: " + newdata.ExpID + ")";
    document.getElementById("modalGetExplorerBody").innerHTML = newcontent;
    document.getElementById("tdExpBadges").innerHTML = badgecontent;
}

function getExplorerBadgeTable(newdata) {
    let badgetable = "\t\t\t\t\t\t<table class=\"table table-sm\">\n"; 
    badgetable = badgetable + "\t\t\t\t\t<thead><tr><th scope=\"col\">Badge</th><th scope=\"col\">Description</th><th scope=\"col\">Dates</th><th scope=\"col\">Issued</th></tr></thead>\n\t\t\t\t\t<tbody>\n"; 
    // class=\"badge\" 
    if (newdata.BadgesNo > 0) {
        for (i = 0 ; i < newdata.ExpBadges.length ; i++) {
            badgetable = badgetable + "\t\t\t\t\t\t<tr class=\"badges\" id=\"" + newdata.ExpBadges[i].ExpBadgeID + "\" data-toggle=\"modal\" data-target=\"#modalUpdateEvent\"><th scope=\"row\"><img height=\"25px\" src=\"" + newdata.ExpBadges[i].IconPath + "\" /></th><td>" + newdata.ExpBadges[i].Description + "</td>";
            badgetable = badgetable + "<td>"  + newdata.ExpBadges[i].DateStart + " - ";
            if (newdata.ExpBadges[i].DateEnd === "") {
                badgetable = badgetable + "in progress";
            } else {
                badgetable = badgetable + newdata.ExpBadges[i].DateEnd;
            }
            if (newdata.ExpBadges[i].BadgeIssued == 1) {
                badgetable = badgetable + "</td><td>Issued";
            } else {
                badgetable = badgetable + "</td><td>Not issued";
            }
            badgetable = badgetable + "</td></tr>\n";
        }
    }
    badgetable = badgetable + "\t\t\t\t\t\t</tbody></table>";

    return badgetable;
}