<?php
namespace LostThings\Models;

use LostThings\DB\DBConnection;

class User
{
  public $id;
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
    $query = "SELECT idusuario, usuario, password, email FROM usuarios
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
  }


  /**
   * Carga datps de la $row en el objeto
   * @param array $row
   */
  public function loadDataArray($row){
    $this->id = $row['idusuario'];
    $this->user = $row['usuario'];
    $this->email = $row['email'];
    $this->pass = $row['password'];
  }
}