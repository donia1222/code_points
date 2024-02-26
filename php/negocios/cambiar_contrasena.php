<?php
header('Content-Type: application/json');
include 'conexion.php'; // Asegúrate de que este archivo exista y esté configurado correctamente.

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$nueva_contrasena = $data['nueva_contrasena'] ?? '';

if (empty($email) || empty($nueva_contrasena)) {
    echo json_encode(["error" => "El email y la nueva contraseña son obligatorios."]);
    exit;
}

// Hashear la nueva contraseña
$nueva_contrasena_hash = password_hash($nueva_contrasena, PASSWORD_DEFAULT);

$sql = "UPDATE negocios SET contrasena = ? WHERE email = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["error" => "Error al preparar la consulta: " . $conn->error]);
    exit;
}

$stmt->bind_param("ss", $nueva_contrasena_hash, $email);

if ($stmt->execute()) {
    echo json_encode(["message" => "Contraseña actualizada con éxito"]);
} else {
    echo json_encode(["error" => "Error al actualizar la contraseña"]);
}

$stmt->close();
$conn->close();
?>
