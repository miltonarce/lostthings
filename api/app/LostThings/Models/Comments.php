<?php 

namespace LostThings\Models;

use LostThings\DB\DBConnection;
use JsonSerializable;
use Exception;

/**
 * Model de la tabla comentarios
 */
class Comments implements JsonSerializable
{

  protected $idcomentario;
  protected $fkidusuario;
  protected $fkidpublicacion;
  protected $comentario;
  protected $fecha_publicacion;
  protected $usuario;
  protected $imguser;
  protected $props = ['idcomentario','fkidusuario','fkidpublicacion','comentario','fecha_publicacion', 'usuario', 'imguser'];

  /**
   * Implementación de la interfaz JsonSerializable para enviar JSON de respuesta...
   * @return Array
   */
  public function jsonSerialize()
  {
    return[
      'idcomentario' => $this->idcomentario,
      'fkidusuario' => $this->fkidusuario,
      'fkidpublicacion' => $this->fkidpublicacion,
      'comentario' => $this->comentario,
      'fecha_publicacion' => $this->fecha_publicacion,
      'usuario' => $this->usuario,
      'imguser' => $this->imguser
    ];
  }

  /**
   * Permite guardar un comentario que esta asociado a una publicación con un usuario especifico...
   * @throws Exception si no se pudo realizar la query
   * @param number $idUser
   * @param Array $row
   * @return void
   */
  public function save($idUser, $row) 
  {
    $db = DBConnection::getConnection();
    $query = "INSERT INTO comentarios (fkidpublicacion, fkidusuario, comentario, fecha_publicacion)
            VALUES (:fkidpublicacion, :fkidusuario, :comentario, :fecha_publicacion)";
    $stmt = $db->prepare($query);
    $success = $stmt->execute([
      'fkidpublicacion' => $row['fkidpublicacion'],
      'fkidusuario' => $idUser,
      'comentario' => $row['comentario'],
      'fecha_publicacion' => date("Y-m-d H:i:s")
    ]);
    if ($success) {
      $row['idcomentario'] = $db->lastInsertId();
      $this->loadDataArray($row);
    } else {
      throw new Exception('Error al insertar el comentario en la base de datos.');
    }
  }

  /**
   * Permite obtener todos los comentarios de una publicación particular
   * @throws Exception si no se pudo realizar la query
   * @param number $id
   * @return Comments[]
   */
  public function all($id) 
  {
    $db = DBConnection::getConnection();
    $query = "SELECT  c.idcomentario, c.comentario, c.fecha_publicacion, c.fkidpublicacion, c.fkidusuario, u.usuario, u.img as imguser
    FROM comentarios AS c JOIN usuarios AS u WHERE c.fkidpublicacion = :id AND c.fkidusuario = u.idusuario";
    $stmt = $db->prepare($query);
    $success = $stmt->execute(['id' => $id]);
    $comments = [];
    while ($row = $stmt->fetch()) {
      $comment = new Comments;
      $comment->loadDataArray($row);
      $comments[] = $comment;
    }
    if (!$success) {
      throw new Exception("Se produjo un error al obtener todos los comentarios de la publicacion $id");
    } 
    return $comments;
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