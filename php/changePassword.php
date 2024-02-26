<?php
header('Content-Type: application/json');

include 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $userId = $data['userId'];
    $newPassword = $data['newPassword'];
    $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);

    $sql = "UPDATE usuarios SET contraseña = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $newPasswordHash, $userId);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar la contraseña"]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Datos no recibidos"]);
}

$conn->close();
?>
