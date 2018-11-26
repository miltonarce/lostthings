<?php
namespace LostThings\Controllers;

use LostThings\Auth\Auth;
use LostThings\Core\View;

class BaseController{
  public function checkUserIsLogged(){
    $token = $_SERVER['HTTP_X_TOKEN'];
    if(!$tokenData = Auth::isTokenValid($token)){
      View::renderJson([
        'status' => -1,
        'message' => 'Se requiere estar autenticado para realizar esta acción.'
      ]);
      exit;
    }
    return $tokenData['idusuario'];
  }
}