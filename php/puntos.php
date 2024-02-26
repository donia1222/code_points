<?php
header('Content-Type: application/json');
include 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

$negocioEmail = $data['negocioEmail'] ?? null;
$usuarioEmail = $data['usuarioEmail'] ?? null;
$puntosAAnadir = $data['puntos'] ?? null;

if (is_null($negocioEmail) || is_null($usuarioEmail) || is_null($puntosAAnadir)) {
    echo json_encode(["error" => "Faltan datos para añadir puntos."]);
    exit;
}

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

$sqlPuntos = "INSERT INTO PuntosNegocios (NegocioID, ClienteID, Puntos) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Puntos = Puntos + VALUES(Puntos)";
$stmtPuntos = $conn->prepare($sqlPuntos);
$stmtPuntos->bind_param("iii", $negocioID, $usuarioID, $puntosAAnadir);

if ($stmtPuntos->execute()) {
    echo json_encode(["message" => "Puntos actualizados con éxito."]);
} else {
    echo json_encode(["error" => "Error al actualizar puntos: " . $stmtPuntos->error]);
}

$stmtNegocio->close();
$stmtUsuario->close();
$stmtPuntos->close();
$conn->close();
?>
