<?php
header('Content-Type: application/json');
include 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

$usuarioEmail = $data['usuarioEmail'] ?? null;
$negocioEmail = $data['negocioEmail'] ?? null; // Añade esta línea

if (is_null($usuarioEmail) || is_null($negocioEmail)) { // Modifica esta línea
    echo json_encode(["error" => "Faltan datos necesarios."]);
    exit;
}

// Encuentra el ID del usuario
$sqlUsuario = "SELECT ID FROM usuarios WHERE email = ?";
$stmtUsuario = $conn->prepare($sqlUsuario);
$stmtUsuario->bind_param("s", $usuarioEmail);
$stmtUsuario->execute();
$resultUsuario = $stmtUsuario->get_result();
if ($resultUsuario->num_rows === 0) {
    echo json_encode(["error" => "Usuario no encontrado."]);
    exit;
}
$usuarioID = $resultUsuario->fetch_assoc()['ID'];

// Encuentra el ID del negocio
$sqlNegocio = "SELECT ID FROM negocios WHERE email = ?";
$stmtNegocio = $conn->prepare($sqlNegocio);
$stmtNegocio->bind_param("s", $negocioEmail);
$stmtNegocio->execute();
$resultNegocio = $stmtNegocio->get_result();
if ($resultNegocio->num_rows === 0) {
    echo json_encode(["error" => "Negocio no encontrado."]);
    exit;
}
$negocioID = $resultNegocio->fetch_assoc()['ID'];

// Restablece los puntos específicamente para ese usuario y ese negocio
$sqlReset = "UPDATE PuntosNegocios SET Puntos = 0 WHERE ClienteID = ? AND NegocioID = ?";
$stmtReset = $conn->prepare($sqlReset);
$stmtReset->bind_param("ii", $usuarioID, $negocioID);

if ($stmtReset->execute()) {
    echo json_encode(["message" => "Puntos restablecidos con éxito."]);
} else {
    echo json_encode(["error" => "Error al restablecer puntos: " . $stmtReset->error]);
}

$stmtUsuario->close();
$stmtNegocio->close();
$stmtReset->close();
$conn->close();
?>
