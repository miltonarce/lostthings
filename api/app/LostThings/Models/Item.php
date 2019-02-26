<?php 

namespace LostThings\Models;

use LostThings\DB\DBConnection;
use JsonSerializable;
use Exception;

/**
 * Model de la tabla publicaciones
 */
class Item implements JsonSerializable 
{

  protected $idpublicacion;
  protected $titulo;
  protected $descripcion;
  protected $img;
  protected $fecha_publicacion;
  protected $ubicacion;
  protected $fkidusuario;
  protected $usuario;
  protected $imguser;
  protected $props = ['idpublicacion','titulo','descripcion','img','fecha_publicacion','ubicacion','fkidusuario', 'usuario', 'imguser'];

  /**
   * Implementación de la interfaz JsonSerializable para enviar JSON de respuesta...
   * @return Array
   */
  public function jsonSerialize()
  {
    $defaultProperties = [
      'idpublicacion' => $this->idpublicacion,
      'titulo' => $this->titulo,
      'descripcion' => $this->descripcion,
      'img' => $this->img,
      'fecha_publicacion' => $this->fecha_publicacion,
      'ubicacion' => $this->ubicacion
    ];
    if ($this->fkidusuario !== null) {
      $defaultProperties['fkidusuario']= $this->fkidusuario;
    }
    if ($this->usuario !== null) {
      $defaultProperties['usuario']= $this->usuario;
    }
    if ($this->imguser !== null) {
      $defaultProperties['imguser']= $this->imguser;
    }
    return $defaultProperties;
  }

  /**
   * Permite obtener todas las publicaciones que existen actualmente...
   * @return Item[]
   */
  public function all()
  {
    $db = DBConnection::getConnection();
    $query = "SELECT p.idpublicacion, p.titulo, p.descripcion, p.img, p.fecha_publicacion, p.ubicacion, p.fkidusuario, us.usuario, us.img as imguser
              FROM publicaciones p 
              JOIN usuarios AS us ON us.idusuario = p.fkidusuario ORDER BY p.fecha_publicacion";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $items = [];
    while ($row = $stmt->fetch()) {
      $item = new Item;
      $item->loadDataArray($row);
      $items[] = $item;
    }
    return $items;
  }

  /**
   * Permite realizar una búsqueda por un like contra la descripción de los items
   * @param string $input
   * @return Item[]
   */
  public function search($input) 
  {
    $db = DBConnection::getConnection();
    $query = "SELECT p.idpublicacion, p.titulo, p.descripcion, p.img, p.fecha_publicacion, p.ubicacion, p.fkidusuario, us.usuario 
              FROM publicaciones p 
              JOIN usuarios AS us ON us.idusuario = p.fkidusuario WHERE p.descripcion LIKE :input ORDER BY p.fecha_publicacion";
    $stmt = $db->prepare($query);
    $stmt->execute(['input' => "%$input%"]);
    $items = [];
    while ($row = $stmt->fetch()) {
      $item = new Item;
      $item->loadDataArray($row);
      $items[] = $item;
    }
    return $items;
  }

  /**
   * Permite obtener todas las publicaciones de un usuario en particular
   * @param number $idUser
   * @return Item[]
   */
  public function allItemsByUser($idUser) 
  {
    $db = DBConnection::getConnection();
    $query = "SELECT idpublicacion, titulo, descripcion, img, fecha_publicacion, ubicacion FROM publicaciones WHERE fkidusuario = :idUser";
    $stmt = $db->prepare($query);
    $stmt->execute(['idUser' => $idUser]);
    $items = [];
    while ($row = $stmt->fetch()) {
      $item = new Item;
      $item->loadDataArray($row);
      $items[] = $item;
    }
    return $items;
  }

  /**
   * Permite obtener una publicación especifica por el id de la misma
   * @throws Exception si no se pudo realizar la query
   * @param number $id
   * @return void
   */
  public function getItem($id) 
  {
    $db = DBConnection::getConnection();
    $query = "SELECT p.idpublicacion, p.titulo, p.descripcion, p.img, p.fecha_publicacion, p.ubicacion, p.fkidusuario, us.usuario
    FROM publicaciones AS p 
    JOIN usuarios AS us ON us.idusuario = p.fkidusuario WHERE p.idpublicacion = :id";
    $stmt = $db->prepare($query);
    $success = $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    $this->loadDataArray($row);
    if (!$success) {
      throw new Exception('Error al traer el item solicitado');
    }
  }

  /**
   * Permite guardar una publicación de un usuario particular...
   * @throws Exception si no se pudo realizar la query
   * @param number $idUser
   * @param Array $row
   * @return void
   */
  public function save($idUser, $row)
  {
    $db = DBConnection::getConnection();
    $query = "INSERT INTO publicaciones (titulo, descripcion, img, fecha_publicacion, ubicacion, fkidusuario)
            VALUES (:titulo, :descripcion, :img, :fecha_publicacion, :ubicacion, :fkidusuario)";
    $stmt = $db->prepare($query);
    $success = $stmt->execute([
      'titulo' => $row['titulo'],
      'descripcion' => $row['descripcion'],
      'img' => $row['img'],
      'fecha_publicacion' => date("Y-m-d H:i:s"),
      'ubicacion' => $row['ubicacion'],
      'fkidusuario' => $idUser
    ]);
    if ($success) {
      $row['idpublicacion'] = $db->lastInsertId();
      $this->loadDataArray($row);
    } else {
      throw new Exception('Error al insertar el item en la base de datos.');
    }
  }
  
  /**
   * Permite actualizar una publicación por el id de la misma, y el usuario que la creo...
   * @throws Exception si no se pudo realizar la query
   * @param number $idUser
   * @param Array $row
   * @return void
   */
  public function update($idUser, $row)
  {
    $db = DBConnection::getConnection();
    $query = "UPDATE publicaciones 
                  SET 
                    titulo = :titulo,
                    descripcion = :descripcion,
                    img = :img,
                    fecha_publicacion = :fecha_publicacion,
                    ubicacion = :ubicacion
                  WHERE  idpublicacion = :idpublicacion AND fkidusuario = :fkidusuario";
    $stmt = $db->prepare($query);
    $success = $stmt->execute([
      'idpublicacion' => $row['idpublicacion'],
      'titulo' => $row['titulo'],
      'descripcion' => $row['descripcion'],
      'img' => $row['img'],
      'fecha_publicacion' => date("Y-m-d H:i:s"),
      'ubicacion' => $row['ubicacion'],
      'fkidusuario' => $idUser
    ]);
    if ($success) {
      $row['idpublicacion'] = $db->lastInsertId();
      $this->loadDataArray($row);
    } else {
      throw new Exception('Error al editar el item en la base de datos.');
    }
  }
  
  /**
   * Permite eliminar una publicación por el id de la misma
   * @throws Exception si no se pudo realizar la query
   * @param number $id
   */
  public function delete($idUser, $id)
  {
    $db = DBConnection::getConnection();
    $query = "DELETE FROM publicaciones WHERE idpublicacion = :id and fkidusuario = :iduser LIMIT 1";
    $stmt = $db->prepare($query);
    $success = $stmt->execute(['id' => $id, 'iduser' => $idUser]);
    if (!$success) {
      throw new Exception('Error al borrar el item en la base de datos.');
    }
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