<?php
namespace LostThings\Models;

use LostThings\DB\DBConnection;

class User
{
  public $id;
  public $user;
  public $email;
  public $pass;
/**
 * @param $user - usuario ingresado por el input login
 * @return bool - retorna true en caso de que el usuario
 * exista, si no devolvera false
 */
  public function getByEmail($email){
    $db = DBConnection::getConnection();
    $query = "SELECT idusuario, usuario, contraseña, email FROM usuarios
    WHERE email = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$email]);
    if($row = $stmt->fetch()){
      $this->loadDataArray($row);
      return true;
    }else{
      return false;
    }
  }
  /**
   * Carga datps de la $row en el objeto
   * @param array $row
   */
  public function loadDataArray($row){
    $this->id = $row['idusuario'];
    $this->user = $row['usuario'];
    $this->email = $row['email'];
    $this->pass = $row['contraseña'];
  }
}