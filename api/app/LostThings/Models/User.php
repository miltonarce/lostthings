<?php
namespace LostThings\Models;

use LostThings\DB\DBConnection;
use Exception;

class User
{
  public $id;
  public $nombre;
  public $apellido;
  public $fecha_alta;
  public $user;
  public $email;
  public $pass;

  /**
   * Permite buscar usuarios por los campos nombre, usuario, apellido realiza un like
   * para obtener mas resultados
   * @param string $value
   * @return Array $response
   */
  public function search($value) 
  {
    $db = DBConnection::getConnection();
		$query = "SELECT idusuario, usuario, nombre, email, img FROM usuarios WHERE nombre LIKE :input OR apellido LIKE :input OR usuario LIKE :input ORDER BY nombre ASC";
		$stmt = $db->prepare($query);
		$stmt->execute(['input' => "%$value%"]);
    $users = [];
    while($row = $stmt->fetch()){
      $users[] = [
        'idusuario' => $row['idusuario'],
        'usuario' => $row['usuario'],
        'nombre' => $row['nombre'],
        'email' => $row['email'],
        'img' => $row['img']
      ];
    }
    return $users;
  }

  /**
   * Permite crear un perfil de un usuario y guardarlo en la tabla usuarios
   * @throws Exception si no se pudo realizar la query
   * @param Array $row
   */
  public function save($row)
  {
    $db = DBConnection::getConnection();
    $query = "INSERT INTO usuarios (usuario, nombre, apellido, fecha_alta, password, email)
    VALUES (:usuario, :nombre, :apellido, :fecha_alta, :password, :email)";
    $stmt = $db->prepare($query);
    $success = $stmt->execute([
        'usuario' => $row['usuario'],
        'nombre' => $row['nombre'],
        'apellido' => $row['apellido'],
        'fecha_alta' => date("Y-m-d H:i:s"),
        'password' => $row['password'],
        'email' => $row['email']
    ]); 
    if (!$success) {
      throw new Exception('No se pudo agregar el usuario en la base de datos');
    }
  }

  /**
   * Permite actualizar los datos del usuario, todos menos el password...
   * @throws Exception si no se pudo realizar la query
   * @param number $idUser
   * @param string $nombre
   * @param string $apellido
   * @return void
   */
  public function update($idUser, $nombre, $apellido)
  {
    $db = DBConnection::getConnection();
    $query = "UPDATE usuarios 
                  SET 
                    nombre = :nombre,
                    apellido = :apellido
                  WHERE  idusuario = :idusuario";
    $stmt = $db->prepare($query);
    $success = $stmt->execute([
      'nombre' => $nombre,
      'apellido' => $apellido,
      'idusuario' => $idUser
    ]);
    if (!$success) {
      throw new Exception('No se pudo editar el usuario en la base de datos');
    }
  }

  /**
   * Permite actualizar la contraseña que posee el usuario
   * @throws Exception si no se pudo realizar la query
   * @param number $idUser
   * @param string $password
   * @param string $newPassword
   * @return void
   * 
   */
  public function updatePassword($idUser, $password, $newPassword)
  {
    $db = DBConnection::getConnection();
    $query = "UPDATE usuarios  SET  password = :newpassword WHERE idusuario = :idusuario AND password = :password";
    $stmt = $db->prepare($query);
    $success = $stmt->execute(['idusuario' => $idUser, 'password' => $password, 'newpassword' => $newPassword]);
    if (!$success) {
      throw new Exception('No se pudo editar el usuario en la base de datos');
    } else {
      if ($stmt->rowCount() !== 0) {
        throw new Exception('No existe ningun usuario con el id');
      }
    }
  }

  /**
   * Permite obtener un usuario por el email del mismo
   * @param string $email
   * @return bool
   */
  public function getByEmail($email)
  {
    $db = DBConnection::getConnection();
    $query = "SELECT idusuario, nombre, apellido, fecha_alta, usuario, password, email FROM usuarios
    WHERE email = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$email]);
    if ($row = $stmt->fetch()) {
      $this->loadDataArray($row);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Permite verificar si existe un usuario por el id del mismo, si existe devuelve la info en el mismo object
   * @param number $userID
   * @return bool
   */
  public function getById($userID)
	{
		$db = DBConnection::getConnection();
		$query = "SELECT idusuario, nombre, apellido, fecha_alta, usuario, password, email FROM usuarios
				WHERE idusuario = ?";
		$stmt = $db->prepare($query);
		$stmt->execute([$userID]);
		if ($row = $stmt->fetch()) {
			$this->loadDataArray($row);
			return true;
		} else {
			return false;
		}
  }

  /**
   * Permite verificar si existen 2 usuarios por el id..
   * @param number $id1
   * @param number $id2
   * @return boolean
   */
  public function verifyUsers($id1, $id2) 
  {
    $db = DBConnection::getConnection();
		$query = "SELECT * FROM usuarios WHERE idusuario IN (?, ?)";
		$stmt = $db->prepare($query);
		$stmt->execute([$id1, $id2]);
		if ($row = $stmt->fetch()) {
      return $stmt->rowCount() === 2;
		} else {
			return false;
    }
  }

 /**
   * Permite setear todas las properties del object...
   * @return void
   */
  public function loadDataArray($row)
  {
    $this->id = $row['idusuario'];
    $this->nombre = $row['nombre'];
    $this->apellido = $row['apellido'];
    $this->fecha_alta = $row['fecha_alta'];
    $this->user = $row['usuario'];
    $this->email = $row['email'];
    $this->pass = $row['password'];
  }
  
}