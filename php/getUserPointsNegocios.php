<?php
header('Content-Type: application/json');
include 'conexion.php';

// Asume que recibes el email del usuario y el email del negocio como parámetro GET o POST
$usuarioEmail = isset($_GET['email']) ? $_GET['email'] : null;
$negocioEmail = isset($_GET['negocioEmail']) ? $_GET['negocioEmail'] : null; // Nueva línea para negocioEmail

// Verificar si alguno de los correos electrónicos no está presente
if (is_null($usuarioEmail) || is_null($negocioEmail)) {
    echo json_encode(["error" => "Faltan datos necesarios."]);
    exit;
}

// Modificar la consulta SQL para filtrar también por el email del negocio
$sql = "SELECT negocios.nombre AS negocioNombre, negocios.columna_texto_promocional AS textoPromocional, negocios.Avatar AS avatar, PuntosNegocios.Puntos AS puntos
        FROM PuntosNegocios
        JOIN usuarios ON PuntosNegocios.ClienteID = usuarios.ID
        JOIN negocios ON PuntosNegocios.NegocioID = negocios.ID
        WHERE usuarios.email = ? AND negocios.email = ?"; // Modificar la consulta para incluir el filtro del negocio

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $usuarioEmail, $negocioEmail); // Cambiar a "ss" ya que ahora hay dos strings
$stmt->execute();
$result = $stmt->get_result();

$puntos = [];
while ($row = $result->fetch_assoc()) {
    $puntos[] = $row;
}

if (count($puntos) > 0) {
    echo json_encode(["success" => true, "puntos" => $puntos]);
} else {
    echo json_encode(["success" => false, "message" => "No se encontraron puntos para el usuario en este negocio."]);
}

$stmt->close();
$conn->close();
?>
