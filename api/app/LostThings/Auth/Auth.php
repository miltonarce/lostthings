<?php

namespace LostThings\Auth;

use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\ValidationData;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use LostThings\Models\User;

/**
  * Autenticación del usuario con tokens.
 */
class Auth
{
  const TOKEN_ISSUER = 'http://lostthings.com';
  const SIGNER_KEY = 'FFdasdsazxczgzqswhjdjhsASDdwqt';
  
  /**
   * Permite autenticar al usuario verifica los datos, si es valido
   * carga los datos en el token
   * @return boolean
   */
  public function login($email, $pass)
  {
    $userLogged = new User;
    if ($userLogged->getByEmail($email)) {
      if (password_verify($pass, $userLogged->pass)) {
        $token = $this->genToken($userLogged);
        return [
          'token' => (string) $token,
          'user' => [
            'idusuario' => $userLogged->id,
            'usuario' => $userLogged->user,
            'email' => $userLogged->email
          ]
        ];
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Permite generar el token
   * @param User $userClass - Class Usuario
   * @return \Lcobucci\JWT\Token
   */
  public function genToken($userClass)
  {
    $builder = new Builder();
    $builder->setIssuer(self::TOKEN_ISSUER);
    $builder->set('idusuario', $userClass->id);
    $signer = new Sha256();
    $builder->sign($signer, self::SIGNER_KEY);
    $token = $builder->getToken();
    return $token;
  }

  /**
	 * Permite obtener los datos del token si es valido, sino devuelve false
	 * @param string $token
	 * @return array|boolean
	 */
  public static function isTokenValid($token)
  {
    if ($token == "null" || empty($token)) {
      return false;
    }
    $parser = new Parser;
    $token = $parser->parse((string) $token);
    $validationData = new ValidationData;
    $validationData-> setIssuer(self::TOKEN_ISSUER);
    if (!$token->validate($validationData)) {
      return false;
    }
    $signer = new Sha256;
    if (!$token->verify($signer, self::SIGNER_KEY)) {
      return false;
    }
    return ['idusuario' => $token->getClaim('idusuario')];
  }

}