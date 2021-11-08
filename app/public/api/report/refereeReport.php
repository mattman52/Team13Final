<?php

// if (($_SERVER['REQUEST_METHOD'] ?? '') != 'POST') {
//     header($_SERVER["SERVER_PROTOCOL"] . " 405 Method Not Allowed");
//     exit;
// }

try {
    $_POST = json_decode(
                file_get_contents('php://input'), 
                true,
                2,
                JSON_THROW_ON_ERROR
            );
} catch (Exception $e) {
    header($_SERVER["SERVER_PROTOCOL"] . " 400 Bad Request");
    // print_r($_POST);
    // echo file_get_contents('php://input');
    exit;
}

require("class/DbConnection.php");

// Step 1: Get a datase connection from our helper class
$db = DbConnection::getConnection();

$sql = 'SELECT CONCAT(r.fName," ", r.lName) as "name", g.field, g.playTime, a.acceptanceStatus, a.assigenmentStatus
    FROM games g 
        Inner JOIN assignedTo a ON g.gameId = a.gameId
        Inner JOIN referees r ON a.refereeId = r.refereeId
    WHERE ';

$vars = [
    $_POST['startDate']
];


if (isset($_POST['selection']) && $_POST["selection"] == "1") {
    $sql .= 'g.playtime between ? and ?';
    array_push($vars, $_POST['futureDate']);
}else{
    $sql .=  'g.playtime > ?';
};

if (isset($_POST['selectionAcceptance']) && $_POST["selectionAcceptance"] == "1") {
    $sql .= ' and a.acceptanceStatus = ?';
    array_push($vars, $_POST['acceptanceStatus']);
}

if (isset($_POST['selectionAssignment']) && $_POST["selectionAssignment"] == "1") {
    $sql .= ' and r.assigenmentStatus = ?';
    array_push($vars, $_POST['assigenmentStatus']);
}

if (isset($_POST['selectionReferee']) && $_POST["selectionReferee"] == "1") {
    $sql .= ' and r.refereeId = ? ORDER BY g.playTime';
    array_push($vars, $_POST['id']);
}else{
    $sql .= ' ORDER BY g.playTime';
}

$stmt = $db->prepare($sql);
$stmt->execute($vars);

$reportRef = $stmt->fetchAll();

if (isset($_POST['format']) && $_POST['format']=='csv') {
        
    header('Content-Type: text/csv');

    echo "Name,field,playTime,acceptanceStatus\r\n";

    foreach($_POST as $o) {
        echo "\"".$o['name'] ."\","
            .$o['field'] .','
            .$o['playTime'] .','
            .$o['acceptanceStatus'] ."\r\n";
    }
} else {
// Step 3: Convert to JSON
$json = json_encode($reportRef, JSON_PRETTY_PRINT);

// Step 4: Output
header('Content-Type: application/json');
echo $json;
}