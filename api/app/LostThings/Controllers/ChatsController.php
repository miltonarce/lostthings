<?php

namespace LostThings\Controllers;

use LostThings\Core\View;
use LostThings\Core\Validator;
use LostThings\Core\Route;
use LostThings\Models\Chatsmsgs;

/**
 * Controller para manejar todas las acciones sobre el modelo Chats
 */
Class ChatsController extends BaseController
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
   * Permite crear un comentario en la publicación y guardarlo..
   * @return Array
   */
  // public function save()
  // {
  //   $params = Route::getUrlParameters();
  //   $idpublicacion = $params['idPublish'];
  //   $idUser = $this->checkUserIsLogged();
  //   $d_Post = file_get_contents('php://input');
  //   $data = json_decode($d_Post, true);
  //   $validator = new Validator($data, ['comentario' => ['required']]);
  //   if ($validator->passes()) {
  //     try {
  //         $comments = new Comments;
  //         $comments->save($idUser, ['fkidpublicacion' => $idpublicacion, 'comentario' => $data['comentario']]);
  //         View::renderJson(['status' => 1, 'message' => 'Comentario creado exitosamente.', 'data' => $comments]);
  //     } catch (Exeption $e) {
  //       View::renderJson(['status' => 0, 'message' => $e]);
  //     }
  //   } else {
  //     View::renderJson(['status' => 0, 'error' => $validator->getErrores()]);
  //   }
  // }

}