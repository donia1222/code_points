<?php
include 'conexion.php'; // Utiliza el mismo archivo de conexión que antes

header('Content-Type: application/json');

// Obtén el email y el código del cuerpo de la petición
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'];
$codigo = $data['codigo'];

// Prepara la consulta para verificar el código
$stmt = $conn->prepare("SELECT * FROM codigos_verificacion WHERE email = ? AND codigo = ? LIMIT 1");
$stmt->bind_param("ss", $email, $codigo);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // El código es correcto, puedes proceder a marcar el email como verificado en tu tabla de usuarios o realizar la acción que consideres necesaria
    echo json_encode(['message' => 'Verificación exitosa']);
    // Aquí podrías agregar un paso adicional para actualizar el estado de verificación del usuario en tu tabla de usuarios, si es necesario.
} else {
    // El código no coincide
    echo json_encode(['message' => 'Código de verificación incorrecto']);
}

$stmt->close();
$conn->close();
?>
