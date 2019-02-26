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
    $defaultProperties = [
      'idmensaje' => $this->idmensaje,
      'idusuario' => $this->idusuario,
      'mensaje' => $this->mensaje,
      'fechamensaje' => $this->fechamensaje,
      'fktokenchat' => $this->fktokenchat
    ];
    if ($this->usuario !== null) {
      $defaultProperties['usuario']= $this->usuario;
    }
    return $defaultProperties;
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
    $dateMsg = date("Y-m-d H:i:s");
    $success = $stmt->execute([
      'idusuario' => $row['idUser'],
      'mensaje' => $row['msg'],
      'fechamensaje' => $dateMsg,
      'fktokenchat' => $row['tokenchat']
    ]);
    if ($success) {
      $row['idmensaje'] = $db->lastInsertId();
      $row['idusuario'] = $row['idUser'];
      $row['mensaje'] = $row['msg'];
      $row['fechamensaje'] = $dateMsg;
      $row['fktokenchat'] = $row['tokenchat'];
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
      $chatsmsg = new Chatsmsgs;
      $chatsmsg->loadDataArray($row);
      $chatsmsgs[] = $chatsmsg;
    }
    if (!$success) {
      throw new Exception("Se produjo un error al obtener todos los mensajes del chat, token $token no valido");
    } 
    return $chatsmsgs;
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