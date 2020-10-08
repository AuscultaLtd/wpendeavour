<?php
/*
 * @link        http://endeavouresu.uk
 * @since       1.0.0
 * @package     wp-endeavouresu
 *
 * @wordpress-plugin
 * Plugin Name: wp-endeavouresu
 * Plugin URI:  
 * Requires at least: 5.5
 * Requires PHP: 7.4
 * Description: Plugin to simplify the management of Endeavour Explorer Scout Unit
 * Version:     1.0.0
 * Author:      Ausculta Ltd
 * Author URI:  http://ausculta.net
 * License:     GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: wp-endeavouresu
 * Domain Path: /languages
 */

/* Copyright 2020 Ausculta Ltd (email: info@ausculta.net)
wp-endeavouresu is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.
 
wp-endeavouresu is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
 
You should have received a copy of the GNU General Public License
along with wp-endeavouresu. If not, see http://.
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

if ( !defined( 'WPENDEAVOURESU_VER' ) ) {
	define( 'WPENDEAVOURESU_VER', '1.0.0' );
}

/**
 * load textdomain
 *
 * @return void
 */
function wpendeavouresu_textdomain() {
    load_plugin_textdomain( 'wpendeavouresu', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}

function wpendeavouresu_allexplorers($atts = [], $content = null) {
    global  $wpdb;

    // Prepare the content to replace the tag
    // Table definition
    $content = "<div><table class=\"table-sm\">\n";
    // Table head
    $content = $content . "\t<thead>\n\t\t<tr>\n";
    $content = $content . "\t\t\t<td>Explorer Name</td>\n";
    $content = $content . "\t\t\t<td>Type</td>\n";
    $content = $content . "\t\t\t<td>Status</td>\n";
    $content = $content . "\t\t\t<td>Nights Away</td>\n";
    $content = $content . "\t\t\t<td>Hikes</td>\n";
    $content = $content . "\t\t\t<td>Start date</td>\n";
    $content = $content . "\t\t\t<td>End date</td>\n";
    $content = $content . "\t\t</tr>\n\t</thead>\n";

    // Table content
    // $sql = "SELECT E.ExpID, U.display_name, exp1_exptypetypes.Description, S.Description, E.TotalNightsAway, E.TotalHikes, E.ExpDateStart, E.ExpDateEnd ";
    // $sql = $sql . "FROM " . $wpdb->base_prefix . "users U, exp1_explorers E, exp1_expstatus S, exp1_exptypetypes, exp1_exptypes ";
    // $sql = $sql . "WHERE U.ID = E.ExpWPID AND E.Deleted = 0 AND E.ExpStatusID = S.ExpStatusID AND exp1_exptypetypes.ExpTypeTypeID = exp1_exptypes.ExpTypeTypeID AND exp1_exptypes.ExpID = E.ExpID AND exp1_exptypes.DateEnd IS NULL ";
    // $sql = $sql . "ORDER BY U.display_name";
    $sql = "CALL GetAllExplorers()";
    // Flush the DB cache and run the query
    $wpdb->flush();
    $dbdata = $wpdb->get_results($sql, ARRAY_N);
    if (count($dbdata) > 0) {
        foreach ($dbdata as $row) {
            $content = $content . "\t\t<tr><td class=\"explorer\" data-toggle=\"modal\" data-target=\"#modalGetExplorer\" id=\"" . $row[0]. "\">" . esc_html($row[1]) . "</td>";
            $content = $content . "<td>" . esc_html($row[2]) . "</td>";
            $content = $content . "<td>" . esc_html($row[3]) . "</td>";
            $content = $content . "<td>" . esc_html($row[4]) . "</td>";
            $content = $content . "<td>" . esc_html($row[5]) . "</td>";
            $content = $content . "<td>" . esc_html($row[6]) . "</td>";
            if ($row[7] == "") {
                $content = $content . "<td>Current</td></tr>\n";
            } else {
                $content = $content . "<td>" . esc_html($row[7]) . "</td></tr>\n";
            }
        }
        $wpdb->flush();
    } else {
        $content = $content . "\t\t<tr><td colspan=7 class=\"text-align-center\">There are no explorer records in the database.</td></tr>\n";
    }
    // Close the table
    $content = $content . "</table></div>\n";
    $content = $content . "<div class=\"text-align-center\">\n";
    $content = $content . "\t<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#modalAddExplorers\" id=\"btnAddExplorers\">Add explorers</button> \n";
    $content = $content . "\t<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#modalAddEvent\" id=\"btnAddEventNA\">Add Night Aways</button> \n";
    $content = $content . "\t<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#modalAddEvent\" id=\"btnAddEventHike\">Add Hikes</button> \n";
    $content = $content . "\t<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#modalAddEvent\" id=\"btnAddEventBadge\">Add Badges</button> \n";
    $content = $content . "\t<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#modalAddEvent\" id=\"btnAddEventReqt\">Add Badge Reqts</button> \n";
    $content = $content . "</div>\n";
   
    $content = $content . "<div class=\"modal fade\" id=\"modalAddExplorers\" tabindex=\"-1\" aria-labelledby=\"modalAddExplorersLabel\" aria-hidden=\"true\">\n";
    $content = $content . "\t<div class=\"modal-dialog  modal-dialog-centered\">\n\t\t<div class=\"modal-content\">\n\t\t\t<div class=\"modal-header\">\n";
    $content = $content . "\t\t\t\t<h5 class=\"modal-title\" id=\"modalAddExplorersLabel\">Add explorers from user list</h5>\n";
    $content = $content . "\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n";
    $content = $content . "\t\t\t</div>\n\t\t\t<div class=\"modal-body\" id=\"modalAddExplorersBody\">\n";
    $content = $content . "\t\t\t<h5>Retrieving Data</h5>\n";
    $content = $content . "\t\t\t</div>\n\t\t\t<div class=\"modal-footer\">\n";
    $content = $content . "\t\t\t\t<button type=\"button\" class=\"btn btn-secondary\" id=\"btnCloseExplorers\" data-dismiss=\"modal\">Close</button>\n";
    $content = $content . "\t\t\t\t<button type=\"button\" class=\"btn btn-primary\" id=\"btnSaveExplorers\">Save changes</button>\n";
    $content = $content . "\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n";

    $content = $content . "<div class=\"modal fade\" id=\"modalAddEvent\" tabindex=\"-1\" aria-labelledby=\"modalAddEventLabel\" aria-hidden=\"true\">\n";
    $content = $content . "\t<div class=\"modal-dialog  modal-lg modal-dialog-centered\">\n\t\t<div class=\"modal-content\">\n\t\t\t<div class=\"modal-header\">\n";
    $content = $content . "\t\t\t\t<h5 class=\"modal-title\" id=\"modalAddEventLabel\">Retrieving data</h5>\n";
    $content = $content . "\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n";
    $content = $content . "\t\t\t</div>\n\t\t\t<div class=\"modal-body\" id=\"modalAddEventBody\">\n";
    $content = $content . "\t\t\t<h5>Retrieving Data</h5>\n";
    $content = $content . "\t\t\t</div>\n\t\t\t<div class=\"modal-footer\">\n";
    $content = $content . "\t\t\t\t<button type=\"button\" class=\"btn btn-secondary\" id=\"btnCloseEvent\" data-dismiss=\"modal\">Close</button>\n";
    $content = $content . "\t\t\t\t<button type=\"button\" class=\"btn btn-primary\" id=\"btnSaveEvent\">Save changes</button>\n";
    $content = $content . "\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n";
    
    $content = $content . "<div class=\"modal fade\" id=\"modalGetExplorer\" tabindex=\"-1\" aria-labelledby=\"modalGetExplorerLabel\" aria-hidden=\"true\">\n";
    $content = $content . "\t<div class=\"modal-dialog modal-lg modal-dialog-centered\">\n\t\t<div class=\"modal-content\">\n\t\t\t<div class=\"modal-header\">\n";
    $content = $content . "\t\t\t\t<h5 class=\"modal-title\" id=\"modalGetExplorerLabel\">Retrieving explorer name</h5>\n";
    $content = $content . "\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n";
    $content = $content . "\t\t\t</div>\n\t\t\t<div class=\"modal-body\" id=\"modalGetExplorerBody\">\n";
    $content = $content . "\t\t\t<h5>Retrieving Data</h5>\n";
    $content = $content . "\t\t\t</div>\n\t\t\t<div class=\"modal-footer\">\n";
    $content = $content . "\t\t\t\t<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\" data-target=\"#modalAddExplorers\" id=\"btnExplorerClose\">Close</button>\n";
    $content = $content . "\t\t\t\t<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#modalUpdateExplorer\" id=\"btnEditStatus\">Edit Status</button>\n";
    $content = $content . "\t\t\t\t<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#modalUpdateExplorer\" id=\"btnEditType\">Edit Type</button>\n";
    $content = $content . "\t\t\t\t<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#modalUpdateExplorer\" id=\"btnAddNA\">Nights Away</button>\n";
    $content = $content . "\t\t\t\t<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#modalUpdateExplorer\" id=\"btnAddHike\">Hikes</button>\n";
    $content = $content . "\t\t\t\t<button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#modalUpdateExplorer\" id=\"btnAddBadge\">Badges & Awards</button>\n";
    $content = $content . "\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n";

    $content = $content . "\t\t\t\t<div class=\"modal fade\" id=\"modalUpdateExplorer\" tabindex=\"-1\" aria-labelledby=\"modalUpdateExplorerLabel\" aria-hidden=\"true\">\n";
    $content = $content . "\t\t\t\t<div class=\"modal-dialog modal-lg modal-dialog-centered\">\n\t\t\t\t<div class=\"modal-content\">\n\t\t\t\t<div class=\"modal-header\">\n";
    $content = $content . "\t\t\t\t<h5 class=\"modal-title\" id=\"modalUpdateExplorerLabel\">Retrieving explorer name</h5>\n";
    $content = $content . "\t\t\t\t<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n";
    $content = $content . "\t\t\t\t</div>\n\t\t\t\t<div class=\"modal-body\" id=\"modalUpdateExplorerBody\">\n";
    $content = $content . "\t\t\t\t<h5>Retrieving Data</h5>\n";
    $content = $content . "\t\t\t\t</div>\n\t\t\t\t<div class=\"modal-footer\">\n";
    $content = $content . "\t\t\t\t<button type=\"button\" class=\"btn btn-secondary\" data-toggle=\"modal\" data-target=\"#modalUpdateExplorer\">Close</button>\n";
    $content = $content . "\t\t\t\t<button type=\"button\" class=\"btn btn-primary\" id=\"btnUpdateSave\" name=\"btnUpdateSave\">Save changes</button>\n";
    $content = $content . "\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t</div>\n";

    // always return
    return $content;
}

function wpendeavouresu_getnonexpusers() {
    global  $wpdb;

    // Handle the ajax request
    check_ajax_referer('wpendeavouresu_getnonexpusers');

    // Flush the DB cache and run the query
    $wpdb->flush();
    $sql = "CALL GetNonExplorerUsers()";
    $result = $wpdb->get_results($sql, ARRAY_N);
    $content = array();
    $explist = array();
    if (count($result) > 0) {
        // Query returned rows
        foreach ($result as $row) {
            $explist[] = array( 'id' => esc_html($row[0]), 'display_name' => esc_html($row[1]));
        }
    }
    $content['expno'] = count($result);
    $content['explist'] = $explist;
    $wpdb->flush();
    $sql = "SELECT ExpTypeTypeID, Description FROM exp1_exptypetypes WHERE Deleted = 0 ORDER BY Description";
    $dbdata = $wpdb->get_results($sql, ARRAY_N);
    $typesdata = array();
    if (count($dbdata) > 0) {
        foreach($dbdata as $dbrow) {
            $typesdata[] = array('TypeID' => esc_html($dbrow[0]), 'Description' => esc_html($dbrow[1]));
        }
    }
    $wpdb->flush();
    $content['ExpTypesNo'] = count($typesdata);
    $content['ExpTypes'] = $typesdata;

    // Send the data back
    wp_send_json($content);
   
    wp_die(); // All ajax handlers die when finished
}

function wpendeavouresu_savenewexplorers() {
    global  $wpdb;

    check_ajax_referer('wpendeavouresu_savenewexplorers');
    $dbrecords = 0;
    
    if (! empty($_POST['dbdata'])) {
        // $newexp = json_decode($_POST['dbdata'], true);
        $newexp = $_POST['dbdata'];
        if ($_POST['rdoType'] != null) {
            $rdoType = $_POST['rdoType'];
        } else {
            $rdoType = 0;
        }
        if ($_POST['dateFrom'] != null) {
            $dateFrom = $_POST['dateFrom'];
        } else {
            $dateFrom = "CURRENT_DATE";
        }
        $wpdb->flush();
        foreach ($newexp as $explorer) {
            switch ($explorer['name']) {
                case "rdoType":
                case "dateFrom":
                    // Ignore
                    break;
                default:
                    if (strlen($explorer['name']) < 4) break;
                    $sql = "CALL AddExplorer(" . $explorer['value'] . ", " . $rdoType . ", '" . $dateFrom . "')";
                    $wpdb->query($sql);
                    $wpdb->flush();
                    $dbrecords++;
                    break;
            }
        }
    }
    $content['dbrecords'] = $dbrecords;
    wp_send_json($content);

    wp_die(); // All ajax handlers die when finished
}

function wpendeavouresu_getexplorer() {
    global  $wpdb;

    // Handle the ajax request
    check_ajax_referer('wpendeavouresu_getexplorer');

    if (! empty($_GET['ExpID'])) {
        // Flush the DB cache and run the query
        $expID = $_GET['ExpID'];
        // echo "ExpID: " + $expID;
        $wpdb->flush();
        $sql = "SELECT U.display_name, U.user_login, E.ExpDateStart, E.ExpDateEnd, S.Description, E.TotalNightsAway, E.TotalHikes ";
        $sql = $sql . "FROM " . $wpdb->base_prefix . "users U, exp1_expstatus S, exp1_explorers E ";
        $sql = $sql . "WHERE U.ID = E.ExpWPID AND S.ExpStatusID = E.ExpStatusID AND E.ExpID = " . $expID;
        $expdata = $wpdb->get_row($sql, ARRAY_N, 0);
        if (count($expdata) > 0) {
            $content = array(
                'Name'=> esc_html($expdata[0]),
                'Login' => esc_html($expdata[1]),
                'DateStart' => esc_html($expdata[2]),               
                'DateEnd' => esc_html($expdata[3]),
                'Status' => esc_html($expdata[4]),
                'NightsAway' => esc_html($expdata[5]),
                'Hikes' => esc_html($expdata[6]),
                'ExpID' => esc_html($expID),
                'ExpHikes' => "0",
                'ExNAs'=> "0",
                'ExpBadges' => "0");
            if (is_null($expdata[3])) $content['DateEnd'] = "current";
        } else {
            $content = array ( 'Name' => 'ExpID not found in database');
        }
        $wpdb->flush();

        $sql = "SELECT ExpHikeID, Description, HikeDays, DateStart, DateEnd FROM exp1_exphikes WHERE ExpID = " .$expID . " ORDER BY DateStart DESC";
        $hikedata = $wpdb->get_results($sql, ARRAY_N);
        $exphikes = array();
        if (count($hikedata) > 0) {
            foreach($hikedata as $hike) {
                $exphikes[] = array('ExpHikeID' => esc_html($hike[0]), 'Description' => esc_html($hike[1]), 'HikeDays' => esc_html($hike[2]), 'DateStart' => esc_html($hike[3]), 'DateEnd' => esc_html($hike[4]));
            }
        }
        $content['HikeNo'] = count($exphikes);
        $wpdb->flush();

        $sql = "SELECT ExpNightAwayID, DateStart, DateEnd, Description, NALocation, NADays FROM exp1_expna WHERE ExpID = " . $expID . " ORDER BY DateStart DESC";
        $nadata = $wpdb->get_results($sql, ARRAY_N);
        $expnas = array();
        if (count($nadata) > 0) {
            foreach($nadata as $expna) {
                $expnas[] = array('ExpNAID' => esc_html($expna[0]), 'DateStart' => esc_html($expna[1]), 'DateEnd' => esc_html($expna[2]), 'Description' => esc_html($expna[3]), 'NALocation' => esc_html($expna[4]), 'NADays' => esc_html($expna[5]));
            }
        }
        $content['NANo'] = count($expnas);
        $wpdb->flush();

        $sql = "SELECT E.ExpTypeID, T.Description, E.DateStart FROM exp1_exptypes E, exp1_exptypetypes T ";
        $sql = $sql . "WHERE E.ExpID = " . $expID . " AND E.ExpTypeTypeID = T.ExpTypeTypeID AND E.DateEnd IS NULL";
        $typedata = $wpdb->get_row($sql, ARRAY_N);
        if (! empty($typedata)) {
            $content['ExpTypeID'] = esc_html($typedata[0]);
            $content['ExpType'] = esc_html($typedata[1]);
            $content['ExpTypeDateStart'] = esc_html($typedata[2]);
        } else {
            $content['ExpTypeID'] = esc_html(0);
            $content['ExpType'] = esc_html('Type not set');
            $content['ExpTypeDateStart'] = esc_html('Date not set');
        }
        $wpdb->flush();
        $sql = "SELECT B.BadgeID, B.IconPath, CONCAT(B.Name, ' (', S.Description, ', ', T.Description, ')'), B.Description, E.ExpBadgeID, E.DateStart, E.DateEnd  ";
        $sql = $sql . "FROM exp1_badges B, exp1_badgestatus S, exp1_badgetypes T, exp1_expbadges E ";
        $sql = $sql . "WHERE T.BadgeTypeID = B.BadgeTypeID AND S.BadgeStatusID = B.BadgeStatusID AND B.BadgeID = E.BadgeID AND E.ExpID = " . $expID . " ";
        $sql = $sql . "ORDER BY B.BadgeTypeID, B.Description";
        $badgedata = $wpdb->get_results($sql, ARRAY_N);
        $expbadges = array();
        if (count($badgedata) > 0) {
            foreach($badgedata as $badge) {
                $expbadges[] = array('BadgeID' => esc_html($badge[0]), 'IconPath' => esc_html($badge[1]),
                                    'Description' => esc_html($badge[2]), 'BadgeDescription' => esc_html($badge[3]),
                                    'ExpBadgeID' => esc_html($badge[4]), 'DateStart' => esc_html($badge[5]), 'DateEnd' => esc_html($badge[6]) );
            }
        }
        $content['BadgesNo'] = count($expbadges);
        $wpdb->flush();

        if (count($exphikes) > 0) $content['ExpHikes'] = $exphikes;
        if (count($expnas) > 0) $content['ExpNAs'] = $expnas;
        if (count($expbadges) > 0) $content['ExpBadges'] = $expbadges;
    }
    // Send the data back
    wp_send_json($content);
   
    wp_die(); // All ajax handlers die when finished
}

function wpendeavouresu_getexplorerdata() {
    global  $wpdb;

    // Handle the ajax request
    //check_ajax_referer('nonce_getexplorerdata');

    $content = array();
    if (! empty($_GET['ExpID'])) {
        $expID = $_GET['ExpID'];
        $content['ExpID'] = $expID;
        // echo "ExpID: " . $expID;
        
        // Flush the database cache, just in case
        $wpdb->flush();
        
        switch ($_GET['actiontype']) {
            case "EditStatus":
                $sql = "SELECT ExpStatusID FROM exp1_explorers WHERE ExpID = " . $expID;
                $dbdata = $wpdb->get_row($sql, ARRAY_N, 0);
                if ($dbdata != null) {
                    $content['ExpStatusID'] = $dbdata[0];
                    $wpdb->flush();               
                    $sql = "SELECT ExpStatusID, Description FROM exp1_expstatus WHERE Deleted = 0 ORDER BY Description";
                    $dbdata = $wpdb->get_results($sql, ARRAY_N);
                    $statusdata = array();
                    if (count($dbdata) > 0) {
                        foreach($dbdata as $dbrow) {
                            $statusdata[] = array('StatusID' => esc_html($dbrow[0]), 'Description' => esc_html($dbrow[1]));
                        }
                    }
                    $content['ExpStatusNo'] = count($statusdata);
                    $content['ExpStatus'] = $statusdata;
                }
                break;
            case "EditType":
                $sql = "SELECT ExpTypeTypeID FROM exp1_exptypes WHERE ExpID = " . $expID . " AND DateEnd IS NULL";
                $dbdata = $wpdb->get_row($sql, ARRAY_N, 0);
                if ($dbdata != null) {
                    $content['ExpTypeID'] = $dbdata[0];
                    $wpdb->flush();
                }                    
                $sql = "SELECT ExpTypeTypeID, Description FROM exp1_exptypetypes WHERE Deleted = 0 ORDER BY Description";
                $dbdata = $wpdb->get_results($sql, ARRAY_N);
                $typesdata = array();
                if (count($dbdata) > 0) {
                    foreach($dbdata as $dbrow) {
                        $typesdata[] = array('TypeID' => esc_html($dbrow[0]), 'Description' => esc_html($dbrow[1]));
                    }
                }
                $content['ExpTypesNo'] = count($typesdata);
                $content['ExpTypes'] = $typesdata;
                break;
            case "AddBadge":
                $sql = "SELECT B.BadgeID, CONCAT(B.Name, ' (', S.Description, ', ', T.Description, ')'), B.Description ";
                $sql = $sql . "FROM exp1_badges B, exp1_badgestatus S, exp1_badgetypes T ";
                $sql = $sql . "WHERE T.BadgeTypeID = B.BadgeTypeID AND S.BadgeStatusID = B.BadgeStatusID ";
                $sql = $sql . "ORDER BY T.Description, B.Description";
                $badges = array();
                $dbdata = $wpdb->get_results($sql, ARRAY_N);
                if ($dbdata != null) {
                    foreach($dbdata as $dbrow) {
                        $badges[] = array( "BadgeID" => $dbrow[0], "Description" => esc_html($dbrow[1]));
                    }
                }                    
                $wpdb->flush();
                $content['BadgesNo'] = count($badges);
                $content['Badges'] = $badges;
                break;
            default:
                break;
        }
    } else {
        $content = "Please provide an explorer ID";
    }
    // Send the data back
    wp_send_json($content);
   
    wp_die(); // All ajax handlers die when finished
}

function wpendeavouresu_updateexplorerdata() {
    global  $wpdb;
    
    // check_ajax_referer('wpendeavouresu_updateexplorerdata');
    
    // Declare the return data
    $content = array();
    if ((! empty($_POST['dbdata'])) && (! empty($_POST['actiontype']))) {
        $newdata = $_POST['dbdata'];
        foreach ($newdata as $dbdata) {
            switch ($dbdata['name']) {
                case "ExplorerID":
                    $expID = $dbdata['value'];
                    break;
                case "ExplorerName":
                    $expName = $dbdata['value'];
                    break;
                case "UpdateType":
                    $updatetype = $dbdata['value'];
                    break;
                default:
                    break;
            }
        }
        // echo "Action: " . $_POST['actiontype'] . " for ID: " . $expID . ". ";

        if (empty($expID)) {
            $content['success'] = 0;
            $content['error'] = "ExplorerID is empty";
            wp_send_json($content);
            wp_die();
        }
     
        $wpdb->flush();
        switch ($_POST['actiontype']) {
            case "EditStatus":
                foreach ($newdata as $dbdata) {
                    switch ($dbdata['name']) {
                        case "rdoStatus":
                            $rdoStatus = $dbdata['value'];
                            break;
                        default:
                            break;
                    }
                }
                $sql = "UPDATE exp1_explorers SET ExpStatusID = " . intval($rdoStatus) . " WHERE ExpID = " . intval($expID);
                // query returns the number of affected rows - ignored.
                $dbresult = $wpdb->query($sql);
                if ($dbresult > 0) {
                    $content['success'] = 1;
                } else {
                    $content['success'] = 0;
                }
                break;
            case "EditType":
                foreach ($newdata as $dbdata) {
                    switch ($dbdata['name']) {
                        case "rdoType":
                            $rdoType = $dbdata['value'];
                            break;
                        case "dateFrom":
                            $dateFrom = $dbdata['value'];
                            break;
                        default:
                            break;
                    }
                }
                // Close previous type. This may or may not update anything.
                $sql = "UPDATE exp1_exptypes SET DateEnd = '" . $dateFrom . "' WHERE ExpID = " . intval($expID) . " AND DateEnd IS NULL";
                $dbresult = $wpdb->query($sql);
                $wpdb->flush();

                $sql = "INSERT INTO exp1_exptypes (ExpID, ExpTypeTypeID, DateStart) VALUES (" . intval($expID) . ", " . intval($rdoType) . ", '" . $dateFrom . "')";
                // query returns the number of affected rows - ignored.
                $dbresult = $wpdb->query($sql);
                if ($dbresult > 0) {
                    $content['success'] = 1;
                } else {
                    $content['success'] = 0;
                }
                break;
            case "AddNA":
                foreach ($newdata as $dbdata) {
                    switch ($dbdata['name']) {
                        case "txtDays":
                            $txtDays = $dbdata['value'];
                            break;
                        case "txtDescription":
                            $txtDescription = $dbdata['value'];
                            break;
                        case "txtLocation":
                            $txtLocation = $dbdata['value'];
                            break;
                        case "dateStart":
                            $dateStart = $dbdata['value'];
                            break;
                        case "dateEnd":
                            $dateEnd = $dbdata['value'];
                            break;
                        default:
                            break;
                    }
                }
                $sql = "CALL AddNightAway(" . intval($expID) . ", " . intval($txtDays) . ", '" . $txtDescription . "', '" . $txtLocation . "', '" . $dateStart . "', '" . $dateEnd . "')";
                $dbresult = $wpdb->query($sql);
                $wpdb->flush();
                if ($dbresult > 0) {
                    $content['success'] = 1;
                } else {
                    $content['success'] = 0;
                }
                break;
            case "AddHike":
                foreach ($newdata as $dbdata) {
                    switch ($dbdata['name']) {
                        case "txtDescription":
                            $txtDescription = $dbdata['value'];
                            break;
                        case "txtHikeDays":
                            $txtHikeDays = $dbdata['value'];
                            break;
                        case "dateStart":
                            $dateStart = $dbdata['value'];
                            break;
                        case "dateEnd":
                            $dateEnd = $dbdata['value'];
                            break;
                        default:
                            break;
                    }
                }
                $sql = "CALL AddHike(" . intval($expID) . ", '" . $txtDescription . "', " . $txtHikeDays . ", '" . $dateStart . "', '" . $dateEnd . "')";
                $dbresult = $wpdb->query($sql);
                $wpdb->flush();
                if ($dbresult > 0) {
                    $content['success'] = 1;
                } else {
                    $content['success'] = 0;
                }
                break;
            case "AddBadge":
                foreach ($newdata as $dbdata) {
                    switch ($dbdata['name']) {
                        case "selBadge":
                            $selBadge = $dbdata['value'];
                            break;
                        case "dateStart":
                            $dateStart = $dbdata['value'];
                            break;
                        case "dateEnd":
                            $dateEnd = $dbdata['value'];
                            break;
                        default:
                            break;
                    }
                }
                if (! empty($dateEnd)) {
                    $sql = "INSERT INTO exp1_expbadges (ExpID, BadgeID, DateStart, DateEnd) VALUES (" . $expID . ", " . $selBadge . ", '" . $dateStart . "', '" . $dateEnd . "')";
                } else {
                    $sql = "INSERT INTO exp1_expbadges (ExpID, BadgeID, DateStart) VALUES (" . $expID . ", " . $selBadge . ", '" . $dateStart . "')";
                }
                $dbresult = $wpdb->query($sql);
                if ($dbresult > 0) {
                    $content['success'] = 1;
                } else {
                    $content['success'] = 0;
                }
                break;
           default:
                break;
        }
    }
    $wpdb->flush();
    wp_send_json($content);

    wp_die(); // All ajax handlers die when finished
}

function wpendeavouresu_geteventdata() {
    global  $wpdb;
    
    $newdata = array();
    $wpdb->flush();
    $sql = "CALL GetAllExplorers()";
    $dbdata = $wpdb->get_results($sql, ARRAY_N);
    if (count($dbdata) > 0) {
        foreach ($dbdata as $dbrow) {
            $explorers[] = array("ExpID" => $dbrow[0], "ExpName" => esc_html($dbrow[1]), "ExpType" => esc_html($dbrow[2]), "ExpStatus" => esc_html($dbrow[3]));
        }
        $newdata["ExpNo"] = count($dbdata);
        $newdata["Explorers"] = $explorers;
    } else {
        $newdata["ExpNo"] = 0;
    }
    $wpdb->flush();
    $newdata['actiontype'] = $_GET['actiontype'];
    switch ($_GET['actiontype']) {
        case "AddEventNA":
        case "AddEventHike":
            break;
        case "AddEventBadge":
            $sql = "CALL GetAllBadges()";
            $badges = array();
            $dbdata = $wpdb->get_results($sql, ARRAY_N);
            if ($dbdata != null) {
                foreach($dbdata as $dbrow) {
                    $badges[] = array( "BadgeID" => $dbrow[0], "Label" => esc_html($dbrow[1]), "Description" => esc_html($dbrow[2]));
                }
            }                    
            $wpdb->flush();
            $newdata['BadgesNo'] = count($badges);
            $newdata['Badges'] = $badges;
            break;
        case "AddEventReqt":
            $sql = "CALL GetAllBadges()";
            $badges = array();
            $dbdata = $wpdb->get_results($sql, ARRAY_N);
            if ($dbdata != null) {
                foreach($dbdata as $dbrow) {
                    $badges[] = array( "BadgeID" => $dbrow[0], "Label" => esc_html($dbrow[1]), "Description" => esc_html($dbrow[2]));
                }
            }                    
            $wpdb->flush();
            $newdata['BadgesNo'] = count($badges);
            $newdata['Badges'] = $badges;
            break;  
        default:
            break;
    }
    wp_send_json($newdata);

    wp_die(); // All ajax handlers die when finished
}

function wpendeavouresu_addeventdata() {
    global  $wpdb;
    
    check_ajax_referer('wpendeavouresu_updateexplorerdata');
    
    // Declare the return data
    $content = array();
    if ((! empty($_POST['dbdata'])) && (! empty($_POST['actiontype']))) {
        $newdata = $_POST['dbdata'];
        $wpdb->flush();
        $dbrecords = 0;
        switch ($_POST['actiontype']) {
            case "AddEventNA":
                foreach ($newdata as $dbdata) {
                    switch ($dbdata['name']) {
                        case "txtDays":
                            $txtDays = $dbdata['value'];
                            break;
                        case "txtDescription":
                            $txtDescription = $dbdata['value'];
                            break;
                        case "txtLocation":
                            $txtLocation = $dbdata['value'];
                            break;
                        case "dateStart":
                            $dateStart = $dbdata['value'];
                            break;
                        case "dateEnd":
                            $dateEnd = $dbdata['value'];
                            break;
                        default:
                            break;
                    }
                }
                if ($dateStart == null) $dateStart = "CURRENT_DATE";
                if ($dateEnd == null) $dateEnd = "CURRENT_DATE";

                foreach ($newdata as $dbdata) {
                    switch ($dbdata['name']) {
                        case "AddEventType":
                        case "txtDays":
                        case "txtDescription":
                        case "txtLocation":
                        case "dateStart":
                        case "dateEnd":
                            // Ignore
                            break;
                        default:
                            if (strlen($dbdata['name']) < 4) break;
                            if (intval($dbdata['value']) == 0) break;
                            $sql = "CALL AddNightAway(" . intval($dbdata['value']) . ", " . intval($txtDays) . ", '" . $txtDescription . "', '" . $txtLocation . "', '" . $dateStart . "', '" . $dateEnd . "')";
                            $wpdb->query($sql);
                            $wpdb->flush();
                            $dbrecords++;
                            break;
                    }
                }
                if ($dbrecords > 0) {
                    $content['success'] = 1;
                } else {
                    $content['success'] = 0;
                }
                break;
            case "AddEventHike":
                foreach ($newdata as $dbdata) {
                    switch ($dbdata['name']) {
                        case "txtDescription":
                            $txtDescription = $dbdata['value'];
                            break;
                        case "txtHikeDays":
                            $txtHikeDays = $dbdata['value'];
                            break;
                        case "dateStart":
                            $dateStart = $dbdata['value'];
                            break;
                        case "dateEnd":
                            $dateEnd = $dbdata['value'];
                            break;
                        default:
                            break;
                    }
                }
                if ($dateStart == null) $dateStart = "CURRENT_DATE";
                if ($dateEnd == null) $dateEnd = "CURRENT_DATE";
                foreach ($newdata as $dbdata) {
                    switch ($dbdata['name']) {
                        case "AddEventType":
                        case "txtHikeDays":
                        case "txtDescription":
                        case "dateStart":
                        case "dateEnd":
                            // Ignore
                            break;
                        default:
                            if (strlen($dbdata['name']) < 4) break;
                            if (intval($dbdata['value']) == 0) break;
                            $sql = "CALL AddHike(" . intval($dbdata['value']) . ", '" . $txtDescription . "', " . intval($txtHikeDays) . ", '" . $dateStart . "', '" . $dateEnd . "')";
                            $wpdb->query($sql);
                            $wpdb->flush();
                            $dbrecords++;
                            break;
                    }
                }
                if ($dbrecords > 0) {
                    $content['success'] = 1;
                } else {
                    $content['success'] = 0;
                }
                break;
            case "AddEventBadge":
                foreach ($newdata as $dbdata) {
                    switch ($dbdata['name']) {
                        case "selBadge":
                            $selBadge = $dbdata['value'];
                            break;
                        case "dateStart":
                            $dateStart = $dbdata['value'];
                            break;
                        case "dateEnd":
                            $dateEnd = $dbdata['value'];
                            break;
                        default:
                            break;
                    }
                }
                if ($dateStart == null) $dateStart = "CURRENT_DATE";
                foreach ($newdata as $dbdata) {
                    switch ($dbdata['name']) {
                        case "AddEventType":
                        case "selBadge":
                        case "dateStart":
                        case "dateEnd":
                            // Ignore
                            break;
                        default:
                            if (strlen($dbdata['name']) < 4) break;
                            if (intval($dbdata['value']) == 0) break;

                            if (! empty($dateEnd)) {
                                $sql = "INSERT INTO exp1_expbadges (ExpID, BadgeID, DateStart, DateEnd) VALUES (" . intval($dbdata['value']) . ", " . intval($selBadge) . ", '" . $dateStart . "', '" . $dateEnd . "')";
                            } else {
                                $sql = "INSERT INTO exp1_expbadges (ExpID, BadgeID, DateStart) VALUES (" . intval($dbdata['value']) . ", " . intval($selBadge) . ", '" . $dateStart . "')";
                            }
                            $wpdb->query($sql);
                            $wpdb->flush();
                            $dbrecords++;
                            break;
                    }
                }
                if ($dbrecords > 0) {
                    $content['success'] = 1;
                } else {
                    $content['success'] = 0;
                }
                break;
            case "AddEventReqt":
                $expid = array();
                $reqtid = array();
                foreach ($newdata as $dbdata) {
                    switch ($dbdata['name']) {
                        case "selBadgeReqt":
                            $selBadge = $dbdata['value'];
                            break;
                        case "dateStart":
                            $dateStart = $dbdata['value'];
                            break;
                        case "dateEnd":
                            $dateEnd = $dbdata['value'];
                            break;
                        case "AddEventType":
                            // ignore this
                            break;
                        default:
                            if (strncmp($dbdata['name'], "chk", 3) == 0) {
                                $expid[] = array('name' => $dbdata['name'], 'value' => $dbdata['value']);
                            }
                            if (strncmp($dbdata['name'], "reqt", 4) == 0) {
                                $reqtids[] = array('name' => $dbdata['name'], 'value' => $dbdata['value']);
                            }
                            break;
                    }
                }
                if ((count($expid) == 0) || (count($reqtids) == 0)) break;
                if ($dateStart == null) $dateStart = "CURRENT_DATE";
                $dbrecords = 0;
                foreach ($expid as $explorer) {
                    if (intval($explorer['value']) == 0) break;
                    // Check that there is an expbadges record for this explorer and this badge. If there isn't one, create one
                    $sql = "CALL GetExpBadgeID (" . intval($explorer['value']) . ", " . intval($selBadge) . ", '" . $dateStart . "')";
                    $content["SQLReqtID"] = $sql;
                    $dbresult = $wpdb->get_results($sql, ARRAY_N);
                    $expbadgeID = $dbresult[0][0];
                    foreach ($reqtids as $reqtid) {
                        if (! empty($dateEnd)) {
                            $sql = "INSERT INTO exp1_expbadgereqts (ExpID, ExpBadgeID, BadgeReqtID, DateStart, DateEnd) VALUES (" . intval($explorer['value']) . ", " . $expbadgeID . ", " . $reqtid['value'] . ", '" . $dateStart . "', '" . $dateEnd . "')";
                        } else {
                            $sql = "INSERT INTO exp1_expbadgereqts (ExpID, ExpBadgeID, BadgeReqtID, DateStart) VALUES (" . intval($explorer['value']) . ", " . $expbadgeID . ", " . $reqtid['value'] . ", '" . $dateStart . "')";
                        }
                        $content['SQL' . $reqtid['value']] = $sql;
                    }
                    $wpdb->query($sql);
                    $wpdb->flush();
                    $dbrecords++;
                }
                if ($dbrecords > 0) {
                    $content['success'] = 1;
                } else {
                    $content['success'] = 0;
                }
                break;
            default:
                break;
        }
    }
    $wpdb->flush();
    wp_send_json($content);

    wp_die(); // All ajax handlers die when finished
}

function wpendeavouresu_getbadgereqts() {
    global  $wpdb;

    $wpdb->flush();
    $sql = "SELECT BadgeReqtID, Description FROM exp1_badgereqts WHERE Deleted = 0 AND BadgeReqtStatusID = 1 AND BadgeID = " . $_GET['actiontype'];
    $dbdata = $wpdb->get_results($sql, ARRAY_N);
    $reqts = array();
    if (count($dbdata) > 0) {
        foreach($dbdata as $dbrow) {
            $reqts[] = array('reqtid' => esc_html($dbrow[0]), 'reqtdesc' => esc_html($dbrow[1]));
        }
    }
    $wpdb->flush();
    $content['reqtsno'] = count($reqts);
    $content['reqts'] = $reqts;

    // Send the data back
    wp_send_json($content);
   
    wp_die(); // All ajax handlers die when finished
}

function wpendeavouresu_enqueuescript( $hook ) {
    // If this is not a page, return
    // Otherwise, enqueue the script
    // wp_enqueue_script( 'ajax-getnonexpusers', plugins_url('js/wp-endeavouresu-getnonexpusers.js', __FILE__ ), array('jquery') );
    // wp_enqueue_script( 'ajax-savenewexplorers', plugins_url('js/wp-endeavouresu-savenewexplorers.js', __FILE__ ), array('jquery') );
    // wp_enqueue_script( 'ajax-getexplorer', plugins_url('js/wp-endeavouresu-getexplorer.js', __FILE__ ), array('jquery') );
    // wp_enqueue_script( 'ajax-getexplorerdata', plugins_url('js/wp-endeavouresu-getexplorerdata.js', __FILE__ ), array('jquery') );
    // wp_enqueue_script( 'ajax-updateexplorerdata', plugins_url('js/wp-endeavouresu-updateexplorerdata.js', __FILE__ ), array('jquery') );
    wp_enqueue_script( 'ajax-endeavouresu', plugins_url('js/wp-endeavouresu-endeavouresu.js', __FILE__ ), array('jquery') );
    $nonce_getnonexpusers = wp_create_nonce( 'wpendeavouresu_getnonexpusers' );
    $nonce_savenewexplorers = wp_create_nonce( 'wpendeavouresu_savenewexplorers' );
    $nonce_getexplorer = wp_create_nonce( 'wpendeavouresu_getexplorer' );
    $nonce_getexplorerdata = wp_create_nonce( 'wpendeavouresu_getexplorerdata' );
    $nonce_updateexplorerdata = wp_create_nonce( 'wpendeavouresu_updateexplorerdata' );
    $nonce_geteventdata = wp_create_nonce ('wpendeavouresu_geteventdata');
    $nonce_addeventdata = wp_create_nonce ('wpendeavouresu_addeventdata');
    $nonce_getbadgereqts = wp_create_nonce ('wpendeavouresu_getbadgereqts');
    wp_localize_script( 'ajax-endeavouresu', 'ajaxdata_newexplorers', array(
       'ajax_url' => admin_url( 'admin-ajax.php' ),
       'nonce'    => $nonce_savenewexplorers,
    ) );
    wp_localize_script( 'ajax-endeavouresu', 'ajaxdata_nonexpusers', array(
        'ajax_url' => admin_url( 'admin-ajax.php' ),
        'nonce'    => $nonce_getnonexpusers,
     ) );
     wp_localize_script( 'ajax-endeavouresu', 'ajaxdata_getexplorer', array(
        'ajax_url' => admin_url( 'admin-ajax.php' ),
        'nonce'    => $nonce_getexplorer,
     ) );
     wp_localize_script( 'ajax-endeavouresu', 'ajaxdata_getexplorerdata', array(
        'ajax_url' => admin_url( 'admin-ajax.php' ),
        'nonce'    => $nonce_getexplorerdata,
     ) );
     wp_localize_script( 'ajax-endeavouresu', 'ajaxdata_updateexplorerdata', array(
        'ajax_url' => admin_url( 'admin-ajax.php' ),
        'nonce'    => $nonce_updateexplorerdata,
     ) );
     wp_localize_script( 'ajax-endeavouresu', 'ajaxdata_geteventdata', array(
        'ajax_url' => admin_url( 'admin-ajax.php' ),
        'nonce'    => $nonce_geteventdata,
     ) );
     wp_localize_script( 'ajax-endeavouresu', 'ajaxdata_addeventdata', array(
        'ajax_url' => admin_url( 'admin-ajax.php' ),
        'nonce'    => $nonce_addeventdata,
     ) );
     wp_localize_script( 'ajax-endeavouresu', 'ajaxdata_getbadgereqts', array(
        'ajax_url' => admin_url( 'admin-ajax.php' ),
        'nonce'    => $nonce_getbadgereqts,
     ) ); 
}

// Shortcode to trigger the plugin from the page
add_shortcode('EndeavourESU_AllExplorers', 'wpendeavouresu_allexplorers');

// Add the JQuery scripts to the page
add_action('wp_enqueue_scripts' , 'wpendeavouresu_enqueuescript');

// Add the handler for AJAX request to get the list of non explorer users 
add_action('wp_ajax_get_nonexpusers', 'wpendeavouresu_getnonexpusers');

// Add the handler for AJAX request to save new explorers
add_action('wp_ajax_save_newexplorers', 'wpendeavouresu_savenewexplorers');

// Add the handler for AJAX request to view explorer details 
add_action('wp_ajax_get_explorer', 'wpendeavouresu_getexplorer');

// Add the handler for AJAX request to get explorer details 
add_action('wp_ajax_get_explorerdata', 'wpendeavouresu_getexplorerdata');

// Add the handler for AJAX request to update explorer details 
add_action('wp_ajax_update_explorerdata', 'wpendeavouresu_updateexplorerdata');

// Add the handler for AJAX request to get event data 
add_action('wp_ajax_get_eventdata', 'wpendeavouresu_geteventdata');

// Add the handler for AJAX request to add event data 
add_action('wp_ajax_add_eventdata', 'wpendeavouresu_addeventdata');

// Add the handler for AJAX request to get badge requirements 
add_action('wp_ajax_get_badgereqts', 'wpendeavouresu_getbadgereqts');

?>