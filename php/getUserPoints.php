<?php
header('Content-Type: application/json');
include 'conexion.php';

// Asume que recibes el email del usuario como parámetro GET o POST
$usuarioEmail = isset($_GET['email']) ? $_GET['email'] : null;

if (is_null($usuarioEmail)) {
    echo json_encode(["error" => "Falta el email del usuario."]);
    exit;
}

$sql = "SELECT negocios.nombre AS negocioNombre, negocios.columna_texto_promocional AS textoPromocional , negocios.Avatar AS avatar, PuntosNegocios.Puntos AS puntos
        FROM PuntosNegocios
        JOIN usuarios ON PuntosNegocios.ClienteID = usuarios.ID
        JOIN negocios ON PuntosNegocios.NegocioID = negocios.ID
        WHERE usuarios.email = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $usuarioEmail);
$stmt->execute();
$result = $stmt->get_result();

$puntos = [];
while ($row = $result->fetch_assoc()) {
    $puntos[] = $row;
}

if (count($puntos) > 0) {
    echo json_encode(["success" => true, "puntos" => $puntos]);
} else {
    echo json_encode(["success" => false, "message" => "No se encontraron puntos para el usuario."]);
}

$stmt->close();
$conn->close();
?>