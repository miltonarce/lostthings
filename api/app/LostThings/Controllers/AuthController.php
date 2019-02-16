<?php
namespace LostThings\Controllers;

use LostThings\Core\App;
use LostThings\Core\View;
use LostThings\Core\Validator;
use LostThings\Auth\Auth;

/**
 * Controller para manejar todas las acciones sobre autenticación del user
 */
class AuthController
{

  /**
   * Permite autenticar al usuario valida los datos y devuelve info adicional
   * @return Array
   */
  public function login()
  {
    $d_Post = file_get_contents('php://input');
    $data = json_decode($d_Post, true);
    $auth = new Auth;
    $validator = new Validator($data, ['email' => ['required'], 'password' => ['required']]);
    if ($validator->passes()) {
      if ($dataLogin = $auth->login($data['email'], $data['password'])) {
        View::renderJson(['status' => 1, 'data' => $dataLogin]);
      } else {
        View::renderJson(['status' => 0, 'message' => 'Usuario o password inválidos']);
      }
    } else {
      View::renderJson(['status' => 0, 'error' => $validator->getErrores()]);
    }
  }

}