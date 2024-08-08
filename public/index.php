<?php 

require_once __DIR__ . '/../includes/app.php';

use Controllers\AdminControllers;
use Controllers\ApiControllers;
use Controllers\Citacontrollers;
use MVC\Router;
use Controllers\LoginControllers;
use Controllers\ServicioControllers;

$router = new Router();

//Inicuar sesion
$router->get('/', [LoginControllers::class, 'login']);
$router->post('/', [LoginControllers::class, 'login']);
$router->get('/logout', [LoginControllers::class, 'logout']);

//Recupera password
$router->get('/olvide', [LoginControllers::class, 'olvide']);
$router->post('/olvide', [LoginControllers::class, 'olvide']);
$router->get('/recuperar', [LoginControllers::class, 'recuperar']);
$router->post('/recuperar', [LoginControllers::class, 'recuperar']);

//Recuperar cuenta
$router->get('/crear-cuenta', [LoginControllers::class, 'crear']);
$router->post('/crear-cuenta', [LoginControllers::class, 'crear']);

//Confirmar cuenta
$router->get('/confirmar-cuenta', [LoginControllers::class, 'confirmar']);
$router->get('/mensaje', [LoginControllers::class, 'mensaje']);

//Area privada
$router->get('/cita', [Citacontrollers::class, 'index']);
$router->get('/admin', [AdminControllers::class, 'index']);

//Api de citas
$router->get('/api/servicios', [ApiControllers::class, 'index']);
$router->post('/api/citas', [ApiControllers::class, 'guardar']);
$router->post('/api/eliminar', [ApiControllers::class, 'eliminar']);

//CRUD ser vicios
$router->get('/servicios', [ServicioControllers::class, 'index']);
$router->get('/servicios/crear', [ServicioControllers::class, 'crear']);
$router->post('/servicios/crear', [ServicioControllers::class, 'crear']);
$router->get('/servicios/actualizar', [ServicioControllers::class, 'actualizar']);
$router->post('/servicios/actualizar', [ServicioControllers::class, 'actualizar']);
$router->post('/servicios/eliminar', [ServicioControllers::class, 'eliminar']);

// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();