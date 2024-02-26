<?php
header('Content-Type: application/json');

include 'conexion.php';

// Recibir datos enviados desde React Native
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $email = $data['email'];
    $contraseña = $data['contraseña'];

    // Consultar el usuario en la base de datos
    $sql = "SELECT id, nombre, email, contraseña FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Verificar la contraseña
        if (password_verify($contraseña, $user['contraseña'])) {
            // Contraseña correcta, devolver datos del usuario (sin la contraseña)
            unset($user['contraseña']); // Eliminar la contraseña por seguridad
            echo json_encode(["success" => true, "user" => $user]);
        } else {
            // Contraseña incorrecta
            echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
        }
    } else {
        // Usuario no encontrado
        echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Datos no recibidos"]);
}

$stmt->close();
$conn->close();
?>
