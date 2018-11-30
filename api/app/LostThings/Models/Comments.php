<?php 

namespace LostThings\Models;

use LostThings\DB\DBConnection;
use JsonSerializable;
use Exception;

class Comments implements JsonSerializable{

  protected $idcomentario;
  protected $fkidusuario;
  protected $fkidpublicacion;
  protected $comentario;
  protected $fecha_publicacion;

  protected $props = ['idcomentario','fkidusuario','fkidpublicacion','comentario','fecha_publicacion'];

  public function jsonSerialize(){
    return[
      'idcomentario' => $this->idcomentario,
      'fkidusuario' => $this->fkidusuario,
      'fkidpublicacion' => $this->fkidpublicacion,
      'comentario' => $this->comentario,
      'fecha_publicacion' => $this->fecha_publicacion
    ];
  }

  public function createComment($row){
    
    $db = DBConnection::getConnection();
    $query = "INSERT INTO comentarios (fkidpublicacion, fkidusuario, comentario, fecha_publicacion)
            VALUES (:fkidpublicacion, :fkidusuario, :comentario, :fecha_publicacion)";
    $stmt = $db->prepare($query);
    $success = $stmt->execute([
      'fkidpublicacion' => $row['fkidpublicacion'],
        'fkidusuario' => $row['fkidusuario'],
        'comentario' => $row['comentario'],
        'fecha_publicacion' => $row['fecha_publicacion']
    ]);
    
    if($success) {
        $row['idcomentario'] = $db->lastInsertId();
        $this->loadDataArray($row);
    } else {
        throw new Exception('Error al insertar el comentario en la base de datos.');
    }
  }

  public function getItemsComents($id) {
    $db = DBConnection::getConnection();
    $query = "SELECT  c.idcomentario, c.comentario, c.fecha_publicacion, c.fkidpublicacion, c.fkidusuario, u.usuario 
    FROM comentarios AS c JOIN usuarios AS u WHERE c.fkidpublicacion = :id AND c.fkidusuario = u.idusuario";
    $stmt = $db->prepare($query);
    $success = $stmt->execute(['id' => $id]);
    $response = [];
    while($row = $stmt->fetch()){
      $comments = new Comments;
      $comments->loadDataArray($row);
      $response[] = $comments;
    }
    if(!$success){
      throw new Exception('Error al traer los comentarios solicitados');
    } 
    return $response;
  }

  public function loadDataArray($row){
    foreach($this->props as $prop){
      if(isset($row[$prop])){
        $this->{$prop} = $row[$prop];
      }
    }
  }

}