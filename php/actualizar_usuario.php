<?php
header('Content-Type: application/json');

include 'conexion.php';

// Decodifica los datos recibidos en formato JSON
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? '';
$nombre = $data['nombre'] ?? '';
$avatar_base64 = $data['avatar'] ?? '';

// Inicia una transacción en caso de que necesites revertir debido a errores
$conn->begin_transaction();

try {
    if (!empty($avatar_base64)) {
        // Define el directorio donde se guardarán las imágenes
        $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/avatars/';
        $imageName = uniqid() . '.jpg';
        $imagePath = $uploadDir . $imageName;

        // Separa la cadena base64 y decodifícala
        list($type, $avatar_base64) = explode(';', $avatar_base64);
        list(, $avatar_base64) = explode(',', $avatar_base64);
        $avatar_base64 = base64_decode($avatar_base64);

        // Guarda la imagen en el servidor
        if (file_put_contents($imagePath, $avatar_base64)) {
            $avatar_url = 'https://foodscan-ai.com/uploads/avatars/' . $imageName;
        } else {
            throw new Exception("Error al guardar la imagen del avatar");
        }
    } else {
        throw new Exception("La imagen del avatar no se recibió correctamente");
    }

    // Actualiza los datos del usuario en la base de datos
    $sql = "UPDATE usuarios SET nombre = ?, avatar = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $nombre, $avatar_url, $id);

    if (!$stmt->execute()) {
        throw new Exception("Error al actualizar el usuario: " . $stmt->error);
    }

    // Si todo va bien, confirma los cambios
    $conn->commit();

    echo json_encode(["message" => "Perfil actualizado exitosamente"]);
} catch (Exception $e) {
    // Si algo sale mal, revierte la transacción
    $conn->rollback();
    echo json_encode(["error" => $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>
