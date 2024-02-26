  <?php
header('Content-Type: application/json');
include 'conexion.php'; // Asegúrate de que este archivo exista y esté configurado correctamente.

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? '';
$nombre = $data['nombre'] ?? '';
$email = $data['email'] ?? '';
$direccion = $data['direccion'] ?? '';
$telefono = $data['telefono'] ?? '';
$pagina_web = $data['pagina_web'] ?? '';
$avatar_base64 = $data['avatar'] ?? ''; 
$texto_promocional = $data['texto_promocional'] ?? ''; // Agregar esta línea

if (empty($email)) { // Verifica que el email no esté vacío.
    echo json_encode(["error" => "El email es obligatorio."]);
    exit;
}

$conn->begin_transaction(); // Inicia una transacción

try {
    $avatar_url = '';
    if (!empty($avatar_base64)) {
        $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/avatars/';
        $imageName = uniqid() . '.jpg';
        $imagePath = $uploadDir . $imageName;

        list(, $avatar_base64) = explode(',', $avatar_base64);
        $avatar_base64 = base64_decode($avatar_base64);
        if (file_put_contents($imagePath, $avatar_base64)) {
            $avatar_url = 'https://mycode.lweb.ch/uploads/avatars/' . $imageName;
        } else {
            throw new Exception("Error al guardar la imagen del avatar");
        }
    }

    $sql = "UPDATE negocios SET nombre = ?, direccion = ?, telefono = ?, pagina_web = ?, avatar = ?, columna_texto_promocional = ? WHERE email = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Error al preparar la consulta: " . $conn->error);
    }

    $stmt->bind_param("sssssss", $nombre, $direccion, $telefono, $pagina_web, $avatar_url, $texto_promocional, $email);

    if (!$stmt->execute()) {
        throw new Exception("Error al actualizar los datos: " . $stmt->error);
    }

    if ($stmt->affected_rows == 0) {
        throw new Exception("No se actualizaron los datos. Verifica que el usuario exista.");
    }

    $conn->commit(); // Si todo va bien, confirma los cambios
    echo json_encode(["message" => "Datos actualizados con éxito"]);
} catch (Exception $e) {
    $conn->rollback(); // Si algo sale mal, revierte la transacción
    echo json_encode(["error" => $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>