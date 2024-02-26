<?php
header('Content-Type: application/json');
include 'conexion.php'; // Asegúrate de tener este archivo y que contenga la conexión a tu base de datos

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? null;
$contraseña = $data['contraseña'] ?? null;

if (!$email || !$contraseña) {
    echo json_encode(["error" => "Faltan datos para el inicio de sesión."]);
    exit;
}

$sql = "SELECT * FROM negocios WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $usuario = $result->fetch_assoc();
    if (password_verify($contraseña, $usuario['contrasena'])) {
        echo json_encode(["message" => "Inicio de sesión exitoso", "usuario" => $usuario]);
    } else {
        echo json_encode(["error" => "Contraseña incorrecta"]);
    }
} else {
    echo json_encode(["error" => "Usuario no encontrado"]);
}

$stmt->close();
$conn->close();
?>
