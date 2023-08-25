<?php
$servername = "localhost";
$username = "root";
$password = "12345";
$dbname = "buscar_cep";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

$selectQuery = "SELECT * FROM enderecos";
$result = $conn->query($selectQuery);

$users = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        array_push($users, $row);
    }
}

echo json_encode(array("users" => $users));

$conn->close();
?>
