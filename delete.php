<?php
$servername = "localhost";
$username = "root";
$password = "12345";
$dbname = "buscar_cep";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $cep = $_GET["cep"];

    $deleteQuery = "DELETE FROM enderecos WHERE cep = '$cep'";

    if ($conn->query($deleteQuery) === TRUE) {
        echo json_encode(array("message" => "Endereço excluído com sucesso."));
    } else {
        echo json_encode(array("message" => "Erro ao excluir endereço: " . $conn->error));
    }
}

$conn->close();
?>
