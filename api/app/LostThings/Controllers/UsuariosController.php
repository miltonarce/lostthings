<?php

namespace LostThings\Controllers;

use LostThings\Models\User;
use LostThings\Core\View;
use LostThings\Core\Route;

class UsuariosController{
  public function create(){
    $d_Post = file_get_contents('php://input');
    $data = json_decode($d_Post, true);
    try{
      $user = new User;
      $user->createUser([
        'usuario' => $data['usuario'],
        'nombre' => $data['nombre'],
        'apellido' => $data['apellido'],
        'fecha_alta' => $data['fecha_alta'],
        'password' => password_hash($data['password'], PASSWORD_DEFAULT),
        'email' => $data['email']
      ]);

      View::renderJson([
        'status' => 1,
        'message' => 'Usuario creado exitosamente.'
      ]);
    }catch(Exeption $e){
      View::renderJson([
        'status' => 0,
        'message' => $e
      ]);
    }
  }
}