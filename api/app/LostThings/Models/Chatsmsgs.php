<?php 

namespace LostThings\Models;

use LostThings\DB\DBConnection;
use JsonSerializable;
use Exception;

/**
 * Model de la tabla de chats mensajes
 */
class Chatsmsgs implements JsonSerializable
{

  protected $idchat;
  protected $idemisor;
  protected $usuario;
  protected $mensaje;
  protected $fecha;
  protected $tokenchat;
  protected $props = ['idchat','idemisor','mensaje','fecha', 'tokenchat', 'usuario'];

  /**
   * Implementación de la interfaz JsonSerializable para enviar JSON de respuesta...
   * @return Array
   */
  public function jsonSerialize()
  {
    return[
      'idchat' => $this->idchat,
      'idemisor' => $this->idemisor,
      'usuario' => $this->usuario,
      'mensaje' => $this->mensaje,
      'fecha' => $this->fecha,
      'tokenchat' => $this->tokenchat
    ];
  }

  /**
   * Permite guardar un cha que esta asociado a una publicación con un usuario especifico...
   * @throws Exception si no se pudo realizar la query
   * @param number $idUser
   * @param Array $row
   * @return void
   */
  // public function save($idUser, $row) 
  // {
  //   $db = DBConnection::getConnection();
  //   $query = "INSERT INTO comentarios (fkidpublicacion, fkidusuario, comentario, fecha_publicacion)
  //           VALUES (:fkidpublicacion, :fkidusuario, :comentario, :fecha_publicacion)";
  //   $stmt = $db->prepare($query);
  //   $success = $stmt->execute([
  //     'fkidpublicacion' => $row['fkidpublicacion'],
  //     'fkidusuario' => $idUser,
  //     'comentario' => $row['comentario'],
  //     'fecha_publicacion' => date("Y-m-d H:i:s")
  //   ]);
  //   if ($success) {
  //     $row['idcomentario'] = $db->lastInsertId();
  //     $this->loadDataArray($row);
  //   } else {
  //     throw new Exception('Error al insertar el comentario en la base de datos.');
  //   }
  // }

  /**
   * Permite obtener todos los mensajes de una chat particular
   * @throws Exception si no se pudo realizar la query
   * @param number $id
   * @return Chatsmsgs[]
   */
  public function all($token) 
  {
    $db = DBConnection::getConnection();
    $query = "SELECT c.idchat, c.idemisor, c.mensaje, c.fecha, c.tokenchat, u.usuario  
    FROM chats AS c JOIN usuarios AS u WHERE c.tokenchat = :tokenchat AND c.idemisor = u.idusuario";
    $stmt = $db->prepare($query);
    $success = $stmt->execute(['tokenchat' => $token]);
    $chatsmsgs = [];
    while ($row = $stmt->fetch()) {
      $msg = new Chatsmsgs;
      $msg->loadDataArray($row);
      $chatsmsgs[] = $msg;
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