<?php 

namespace LostThings\Models;

use LostThings\DB\DBConnection;
use JsonSerializable;
use Exception;

/**
 * Model de la tabla amigos
 */
class Friends implements JsonSerializable 
{

  protected $idamigo;
  protected $usuario;
  protected $nombre;
  protected $apellido;
  protected $email;
  protected $img;
  protected $fecha_amigos_desde;
  protected $props = ['idamigo','usuario','nombre','apellido','email', 'img', 'fecha_amigos_desde'];

  /**
   * Implementación de la interfaz JsonSerializable para enviar JSON de respuesta...
   * @return Array
   */
  public function jsonSerialize() 
  {
    return[
      'idamigo' => $this->idamigo,
      'usuario' => $this->usuario,
      'nombre' => $this->nombre,
      'apellido' => $this->apellido,
      'email' => $this->email,
      'img' => $this->img,
      'fecha_amigos_desde' => $this->fecha_amigos_desde
    ];
  }

  /**
   * Permite realizar una consulta a la base de datos para obtener todos los amigos de una persona
   * cuyo estado es 1 (osea acepto la solicitud de amistad), se realiza un UNION ALL para no repertir
   * los pares (1, 2) , (2, 1)
   * @throws Exception si no se pudo realizar la query
   * @param number $idusuario
   * @return Friends[] $friends
   */
  public function all($idusuario) 
  {
    $db = DBConnection::getConnection();
    $query = "SELECT usuarios.idusuario idamigo, usuarios.nombre, usuarios.usuario, usuarios.apellido, usuarios.email, usuarios.img, fecha_amigos_desde
        FROM (
        SELECT a.idusuario idamigo, a.fecha_alta fecha_amigos_desde FROM amigos a WHERE a.idamigo = ? AND a.estado = 1 
        UNION All 
      SELECT a.idamigo idamigo, a.fecha_alta fecha_amigos_desde FROM amigos a WHERE a.idusuario = ? AND a.estado = 1) t1
      INNER JOIN usuarios
      ON  usuarios.idusuario = idamigo";
    $stmt = $db->prepare($query);
    $success = $stmt->execute([$idusuario, $idusuario]);
    $friends = [];
    while ($row = $stmt->fetch()) {
      $friend = new Friends;
      $friend->loadDataArray($row);
      $friends[] = $friend;
    }
    if (!$success) {
      throw new Exception("Se produjo un error al obtener todos los amigos del usuario $idusuario");
    } 
    return $friends;
  }

  /**
   * Permite eliminar un amigo de la lista de amigos de un usuario por el id del mismo
   * @throws Exception si no se pudo realizar la query
   * @param number $idusuario
   * @param number $idamigo
   */
  public function delete($idusuario, $idamigo) 
  {
    $db = DBConnection::getConnection();
    $query = "DELETE FROM amigos WHERE (idusuario = :idusuario AND idamigo = :idamigo) OR (idusuario = :idamigo AND idamigo = :idusuario)";
    $stmt = $db->prepare($query);
    $success = $stmt->execute(['idusuario' => $idusuario, 'idamigo' => $idamigo]); 
    if (!$success) {
      throw new Exception('No se pudo agregar el usuario en la base de datos');
    }
  }

  /**
   * Permite realizar una consulta a la base de datos para obtener todas las solicitudes de amistad que posee
   * un usuario por el id del mismo, obtiene todas aquellas cuyo estado es 0...
   * @throws Exception si no se pudo realizar la query
   * @param number $idusuario
   * @return Friends[]
   */
  public function allRequest($idusuario) 
  {
    $db = DBConnection::getConnection();
    $query = "SELECT u.nombre, u.usuario, u.apellido, u.idusuario idamigo, u.email, u.img FROM amigos a 
            INNER JOIN usuarios u ON u.idusuario = a.idamigo
            WHERE a.idusuario = ? AND a.estado = 0
            ";
    $stmt = $db->prepare($query);
    $success = $stmt->execute([$idusuario]);
    $friends = [];
    while ($row = $stmt->fetch()) {
      $friend = new Friends;
      $friend->loadDataArray($row);
      $friends[] = $friend;
    }
    if (!$success) {
      throw new Exception("Se produjo un error al obtener las solicitudes de amistad del usuario $idusuario");
    } 
    return $friends;
  }

   /**
   * Permite agregar un amigo de manera inactiva, es decir se realiza un insert en la tabla, pero el estado es inactivo
   * hasta que la otra persona acepte la solicitud, o la elimine...
   * @throws Exception si no se pudo realizar la query
   * @param number $idusuario
   * @param Array request
   * @return void 
   */
  public function save($idusuario, $idamigo) 
  {
    $db = DBConnection::getConnection();
    $query = "INSERT INTO amigos (idusuario, idamigo, fecha_alta, estado) VALUES (:idusuario, :idamigo, :fecha_alta, :estado)";
    $stmt = $db->prepare($query);
    $success = $stmt->execute(['idusuario' => $idusuario, 'idamigo' => $idamigo, 'fecha_alta' => date("Y-m-d H:i:s"), 'estado' => 0]); 
    if (!$success) {
      throw new Exception('No se pudo agregar el usuario en la base de datos');
    }
  }

  /**
   * Permite realizar un update en la tabla de amigos para cambiar el estado de la invitación a aceptada, osea 
   * son amigos..., estado = '1'
   * @throws Exception si no se pudo realizar la query
   * @param number $idusuario
   * @param number $idamigo
   */
  public function updateStatus($idusuario, $idamigo) 
  {
    $db = DBConnection::getConnection();
    $query = "UPDATE amigos 
                  SET 
                    estado = 1
                  WHERE  idusuario = :idusuario
                  AND idamigo = :idamigo";
    $stmt = $db->prepare($query);
    $success = $stmt->execute(['idusuario' => $idusuario, 'idamigo' => $idamigo]);
    if (!$success) {
      throw new Exception('No se pudo editar el usuario en la base de datos');
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