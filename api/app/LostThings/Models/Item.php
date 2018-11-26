<?php 

namespace LostThings\Models;

use LostThings\DB\DBConnection;
use JsonSerializable;

class Item implements JsonSerializable{

  protected $idpublicacion;
  protected $titulo;
  protected $descripcion;
  protected $img;
  protected $fecha_publicacion;
  protected $ubicacion;
  protected $fkidusuario;

  protected $props = ['idpublicacion','titulo','descripcion','img','fecha_publicacion','ubicacion','fkidusuario'];

  public function jsonSerialize(){
    return[
      'idpublicacion' => $this->idpublicacion,
      'titulo' => $this->titulo,
      'descripcion' => $this->descripcion,
      'img' => $this->img,
      'fecha_publicacion' => $this->fecha_publicacion,
      'ubicacion' => $this->ubicacion,
      'fkidusuario' => $this->fkidusuario
    ];
  }

  public function all(){
    $db = DBConnection::getConnection();
    $query = "SELECT p.idpublicacion, p.titulo, p.descripcion, p.img, p.fecha_publicacion, p.ubicacion, us.usuario 
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

  public function loadDataArray($row){
    foreach($this->props as $prop){
      if(isset($row[$prop])){
        $this->{$prop} = $row[$prop];
      }
    }
  }

}