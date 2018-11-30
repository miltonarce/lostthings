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
 * @param $user - usuario ingresado por el input login
 * @return bool - retorna true en caso de que el usuario
 * exista, si no devolvera false
 */
  public function getByEmail($email){
    $db = DBConnection::getConnection();
    $query = "SELECT idusuario, nombre, apellido, fecha_alta, usuario, password, email FROM usuarios
    WHERE email = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$email]);
    if($row = $stmt->fetch()){
      $this->loadDataArray($row);
      return true;
    }else{
      return false;
    }
  }
  /**
   *  @param $id - id extraido de la funcion checkislogged
   * @return bool - retorna true en caso de que el usuario
   * exista, si no devolvera false
   */
  public function getById($userID)
	{
		$db = DBConnection::getConnection();
		$query = "SELECT idusuario, nombre, apellido, fecha_alta, usuario, password, email FROM usuarios
				WHERE idusuario = ?";
		$stmt = $db->prepare($query);
		$stmt->execute([$userID]);
		if($row = $stmt->fetch()) {
			$this->loadDataArray($row);
			return true;
		} else {
			return false;
		}
	}
/**
 * Esta clase crea un nuevo usuario y lo inserta en la DB
 * @param array $row - con los datos mandados en el form
 */
  public function createUser($row)
  {
    $db = DBConnection::getConnection();
    $query = "INSERT INTO usuarios (usuario, nombre, apellido, fecha_alta, password, email)
    VALUES (:usuario, :nombre, :apellido, :fecha_alta, :password, :email)";
    $stmt = $db->prepare($query);
    $success = $stmt->execute([
        'usuario' => $row['usuario'],
        'nombre' => $row['nombre'],
        'apellido' => $row['apellido'],
        'fecha_alta' => $row['fecha_alta'],
        'password' => $row['password'],
        'email' => $row['email']
    ]); 

    if(!$success){
      throw new Exception('No se pudo agregar el usuario en la base de datos');
    }
  }
  /**
   * edit de datos 
   */
  public function editdata($row){
    $db = DBConnection::getConnection();
    $query = "UPDATE usuarios 
                  SET 
                    nombre = ':nombre',
                    apellido = ':apellido'
                  WHERE  idusuario = ':idusuario'";
                  
    $stmt = $db->prepare($query);
    $success = $stmt->execute([
      'nombre' => $row['nombre'],
      'apellido' => $row['apellido'],
      'idusuario' => $row['idusuario']
    ]);
    
    if(!$success){
      throw new Exception('No se pudo editar el usuario en la base de datos');
    }
  }
  /**
   * edit de password
   */
  public function editpass($row){
    $db = DBConnection::getConnection();
    $query = "UPDATE usuarios 
                  SET 
                    password = ':newpassword'
                  WHERE  idusuario = ':idusuario' AND password = ':password'";
                  
    $stmt = $db->prepare($query);
    $success = $stmt->execute([
      'idusuario' => $row['idusuario'],
      'password' => $row['password'],
      'newpassword' => $row['newpassword']
    ]);
    
    if(!$success){
      throw new Exception('No se pudo editar el usuario en la base de datos');
    }
  }
  

  /**
   * Carga datps de la $row en el objeto
   * @param array $row
   */
  public function loadDataArray($row){
    $this->id = $row['idusuario'];
    $this->nombre = $row['nombre'];
    $this->apellido = $row['apellido'];
    $this->fecha_alta = $row['fecha_alta'];
    $this->user = $row['usuario'];
    $this->email = $row['email'];
    $this->pass = $row['password'];
  }
}