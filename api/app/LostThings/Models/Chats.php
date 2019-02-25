<?php 

namespace LostThings\Models;

use LostThings\DB\DBConnection;
use JsonSerializable;
use Exception;

/**
 * Model de la tabla de chats 
 */
class Chats implements JsonSerializable
{

  protected $idchat;
  protected $idemisor;
  protected $idreceptor;
  protected $tokenchat;
  protected $fechachat;
  protected $props = ['idchat','idemisor','idreceptor','tokenchat', 'fechachat'];

  /**
   * Implementación de la interfaz JsonSerializable para enviar JSON de respuesta...
   * @return Array
   */
  public function jsonSerialize()
  {
    return[
      'idchat' => $this->idchat,
      'idemisor' => $this->idemisor,
      'idreceptor' => $this->idreceptor,
      'tokenchat' => $this->tokenchat,
      'fechachat' => $this->fechachat
    ];
  }

  /**
   * Permite verificar si existen chats creados para ambos usuarios
   * @throws Exception si no se pudo realizar la query
   * @param Object
   * @return Chats[]
   */
  public function verify($row) 
  {
    $db = DBConnection::getConnection();
    $query = "SELECT * from chats WHERE idemisor = :idemisor AND idreceptor = :idreceptor  
    OR idemisor = :idreceptor AND idreceptor = :idemisor";
    $stmt = $db->prepare($query);
    $success = $stmt->execute([
      'idemisor' => $row['idemisor'],
      'idreceptor' => $row['idreceptor']
    ]);
    $chats = [];
    while ($row = $stmt->fetch()) {
      $msg = new Chats;
      $msg->loadDataArray($row);
      $chats[] = $msg;
    }
    if (!$success) {
      throw new Exception("Se produjo un error al obtener los chat");
    } 
    return $chats;
  }
  /**
   * Permite guardar un cha que esta asociado a una publicación con un usuario especifico...
   * @throws Exception si no se pudo realizar la query
   * @param number $idUser
   * @param Array $row
   * @return void
   */
  public function create($row) 
  {
    $db = DBConnection::getConnection();
    $query = "INSERT INTO chats (idemisor, idreceptor, tokenchat, fechachat)
            VALUES (:idemisor, :idreceptor, :tokenchat, :fechachat)";
    $stmt = $db->prepare($query);
    $data = [
      'idemisor' => $row['idemisor'],
      'idreceptor' => $row['idreceptor'],
      'tokenchat' => $row['tokenchat'],
      'fechachat' => date("Y-m-d H:i:s")
    ];
    $success = $stmt->execute($data);
    if ($success) {
       $this->loadDataArray($row); 
       return $data;
    } else {
      throw new Exception('Error al insertar al abrir el chat.');
    }
  }

  /**
   * Permite obtener todos los mensajes de una chat particular
   * @throws Exception si no se pudo realizar la query
   * @param number $id
   * @return Chatsmsgs[]
   */
  public function all($token) 
  {
    $db = DBConnection::getConnection();
    $query = "SELECT m.idmensaje, m.idusuario, m.mensaje, m.fechamensaje, m.tokenchat, u.usuario  
    FROM mensajes AS m JOIN usuarios AS u WHERE c.tokenchat = :tokenchat AND m.idusuario = u.idusuario";
    $stmt = $db->prepare($query);
    $success = $stmt->execute(['tokenchat' => $token]);
    $chatsmsgs = [];
    while ($row = $stmt->fetch()) {
      $msg = new Chats;
      $msg->loadDataArray($row);
      $Chats[] = $msg;
    }
    if (!$success) {
      throw new Exception("Se produjo un error al obtener todos los mensajes del chat, token $token no valido");
    } 
    return $Chats;
  }

  /**
   * Permite setear todas las properties del object...
   * @return void
   */
  private function loadDataArray($row)
  {
    foreach ($this->props as $prop) {
      if (isset($row[$prop])) {
        $this->{$prop} = $row[$prop];
      }
    }
  }

}