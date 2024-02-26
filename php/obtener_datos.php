<?php
header('Content-Type: application/json');

include 'conexion.php'; // Asegúrate de que este archivo contenga la información para conectarte a tu base de datos

$sql = "SELECT nombre, email, avatar FROM usuarios"; // Ajusta los nombres de las columnas según tu base de datos
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $negocios = [];
    while($row = $result->fetch_assoc()) {
        $negocios[] = $row;
    }
    echo json_encode(["message" => "Datos obtenidos exitosamente", "data" => $usuarios]);
} else {
    echo json_encode(["message" => "No se encontraron usuarios"]);
}

$conn->close();
?>
