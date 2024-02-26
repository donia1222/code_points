<?php
header('Content-Type: application/json');
include 'conexion.php';

$qrCodeIdentifier = $_GET['qrCodeIdentifier'] ?? '';

if (empty($qrCodeIdentifier)) {
    echo json_encode(["success" => false, "message" => "QR code identifier no proporcionado."]);
    exit;
}

$sql = "SELECT nombre, email, avatar FROM usuarios WHERE qr_code_identifier = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Error al preparar la consulta"]);
    exit;
}

$stmt->bind_param("s", $qrCodeIdentifier);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    if ($user = $result->fetch_assoc()) {
        echo json_encode(["success" => true, "data" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "Usuario no encontrado."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Error al ejecutar la consulta"]);
}

$stmt->close();
$conn->close();
?>
