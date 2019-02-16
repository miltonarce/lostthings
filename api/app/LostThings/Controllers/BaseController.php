<?php
namespace LostThings\Controllers;

use LostThings\Auth\Auth;
use LostThings\Core\View;

/**
 * Controller básico que verifica el token ...
 */
class BaseController 
{

  /**
   * Permite verificar si el usuario esta logueado, primero
   * verifica si en el header existe el encabezado y valida la expiración del token,
   * si existe devuelve la info adicional...
   * @return number idusuario
   */
  public function checkUserIsLogged() 
  {
      $token = $_SERVER['HTTP_X_TOKEN'];
      if (!$tokenData = Auth::isTokenValid($token)) {
        View::renderJson(['status' => -1, 'message' => 'Se requiere estar autenticado para realizar esta acción.']);
        exit;
      }
      return $tokenData['idusuario'];
    } 

}