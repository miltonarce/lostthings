<?php
namespace LostThings\Controllers;

use LostThings\Core\App;
use LostThings\Core\View;
use LostThings\Auth\Auth;

class AuthController
{
  
  public function login(){
    $d_Post = file_get_contents('php://input');
    $data = json_decode($d_Post, true);
    $auth = new Auth;
    if($dataLogin = $auth->login($_POST['email'], $_POST['pass'])){
     View::renderJson([
       'status' => 1,
       'data' => $dataLogin
     ]);
    }else{
      View::renderJson([
          'status' => 0,
          'message' => "Usuario o password invalidos."
      ]);
    }
  }
  

}