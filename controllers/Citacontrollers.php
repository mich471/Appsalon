<?php
namespace Controllers;

use MVC\Router;

Class Citacontrollers  {
    public static function index(Router $router){

        session_start();

        isAuth();
        //debuguear($_SESSION);
        $router->render('cita/index', [
            'nombre' => $_SESSION['nombre'],
            'id' => $_SESSION['id']
         ]);
    }
}