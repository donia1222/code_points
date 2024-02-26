<?php
header('Content-Type: application/json');
include 'conexion.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? null;

if (!$email) {
    echo json_encode(["error" => "Falta información del usuario."]);
    exit;
}

// Incluir la columna 'avatar' en la selección
$sql = "SELECT nombre, direccion, telefono, pagina_web, avatar, columna_texto_promocional  FROM negocios WHERE email = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    // Manejo del error en caso de que la preparación de la consulta falle
    echo json_encode(["error" => "Error al preparar la consulta"]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $datos_usuario = $result->fetch_assoc();
    // Asegúrate de que la ruta del avatar sea accesible para el cliente. Puedes necesitar ajustar esta ruta.
    // Si la ruta del avatar es relativa, considera convertirla a una ruta absoluta o URL.
    if ($datos_usuario['avatar']) {
        $datos_usuario['avatar'] = '/negocios/uploads/avatars/' . $datos_usuario['avatar'];
    }
    echo json_encode(["message" => "Datos obtenidos con éxito", "datos_usuario" => $datos_usuario]);
} else {
    echo json_encode(["error" => "Usuario no encontrado"]);
}

$stmt->close();
$conn->close();
?>