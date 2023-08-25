<?php
$servername = "localhost";
$username = "root";
$password = "12345";
$dbname = "buscar_cep";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $cep = $_POST["cep"];
    $logradouro = $_POST["logradouro"];
    $bairro = $_POST["bairro"];
    $cidade = $_POST["cidade"];
    $estado = $_POST["estado"];

    $insertQuery = "INSERT INTO enderecos (cep, logradouro, bairro, cidade, estado)
                    VALUES ('$cep', '$logradouro', '$bairro', '$cidade', '$estado')";

    if ($conn->query($insertQuery) === TRUE) {
        echo json_encode(array("message" => "Endereço adicionado com sucesso."));
    } else {
        echo json_encode(array("message" => "Erro ao adicionar endereço: " . $conn->error));
    }
}

$conn->close();
?>
