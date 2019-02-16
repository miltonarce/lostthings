<?php

namespace LostThings\Controllers;

use LostThings\Models\User;
use LostThings\Core\View;
use LostThings\Core\Validator;
use LostThings\Core\Route;

class UsuariosController extends BaseController
{

   /**
   * Permite obtener todos los usuarios que matcheen con la busqueda ingresada por el usuario
   * realiza un like contra varios campos, valida primero que el usuario este logueado...
   * @return User[]
   */
  public function search() 
  {
    $this->checkUserIsLogged();
    $params = Route::getUrlParameters();
    $input = $params['input'];
    $user = new User;
    View::renderJson($user->search($input));
  }

  /**
   * Permite obtener la información adicional del usuario que esta logueado
   * valida primero que el usuario este logueado...
   * @return User
   */
  public function detail()
  {
    $idUser = $this->checkUserIsLogged();
    $user = new User;
    $user->getById($idUser);
    View::renderJson([
      'status' => 1,
			'data' => [
        'idusuario'	=> $user->id,
        'nombre' => $user->nombre,
        'apellido' => $user->apellido,
        'fecha_alta' => $user->fecha_alta,
				'usuario' => $user->user,
				'email' => $user->email
      ]
    ]);
  }

  /**
   * Permite crear un usuario con los datos recibidos...
   * @return Array
   */
  public function save()
  {
    $d_Post = file_get_contents('php://input');
    $data = json_decode($d_Post, true);
    $validator = new Validator($data, [
      'usuario' => ['required'],
      'nombre' => ['required'],
      'apellido' => ['required'],
      'password' => ['required'],
      'email' => ['required']
    ]);
    if ($validator->passes()) {
      try {
        $user = new User;
        $user->save([
          'usuario' => $data['usuario'],
          'nombre' => $data['nombre'],
          'apellido' => $data['apellido'],
          'password' => password_hash($data['password'], PASSWORD_DEFAULT),
          'email' => $data['email']
        ]);
        View::renderJson(['status' => 1, 'message' => 'Usuario creado exitosamente.']);
      } catch(Exeption $e) {
        View::renderJson(['status' => 0, 'message' => $e]);
      }
    } else {
      View::renderJson(['status' => 0, 'error' => $validator->getErrores()]);
    }
  }

  /**
   * Permite actualizar los datos del usuario
   */
  public function update()
  {
    $idUser = $this->checkUserIsLogged();
    $d_Post = file_get_contents('php://input');
    $data = json_decode($d_Post, true);
    if (!empty($data['nombre']) && !empty($data['apellido'])) {
      try {  
        $user = new User;
        $user->update($idUser, $data['nombre'], $data['apellido']);
        View::renderJson(['status' => 1, 'message' => 'Perfil editado exitosamente.', 'data' => $data]);
      } catch (Exception $e) {
        View::renderJson(['status' => 0, 'message' => $e]);
      }
    } else if(!empty($data['password']) && !empty($data['newpassword'])) {
      try {  
      $user = new User;
      $user->updatePassword($idUser, password_hash($data['password'], PASSWORD_DEFAULT), password_hash($data['newpassword'], PASSWORD_DEFAULT));
      View::renderJson(['status' => 1, 'message' => 'Password modificada exitosamente.', 'data' => $data]);
    } catch (Exception $e) {
      View::renderJson(['status' => 0, 'message' => $e]);
    }
    } else {
      View::renderJson(['status' => 0, 'message' => 'No paso los parametros deseados.']);
    }
  }
 
}