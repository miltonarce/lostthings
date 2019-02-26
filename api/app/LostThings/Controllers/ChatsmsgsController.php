<?php

namespace LostThings\Controllers;

use LostThings\Core\View;
use LostThings\Core\Validator;
use LostThings\Core\Route;
use LostThings\Models\Chatsmsgs;

/**
 * Controller para manejar todas las acciones sobre el modelo de mensajes de Chats
 */
Class ChatsmsgsController extends BaseController
{
  
  /**
   * Permite obtener todos los comentarios de una publicación particular
   * @return Chatsmsgs[]
   */
  public function all()
  {
    $this->checkUserIsLogged();
    $params = Route::getUrlParameters();
    $token = $params['tokenchat'];
    try {
      $chatsmsgs = new Chatsmsgs;
      $chatsmsgs = $chatsmsgs->all($token);
      View::renderJson($chatsmsgs);
    } catch (Exception $e ){
      View::renderJson(['status' => 0, 'message' => $e]);
    }
  }

  /**
   * Permite enviar un mensaje al chat
   * @return Array
   */
  public function sendmsg()
  {
    $this->checkUserIsLogged();
    $d_Post = file_get_contents('php://input');
    $data = json_decode($d_Post, true);
    $validator = new Validator($data, ['msg' => ['required'], 'idUser' =>['required'], 'tokenchat' => ['required']]);
    if ($validator->passes()) {
      try {
          $chatsmsgs = new Chatsmsgs;
          $chatsmsgs->sendmsg(['tokenchat' => $data['tokenchat'],  'idUser' => $data['idUser'], 'msg' => $data['msg']]);
          View::renderJson(['status' => 1, 'message' => 'Comentario creado exitosamente.', 'data' => $chatsmsgs]);
      } catch (Exeption $e) {
        View::renderJson(['status' => 0, 'message' => $e]);
      }
    } else {
      View::renderJson(['status' => 0, 'error' => $validator->getErrores()]);
    }
  }

}