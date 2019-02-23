<?php

namespace LostThings\Controllers;

use LostThings\Models\User;
use LostThings\Core\View;
use LostThings\Core\Validator;
use LostThings\Core\Route;

/**
 * Controller para manejar todas las acciones sobre el perfil del usuario
 */
class ProfileController extends BaseController
{

  /**
   * Permite obtener la información adicional del usuario que esta logueado
   * valida primero que el usuario este logueado...
   * @return User
   */
  public function detail()
  {
    $idUser = $this->checkUserIsLogged();
    $this->getDetail($idUser);
  }

  /**
   * Permite obtener la información adicional del perfil de un usuario
   * por el id del mismo, valida que el usuario que solicita la información
   * este logueado...
   * @return User
   */
  public function detailById() 
  {
    $this->checkUserIsLogged();
    $params = Route::getUrlParameters();
    $id = $params['id'];
    $this->getDetail($id);
  }

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
   * Permite crear un usuario con los datos recibidos...
   * @return Array
   */
  public function save()
  {
    $d_Post = file_get_contents('php://input');
    $request = json_decode($d_Post, true);
    $validator = new Validator($request, [
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
          'usuario' => $request['usuario'],
          'nombre' => $request['nombre'],
          'apellido' => $request['apellido'],
          'password' => password_hash($request['password'], PASSWORD_DEFAULT),
          'email' => $request['email']
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
    $request = json_decode($d_Post, true);
    if (!empty($request['nombre']) && !empty($request['apellido'])) {
      try {  
        $user = new User;
        $user->update($idUser, $request['nombre'], $request['apellido']);
        View::renderJson(['status' => 1, 'message' => 'Perfil editado exitosamente.', 'data' => $request]);
      } catch (Exception $e) {
        View::renderJson(['status' => 0, 'message' => $e]);
      }
    } else if(!empty($request['password']) && !empty($request['newpassword'])) {
      try {  
        $user = new User;
        $user->getById($idUser);
        if (password_verify($request['password'], $user->getPassword())) {
          $newPasword = password_hash($request['newpassword'], PASSWORD_DEFAULT);
          $user->updatePassword($idUser, $newPasword);
          View::renderJson(['status' => 1, 'message' => 'Se actualizó la contraseña']);
        } else {
          View::renderJson(['status' => 1, 'message' => 'La contraseña es incorrecta']);
        }
      } catch (Exception $e) {
        View::renderJson(['status' => 0, 'message' => $e]);
      }
    } else {
      View::renderJson(['status' => 0, 'message' => 'No paso los parametros deseados.']);
    }
  }

  /**
   * Permite obtener el detalle de un usuario por el id 
   * @param number $idUser
   */
  private function getDetail($idUser) 
  {
    $user = new User;
    $user->getById($idUser);
    View::renderJson(['status' => 1, 'data' => $user]);
  }
 
}