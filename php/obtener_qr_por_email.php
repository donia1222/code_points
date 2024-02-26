<?php
header('Content-Type: application/json');
include 'conexion.php';

$email = $_GET['email'] ?? '';

if (empty($email)) {
    echo json_encode(["success" => false, "message" => "Email no proporcionado."]);
    exit;
}

// Modifica la consulta para buscar por email
$sql = "SELECT nombre, email, avatar, qr_code_identifier FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Error al preparar la consulta"]);
    exit;
}

$stmt->bind_param("s", $email);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    if ($user = $result->fetch_assoc()) {
        // Retorna éxito y los datos del usuario, incluido el identificador del código QR
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
