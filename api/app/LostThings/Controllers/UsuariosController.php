<?php

namespace LostThings\Controllers;

use LostThings\Models\User;
use LostThings\Core\View;
use LostThings\Core\Validator;
use LostThings\Core\Route;

class UsuariosController extends BaseController{
  /**
  * Metodo para  crear usuarios
  * @return bool 1 se creo el elemento 0 no se creo
  */
  public function create(){
    $d_Post = file_get_contents('php://input');
    $data = json_decode($d_Post, true);

    $validator = new Validator($data, [
      'usuario' => ['required'],
      'nombre' => ['required'],
      'apellido' => ['required'],
      'fecha_alta' => ['required'],
      'password' => ['required'],
      'email' => ['required']
    ]);

    if ($validator->passes()) {
      try {
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
      } catch(Exeption $e) {
        View::renderJson([
          'status' => 0,
          'message' => $e
        ]);
      }
    } else {
      View::renderJson([
        'status' => 0,
        'error' => $validator->getErrores()
      ]);
    }
  }

  public function profile(){
    $userID = $this->checkUserIsLogged();

    $user = new User;
    $user->getById($userID);

    View::renderJson([
      'status' => 1,
			'data' => [
        'idusuario' 		=> $user->id,
        'nombre' 		=> $user->nombre,
        'apellido' 		=> $user->apellido,
        'fecha_alta' 		=> $user->fecha_alta,
				'usuario' 	=> $user->user,
				'email' 	=> $user->email,
      ]
    ]);
  }

}