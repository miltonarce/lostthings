<?php

namespace LostThings\Controllers;

use LostThings\Core\View;
use LostThings\Core\Route;
use LostThings\Models\Friends;
use LostThings\Models\User;
use LostThings\Core\Validator;

/**
 * Controller para manejar todas las acciones sobre el modelo Friends
 */
Class FriendsController extends BaseController 
{
  
  /**
   * Permite obtener todos los amigos que posee un usuario por el id del mismo
   * @return Friends[]
   */
  public function all()
  {
    $idUser = $this->checkUserIsLogged();
    try {
      $friends = new Friends;
      View::renderJson($friends->all($idUser));
    } catch (Exception $e) {
      View::renderJson(['status' => 0, 'message' => $e]);
    }
  }

  /**
   * Permite eliminar un amigo de la lista de amigos de un usuario por el id del mismo
   * @return Array
   */
  public function delete() 
  {
    $idUser = $this->checkUserIsLogged();
    $params = Route::getUrlParameters();
    $idFriend = $params['id'];
    try {
      $friends = new Friends;
      $friends->delete($idUser, $idFriend);
      View::renderJson(['status' => 1, 'message' => 'Se eliminó correctamente el amigo de la lista de amigos']);
    } catch (Exception $e) {
      View::renderJson(['status' => 0, 'message' => $e]);
    }
  }

  /**
   * Permite obtener todas las solicitudes de amistad que posee un usuario por el id del mismo
   * @return Users[]
   */
  public function allRequest() 
  {
    $idUser = $this->checkUserIsLogged();
    try {
      $friends = new Friends;
      View::renderJson($friends->allRequest($idUser));
    } catch (Exception $e) {
      View::renderJson(['status' => 0, 'message' => $e]);
    }
  }

  /**
   * Permite enviar una solicitud de amistad a un usuario por el id del mismo,
   * primero verifica que existan ambos usuarios
   * @return Array
   */
  public function sendRequest() 
  {
    $idUser = $this->checkUserIsLogged();
    $params = Route::getUrlParameters();
    $idFriend = $params['id'];
    try {
      $user = new User;
      $exitsUsers = $user->verifyUsers($idUser, $idFriend);
      if ($exitsUsers) {
        $friend = new Friends;
        $friend->save($idUser, $idFriend);
        View::renderJson(['status' => 1, 'message' => 'Se envio la solicitud de amistad']);
      } else {
        View::renderJson(['status' => 0, 'message' => "No existe ningún usuario con el id " . $idUser]);
      }
    } catch (Exception $e) {
      View::renderJson(['status' => 0, 'message' => $e]);
    }
  }

  /**
   * Permite aceptar una invitación que se le envió a un usuario por el id
   * @return Array
   */
  public function acceptRequest() 
  {
    $idUser = $this->checkUserIsLogged();
    $params = Route::getUrlParameters();
    $idFriend = $params['id'];
    try {
      $friends = new Friends;
      $friends->updateStatus($idUser, $idFriend);
      View::renderJson(['status' => 1, 'message' => 'Se acepto la solicitud de amistad correctamente']);
    } catch (Exception $e) {
      View::renderJson(['status' => 0, 'message' => $e]);
    }
  }

}