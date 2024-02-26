<?php
include 'conexion.php'; // Asegúrate de tener este archivo configurado con las credenciales de tu base de datos

header('Content-Type: application/json');

// Obtén el email del cuerpo de la petición
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];

// Genera un código de verificación de 4 dígitos
$codigo = rand(1000, 9999);

// Prepara la inserción en la base de datos
$stmt = $conn->prepare("INSERT INTO codigos_verificacion (email, codigo) VALUES (?, ?)");
$stmt->bind_param("ss", $email, $codigo);

if ($stmt->execute()) {
    // Envía el correo electrónico
    $para = $email;
    $asunto = "Tu código de verificación";
    $mensaje = "Tu código de verificación es: " . $codigo;
    $cabeceras = "From: info@lweb.ch";

    if (mail($para, $asunto, $mensaje, $cabeceras)) {
        echo json_encode(['message' => 'Código enviado']);
    } else {
        echo json_encode(['message' => 'Error al enviar el correo']);
    }
} else {
    echo json_encode(['error' => 'Error al guardar el código en la base de datos']);
}

$stmt->close();
$conn->close();
?>
