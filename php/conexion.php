 <?php
$servidor = "owoxogis.mysql.db.internal";
$usuario = " ";
$password = " ";
$db = " ";

$conn = new mysqli($servidor, $usuario, $password, $db);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>