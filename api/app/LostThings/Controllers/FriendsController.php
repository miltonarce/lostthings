<?php

namespace LostThings\Controllers;

use LostThings\Core\View;
use LostThings\Core\Route;
use LostThings\Models\Friends;

Class FriendsController extends BaseController{
   
  public function getFriendsByUser(){
    $params = Route::getUrlParameters();
    $idUser = $params['idUser'];
    try{
      $friends = new Friends;
      View::renderJson($friends->getFriendsByUser($idUser));
    }catch(Exception $e){
      View::renderJson([
      'status' => 0,
      'message' => $e
      ]);
    }
  }


}