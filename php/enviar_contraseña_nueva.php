<?php
include 'conexion.php'; // Asegúrate de tener este archivo configurado con las credenciales de tu base de datos

header('Content-Type: application/json');

// Obtén el email del cuerpo de la petición
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];

// Genera una nueva contraseña de forma aleatoria
function generarContraseña($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomPassword = '';
    for ($i = 0; $i < $length; $i++) {
        $randomPassword .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomPassword;
}

$nuevaContraseña = generarContraseña(8); // Genera una contraseña de 8 caracteres
$nuevaContraseñaHash = password_hash($nuevaContraseña, PASSWORD_DEFAULT); // Hashea la nueva contraseña

// Actualiza la contraseña en la base de datos
$sql = "UPDATE usuarios SET contraseña = ? WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $nuevaContraseñaHash, $email);

if ($stmt->execute()) {
    // Envía el correo electrónico con la nueva contraseña
    $para = $email;
    $asunto = "Tu nueva contraseña";
    $mensaje = "Tu nueva contraseña es: " . $nuevaContraseña;
    $cabeceras = "From: info@tuweb.com";

    if (mail($para, $asunto, $mensaje, $cabeceras)) {
        echo json_encode(['message' => 'Nueva contraseña enviada']);
    } else {
        echo json_encode(['message' => 'Error al enviar el correo con la nueva contraseña']);
    }
} else {
    echo json_encode(['error' => 'Error al actualizar la contraseña en la base de datos']);
}

$stmt->close();
$conn->close();
?>
