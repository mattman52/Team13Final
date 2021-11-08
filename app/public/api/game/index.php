<?php
// require 'common.php';
require 'class/DbConnection.php';

// Step 1: Get a datase connection from our helper class
$db = DbConnection::getConnection();

// Step 2: Create & run the query

$sql = 'SELECT t1.gameId, t1.field, t1.playTime, t1.minRef, COALESCE(t2.counted, 0) AS counted
FROM 
    (SELECT g.gameId, g.field, g.playTime, g.minRef From games g INNER JOIN assignedTo a ON g.gameId = a.gameId group by g.gameId) t1
LEFT JOIN
    (SELECT g.gameId, count(a.refereeId) as counted From games g INNER JOIN assignedTo a ON g.gameId = a.gameId AND a.assigenmentStatus = "Assigned" group by g.gameId) t2
ON (t1.gameId = t2.gameId);';
$vars = [];

$stmt = $db->prepare($sql);
$stmt->execute($vars);

$content = $stmt->fetchAll();
// Step 3: Convert to JSON
$json = json_encode($content, JSON_PRETTY_PRINT);

// Step 4: Output
header('Content-Type: application/json');
echo $json;
