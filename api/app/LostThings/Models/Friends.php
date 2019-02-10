<?php 

namespace LostThings\Models;

use LostThings\DB\DBConnection;
use JsonSerializable;
use Exception;

class Friends implements JsonSerializable{

  protected $idamigo;
  protected $usuario;
  protected $nombre;
  protected $apellido;
  protected $email;
  protected $img;
  protected $fecha_amigos_desde;

  protected $props = ['idamigo','usuario','nombre','apellido','email', 'img', 'fecha_amigos_desde'];

  public function jsonSerialize(){
    return[
      'idamigo' => $this->idamigo,
      'usuario' => $this->usuario,
      'nombre' => $this->nombre,
      'apellido' => $this->apellido,
      'email' => $this->email,
      'img' => $this->img,
      'fecha_amigos_desde' => $this->fecha_amigos_desde
    ];
  }

  public function getFriendsByUser($idusuario) {
    $db = DBConnection::getConnection();
    $query = "SELECT u.idusuario idamigo, u.usuario, u.nombre, u.apellido, u.email, u.img, a.fecha_alta fecha_amigos_desde FROM amigos a
                INNER JOIN usuarios u ON a.idamigo = u.idusuario
                WHERE a.idusuario = :idusuario AND a.estado = 1";
    $stmt = $db->prepare($query);
    $success = $stmt->execute(['idusuario' => $idusuario]);
    $friends = [];
    while($row = $stmt->fetch()){
      $friend = new Friends;
      $friend->loadDataArray($row);
      $friends[] = $friend;
    }
    if(!$success){
      throw new Exception('Error al traer los amigos del usuario');
    } 
    return $friends;
  }

  public function loadDataArray($row){
    foreach($this->props as $prop){
      if(isset($row[$prop])){
        $this->{$prop} = $row[$prop];
      }
    }
  }

}