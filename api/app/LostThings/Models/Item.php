<?php 

namespace LostThings\Models;

use LostThings\DB\DBConnection;
use JsonSerializable;
use Exception;

class Item implements JsonSerializable{

  protected $idpublicacion;
  protected $titulo;
  protected $descripcion;
  protected $img;
  protected $fecha_publicacion;
  protected $ubicacion;
  protected $fkidusuario;
  protected $usuario;

  protected $props = ['idpublicacion','titulo','descripcion','img','fecha_publicacion','ubicacion','fkidusuario', 'usuario'];

  public function jsonSerialize(){
    return[
      'idpublicacion' => $this->idpublicacion,
      'titulo' => $this->titulo,
      'descripcion' => $this->descripcion,
      'img' => $this->img,
      'fecha_publicacion' => $this->fecha_publicacion,
      'ubicacion' => $this->ubicacion,
      'fkidusuario' => $this->fkidusuario,
      'usuario' => $this->usuario
    ];
  }

  public function all(){
    $db = DBConnection::getConnection();
    $query = "SELECT p.idpublicacion, p.titulo, p.descripcion, p.img, p.fecha_publicacion, p.ubicacion, p.fkidusuario, us.usuario 
    FROM publicaciones p 
    JOIN usuarios AS us ON us.idusuario = p.fkidusuario ORDER BY p.fecha_publicacion";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $response = [];
    while($row = $stmt->fetch()){
      $item = new Item;
      $item->loadDataArray($row);
      $response[] = $item;
    }
    return $response;
  }

  public function detail($id) {
    $db = DBConnection::getConnection();
    $query = "SELECT p.idpublicacion, p.titulo, p.descripcion, p.img, p.fecha_publicacion, p.ubicacion, p.fkidusuario, us.usuario
    FROM publicaciones AS p 
    JOIN usuarios AS us ON us.idusuario = p.fkidusuario WHERE p.idpublicacion = :id";
    $stmt = $db->prepare($query);
    $success = $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    $this->loadDataArray($row);
    if(!$success){
      throw new Exception('Error al traer el item solicitado');
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
      $response[] = $item;
    }
    if(!$success){
      throw new Exception('Error al traer los comentarios solicitados');
    } 
    return $response;
  }

  public function create($row)
  {
    $db = DBConnection::getConnection();
    $query = "INSERT INTO publicaciones (titulo, descripcion, img, fecha_publicacion, ubicacion, fkidusuario)
            VALUES (:titulo, :descripcion, :img, :fecha_publicacion, :ubicacion, :fkidusuario)";
    $stmt = $db->prepare($query);
    $success = $stmt->execute([
      'titulo' => $row['titulo'],
      'descripcion' => $row['descripcion'],
      'img' => $row['img'],
      'fecha_publicacion' => $row['fecha_publicacion'],
      'ubicacion' => $row['ubicacion'],
      'fkidusuario' => $row['fkidusuario']
    ]);
    
    if($success) {
        $row['idpublicacion'] = $db->lastInsertId();
        $this->loadDataArray($row);
    } else {
        throw new Exception('Error al insertar el item en la base de datos.');
    }
  }
  
  public function edit($row){
    $db = DBConnection::getConnection();
    $query = "UPDATE publicaciones 
                  SET 
                    titulo = ':titulo',
                    descripcion = ':descripcion',
                    img = ':img',
                    fecha_publicacion = ':fecha_publicacion',
                    ubicacion = ':ubicacion'
                  WHERE  idpublicacion = ':idpublicacion' AND fkidusuario = ':fkidusuario'";
                  
    $stmt = $db->prepare($query);
    $success = $stmt->execute([
      'idpublicacion' => $row['idpublicacion'],
      'titulo' => $row['titulo'],
      'descripcion' => $row['descripcion'],
      'img' => $row['img'],
      'fecha_publicacion' => $row['fecha_publicacion'],
      'ubicacion' => $row['ubicacion'],
      'fkidusuario' => $row['fkidusuario']
    ]);
    
    if($success) {
        $row['idpublicacion'] = $db->lastInsertId();
        $this->loadDataArray($row);
    } else {
        throw new Exception('Error al editar el item en la base de datos.');
    }
  }
  
  public function delete($id)
  {
    $db = DBConnection::getConnection();
    $query = "DELETE FROM publicaciones WHERE idpublicacion = ':idpublicacion' LIMIT 1";
    $stmt = $db->prepare($query);
    $success = $stmt->execute(['idpublicacion' => $id]);
    if(!$success){
      throw new Exception('Error al borrar el item en la base de datos.');
    }
  }
  public function loadDataArray($row){
    foreach($this->props as $prop){
      if(isset($row[$prop])){
        $this->{$prop} = $row[$prop];
      }
    }
  }

}