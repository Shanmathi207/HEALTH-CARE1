<?php

$host = '127.0.0.1';
$port = '3306';

$db = 'healthcare';

$user = 'root';

$pass = '';


$dsn =
    "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4";


$options = [

    PDO::ATTR_ERRMODE =>
        PDO::ERRMODE_EXCEPTION,

    PDO::ATTR_DEFAULT_FETCH_MODE =>
        PDO::FETCH_ASSOC,

    PDO::ATTR_EMULATE_PREPARES =>
        false

];


try {

    $pdo =
        new PDO(
            $dsn,
            $user,
            $pass,
            $options
        );

} catch (PDOException $e) {

    http_response_code(500);

    header(
        'Content-Type: application/json'
    );

    echo json_encode([

        'error' =>
            'Database connection failed',

        'message' =>
            $e->getMessage()

    ]);

    exit;
}


return $pdo;