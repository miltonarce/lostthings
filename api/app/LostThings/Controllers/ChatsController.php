<?php

namespace LostThings\Controllers;

use LostThings\Core\View;
use LostThings\Core\Validator;
use LostThings\Core\Route;
use LostThings\Models\Chats;

/**
 * Controller para manejar todas las acciones sobre el modelo Chats
 */
Class ChatsController extends BaseController
{
  /**
   * Permite crear un chat y guardarlo..
   * @return Array
   */
  public function create()
  {
    $params = Route::getUrlParameters();
    $idUser = $this->checkUserIsLogged();
    $d_Post = file_get_contents('php://input');
    $data = json_decode($d_Post, true);
    $tokenchat = uniqid();
      try {
          $chats = new Chats;
          $verify = $chats->verify(['idemisor' => $idUser, 'idreceptor' => $data['idusuario'], 'tokenchat' => $tokenchat]);
          if(empty($verify)){
            $chats = $chats->create(['idemisor' => $idUser, 'idreceptor' => $data['idusuario'], 'tokenchat' => $tokenchat]);
            View::renderJson(['status' => 1, 'message' => 'Chat creado exitosamente.', 'data' => $chats]);
          }else {
            View::renderJson(['status' => 1, 'message' => 'Chat obtenido exitosamente.', 'data' => $verify]);
          }
      } catch (Exeption $e) {
        View::renderJson(['status' => 0, 'message' => $e]);
      }
  }
}