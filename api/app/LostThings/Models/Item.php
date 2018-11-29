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
                    ubicacion = ':ubicacion',
                    fkidusuario = ':fkidusuario'
                  WHERE  idpublicacion = :idpublicacion";

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
        $row['idpublicacion.'] = $db->lastInsertId();
        $this->loadDataArray($row);
    } else {
        throw new Exception('Error al insertar el item en la base de datos.');
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