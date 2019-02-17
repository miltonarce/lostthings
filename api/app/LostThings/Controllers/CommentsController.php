<?php

namespace LostThings\Controllers;

use LostThings\Models\Item;
use LostThings\Core\View;
use LostThings\Core\Validator;
use LostThings\Core\Route;
use LostThings\Models\Comments;

/**
 * Controller para manejar todas las acciones sobre el modelo Comments
 */
Class CommentsController extends BaseController
{
  
  /**
   * Permite obtener todos los comentarios de una publicación particular
   * @return Comments[]
   */
  public function all()
  {
    $this->checkUserIsLogged();
    $params = Route::getUrlParameters();
    $id = $params['idPublish'];
    try {
      $comments = new Comments;
      $comments = $comments->all($id);
      View::renderJson($comments);
    } catch (Exception $e ){
      View::renderJson(['status' => 0, 'message' => $e]);
    }
  }

  /**
   * Permite crear un comentario en la publicación y guardarlo..
   * @return Array
   */
  public function save()
  {
    $params = Route::getUrlParameters();
    $idpublicacion = $params['idPublish'];
    $idUser = $this->checkUserIsLogged();
    $d_Post = file_get_contents('php://input');
    $data = json_decode($d_Post, true);
    $validator = new Validator($data, ['comentario' => ['required']]);
    if ($validator->passes()) {
      try {
          $comments = new Comments;
          $comments->save($idUser, ['fkidpublicacion' => $idpublicacion, 'comentario' => $data['comentario']]);
          View::renderJson(['status' => 1, 'message' => 'Comentario creado exitosamente.', 'data' => $comments]);
      } catch (Exeption $e) {
        View::renderJson(['status' => 0, 'message' => $e]);
      }
    } else {
      View::renderJson(['status' => 0, 'error' => $validator->getErrores()]);
    }
  }

}