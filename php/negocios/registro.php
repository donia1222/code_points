<?php
header('Content-Type: application/json');
include 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

// Capturar datos del negocio desde el JSON recibido
$nombre = $data['nombre'] ?? null;
$email = $data['email'] ?? null;
$contraseña = $data['contraseña'] ?? null;
$direccion = $data['direccion'] ?? null;
$telefono = $data['telefono'] ?? null;
$pagina_web = $data['pagina_web'] ?? null;
$avatar = $data['avatar'] ?? null; // Campo de imagen de avatar en base64
$texto_promocional = $data['texto_promocional'] ?? ''; // Nuevo campo de texto promocional

// Verificaciones básicas
if (!$nombre || !$email || !$contraseña || !$direccion || !$telefono || !$pagina_web) {
    echo json_encode(["error" => "Datos incompletos para el registro del negocio."]);
    exit;
}

// Hashear la contraseña
$contraseña_hash = password_hash($contraseña, PASSWORD_DEFAULT);

// Convertir y guardar la imagen de avatar si está presente
$avatarPath = null;
if ($avatar) {
    // Decodificar la imagen de base64
    $imageData = base64_decode($avatar);
    // Generar un nombre de archivo único
    $filename = uniqid() . '.png'; // Asumiendo que la imagen es PNG
    $filePath = 'path/to/avatars/' . $filename; // Asegúrate de tener este directorio creado y con permisos adecuados
    // Guardar la imagen en el servidor
    if (file_put_contents($filePath, $imageData)) {
        $avatarPath = $filePath;
    } else {
        echo json_encode(["error" => "Error al guardar la imagen de avatar"]);
        exit;
    }
}

// Preparar la consulta SQL (incluyendo el campo de avatar y texto promocional si fue exitoso)
$sql = "INSERT INTO negocios (nombre, email, contrasena, direccion, telefono, pagina_web, avatar, columna_texto_promocional) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["error" => "Error al preparar la consulta"]);
    exit;
}

// Asignar y ejecutar
$stmt->bind_param("ssssssss", $nombre, $email, $contraseña_hash, $direccion, $telefono, $pagina_web, $avatarPath, $texto_promocional);
$stmt->execute();

// Verifica si hubo filas afectadas
if ($stmt->affected_rows > 0) {
    echo json_encode(["message" => "Registro exitoso del negocio"]);
} else {
    // Si no hay filas afectadas, podría ser un error o un intento de insertar datos duplicados, etc.
    echo json_encode(["error" => "Error al registrar el negocio"]);
}

$stmt->close();
$conn->close();
?>