<?php 

namespace LostThings\Models;

use LostThings\DB\DBConnection;
use JsonSerializable;
use Exception;

/**
 * Model de la tabla de chats 
 */
class Chatsmsgs implements JsonSerializable
{

  protected $idmensaje;
  protected $idusuario;
  protected $usuario;
  protected $mensaje;
  protected $fechamensaje;
  protected $fktokenchat;
  protected $props = ['idmensaje','idusuario', 'usuario', 'mensaje','fechamensaje', 'fktokenchat'];

  /**
   * Implementación de la interfaz JsonSerializable para enviar JSON de respuesta...
   * @return Array
   */
  public function jsonSerialize()
  {
    return[
      'idmensaje' => $this->idmensaje,
      'idusuario' => $this->idusuario,
      'usuario' => $this->usuario,
      'mensaje' => $this->mensaje,
      'fechamensaje' => $this->fechamensaje,
      'fktokenchat' => $this->fktokenchat
    ];
  }

  /**
   * Permite enviar un mensaje que esta asociado a una ventana de chat con dos usuarios especificos...
   * @throws Exception si no se pudo realizar la query
   * @param Array $row
   * @return void
   */
  public function sendmsg($row) 
  {
    $db = DBConnection::getConnection();
    $query = "INSERT INTO mensajes (idusuario, mensaje, fechamensaje, fktokenchat)
            VALUES (:idusuario, :mensaje, :fechamensaje, :fktokenchat)";
    $stmt = $db->prepare($query);
    $success = $stmt->execute([
      'idusuario' => $row['idUser'],
      'mensaje' => $row['msg'],
      'fechamensaje' => date("Y-m-d H:i:s"),
      'fktokenchat' => $row['tokenchat']
    ]);
    if ($success) {
      $row['idmensaje'] = $db->lastInsertId();
      $this->loadDataArray($row);
    } else {
      throw new Exception('Error al insertar el mensaje en la base de datos.');
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
    $query = "SELECT m.idmensaje, m.idusuario, m.mensaje, m.fechamensaje, m.fktokenchat, u.usuario  
    FROM mensajes AS m JOIN usuarios AS u WHERE m.fktokenchat = :tokenchat AND m.idusuario = u.idusuario";
    $stmt = $db->prepare($query);
    $success = $stmt->execute(['tokenchat' => $token]);
    $chatsmsgs = [];
    while ($row = $stmt->fetch()) {
      $msg = new Chatsmsgs;
      $msg->loadDataArray($row);
      $Chatsmsgs[] = $msg;
    }
    if (!$success) {
      throw new Exception("Se produjo un error al obtener todos los mensajes del chat, token $token no valido");
    } 
    return $Chatsmsgs;
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