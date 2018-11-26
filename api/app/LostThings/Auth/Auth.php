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
   * Loguea al usuario, retorna true si logea, 
   * en caso contrario retorna false.
   */
  public function login($email, $pass){
    $userClass = new User;
    if($userClass->getByEmail($email)){
      if(password_verify($pass, $userClass->pass)){
      $token = $this->genToken($userClass);
      return [
        'token' => (string) $token,
        'user' => [
          'idusuario' => $userClass->id,
          'usuario' => $userClass->user,
          'email' => $userClass->email
        ]
        ];
    }else{
      return false;
    }
    }else{
      return false;
    }
  }
/**
 * Generar token de autenticacion
 * @param User $userClass - Class Usuario
 * @return \Lcobucci\JWT\Token
 */
public function genToken($email){
  $builder = new Builder();
  $builder->setIssuer(self::TOKEN_ISSUER);
  $builder->set('idusuario', $userClass->id);
  $signer = new Sha256();
  $builder->sign($signer, self::SIGNER_KEY);
  $token = $builder->getToken();
  return $token;
}

/**
	 * Retorna un array con los datos del token si es válido.
	 * false de lo contrario.
	 *
	 * @param string $token
	 * @return array|boolean
	 */
public function isTokenValid($token){
  if($token == "null" || empty($token)){
    return false;
  }
  $parser = new Parser;
  $token = $parser->parse((string) $token);
  $validationData = new ValidationData;
  $validationData-> setIssuer(self::TOKEN_ISSUER);
  if(!$token->validate($validationData)){
    return false;
  }
  $signer = new Sha256;
  if(!$token->verify($signer, self::SIGNER_KEY)){
    return false;
  }
  return [
    'idusuario' => $token->getClaim('idusuario')
  ];
}
}