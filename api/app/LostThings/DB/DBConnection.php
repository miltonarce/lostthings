<?php

namespace LostThings\DB;

use PDO;
use PDOStatement;

// Clase de conexión a la base en modo Singleton.
class DBConnection
{
	// Definimos una propiedad estática para almacenar la conexión.
	// Al ser estática, solo existe para la clase, y dura hasta el
	// final de la ejecución.
	// La hacemos privada para que nadie pueda tocar esa propiedad.
	private static $db = null;

	// Definimos al constructor como privado para evitar que cualquiera,
	// salvo esta misma clase, pueda crear una instancia.
	private function __construct() {}

	/**
	 * Abre la conexión a la base de datos con PDO.
	 */
	private static function openConnection()
	{
		// Definimos los valores de la conexión.
		// Estos normalmente salen de un archivo externo de config.
		$host = "localhost";
		$user = "root";
		$pass = "";
		$base = "app_clientes-mobile";
		// Seteamos el Driver Source Name.
		$dsn = "mysql:host=$host;dbname=$base;charset=utf8";
	
	self::$db = new PDO($dsn, $user, $pass);
	
	}

	/**
	 * Retorna una conexión a la base de datos en modo Singleton.
	 *
	 * @return PDO
	 */
	public static function getConnection()
	{
		// Si no tenemos conexión, la abrimos.
		if(is_null(self::$db)) {
			self::openConnection();
		}

		// Retornamos la conexión.
		return self::$db;
	}

	/**
	 * Retorna el PDOStatement para el $query proporcionado.
	 * 
	 * @param string $query
	 * @return PDOStatement
	 */
	public static function getStatement($query)
	{
		return self::getConnection()->prepare($query);
	}
}