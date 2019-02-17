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
  //Constantes
  const TOKEN_ISSUER = 'http://lostthings.com';
  const SIGNER_KEY = 'FFdasdsazxczgzqswhjdjhsASDdwqt';
  
  /**
   * Permite autenticar al usuario verifica los datos, si es válido
   * carga los datos en el token
   * @param string $email
   * @param string $pass
   * @return boolean
   */
  public function login($email, $pass)
  {
    $user = new User;
    if ($user->getByEmail($email)) {
      if (password_verify($pass, $user->getPassword())) {
        $token = $this->genToken($user);
        return [
          'token' => (string) $token,
          'user' => [
            'idusuario' => $user->getIdUsuario(),
            'usuario' => $user->getUsuario(),
            'email' => $user->getEmail()
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
  
  /**
   * Permite generar el token
   * @param User $user
   * @return Token
   */
  private function genToken(User $user)
  {
    $builder = new Builder();
    $builder->setIssuer(self::TOKEN_ISSUER);
    $builder->set('idusuario', $user->getIdUsuario());
    $signer = new Sha256();
    $builder->sign($signer, self::SIGNER_KEY);
    $token = $builder->getToken();
    return $token;
  }

}