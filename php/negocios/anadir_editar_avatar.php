<?php
header('Content-Type: application/json');
include 'conexion.php'; // Asegúrate de que este archivo exista y esté configurado correctamente.

$data = json_decode(file_get_contents("php://input"), true);

$nombre = $data['nombre'] ?? '';
$email = $data['email'] ?? '';
$direccion = $data['direccion'] ?? '';
$telefono = $data['telefono'] ?? '';
$pagina_web = $data['pagina_web'] ?? '';
$avatar_base64 = $data['avatar'] ?? '';

if (empty($email)) { // Verifica que el email no esté vacío.
    echo json_encode(["error" => "El email es obligatorio."]);
    exit;
}

// Inicia una transacción en caso de que necesites revertir debido a errores.
$conn->begin_transaction();

try {
    // Actualiza la información del negocio en la base de datos.
    $sql = "UPDATE negocios SET nombre = ?, direccion = ?, telefono = ?, pagina_web = ? WHERE email = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta: " . $conn->error);
    }
    $stmt->bind_param("sssss", $nombre, $direccion, $telefono, $pagina_web, $email);
    if (!$stmt->execute()) {
        throw new Exception("Error al actualizar los datos: " . $stmt->error);
    }
    $stmt->close();

    // Maneja la carga del avatar si está presente.
    if (!empty($avatar_base64)) {
        // Define el directorio donde se guardarán las imágenes.
        $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/avatars/';
        $imageName = uniqid() . '.jpg';
        $imagePath = $uploadDir . $imageName;

        // Decodifica la imagen de base64 y la guarda en el servidor.
        list($type, $avatar_base64) = explode(';', $avatar_base64);
        list(, $avatar_base64) = explode(',', $avatar_base64);
        $avatar_base64 = base64_decode($avatar_base64);
        if (!file_put_contents($imagePath, $avatar_base64)) {
            throw new Exception("Error al guardar la imagen del avatar");
        }
        $avatar_url =  'https://foodscan-ai.com/uploads/avatars/' . $imageName;

        // Actualiza la URL del avatar en la base de datos.
        $sql = "UPDATE negocios SET avatar = ? WHERE email = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Error al preparar la consulta para actualizar el avatar: " . $conn->error);
        }
        $stmt->bind_param("ss", $avatar_url, $email);
        if (!$stmt->execute()) {
            throw new Exception("Error al actualizar el avatar en la base de datos: " . $stmt->error);
        }
        $stmt->close();
    }

    // Si todo va bien, confirma los cambios.
    $conn->commit();
    echo json_encode(["message" => "Datos y avatar actualizados con éxito"]);
} catch (Exception $e) {
    // Si algo sale mal, revierte la transacción.
    $conn->rollback();
    echo json_encode(["error" => $e->getMessage()]);
}

$conn->close();
?>
