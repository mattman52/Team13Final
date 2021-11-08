<?php

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

header('Content-Type: text/csv');

echo "Name,field,playTime,acceptanceStatus\r\n";

foreach($_POST as $o) {
    echo "\"".$o['name'] ."\","
        .$o['field'] .','
        .$o['playTime'] .','
        .$o['acceptanceStatus'] ."\r\n";
}
