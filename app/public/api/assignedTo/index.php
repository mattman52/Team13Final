<?php
require 'class/DbConnection.php';

// Step 1: Get a datase connection from our helper class
$db = DbConnection::getConnection();

// Step 2: Create & run the query
$sql = 'SELECT * FROM assignedTo';
$vars = [];
$outSql = 'SELECT refereeId, fName, lName FROM referees';

if (isset($_GET['game'])) {
# getting all the referees that are playing the game 
  $sql = 'SELECT * FROM assignedTo a INNER JOIN referees r ON r.refereeId = a.refereeId WHERE a.gameId = ?';

  $vars = [ $_GET['game'] ];
#getting all the referees not playing the game 
  $outSql = 'SELECT DISTINCT refereeId, CONCAT(fName," ", lName) as "name" FROM referees r WHERE NOT EXISTS (SELECT * FROM assignedTo a WHERE a.refereeId = r.refereeId AND a.gameId = ?)';

}

$stmt = $db->prepare($sql);
$stmt->execute($vars);
$referees = $stmt->fetchAll();

$stmt = $db->prepare($outSql);
$stmt->execute($vars);
$outer = $stmt->fetchAll();

// Step 3: Convert to JSON

$result = array( 'Inner' => $referees, 'Outer' => $outer );

// Step 4: Output
header('Content-Type: application/json');
echo json_encode( $result );
