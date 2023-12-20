<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $user = 'root';
    $password = 'mysql';
    $db = 'vtb_bank_brench';
    $host = 'localhost';
    $charset = 'utf8';
    $tablename = $_POST["tablename"];

    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $password);
    $query = $pdo -> query("SELECT * FROM $tablename");
    $rows = array();

    while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
        $rows[] = $row;
    }

    echo json_encode($rows, JSON_UNESCAPED_UNICODE);
}
?>