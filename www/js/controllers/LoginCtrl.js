angular.module("lostThings.controllers").controller("LoginCtrl", [
  "$scope",
  "$state",
  "Authentication",
  "Utils",
  function($scope, $state, Authentication, Utils) {
    //Request Login
    $scope.user = { email: "", password: "" };

    /**
     * Permite autenticar al usuario
     * Valida los datos recibidos, si sale todo OK si sale bien , redirige...
     * @param formLogin
     * @param user
     * @returns void
     */
    $scope.login = function(formLogin, user) {
      $scope.errors = validateFields(formLogin);
      if ($scope.errors.email === null && $scope.errors.password === null) {
        Authentication.login(user)
          .then(res => {
            Utils.showPopup(
              "Autenticación",
              "Se ha autenticado correctamente!"
            ).then(() => $state.go("dashboard.home"));
          })
          .catch(_error =>
            Utils.showPopup(
              "Autenticación",
              "¡Ups se produjo un error al autenticarse"
            )
          );
      }
    };

    /**
     * Permite validar los datos ingresados por el usuario
     * @param {Object} formLogin
     * @return errors
     */
    function validateFields(formLogin) {
      let errors = { email: null, password: null };
      if (formLogin.email.$invalid) {
        if (formLogin.email.$error.required) {
          errors.email = "El campo email no puede ser vacío";
        }
        if (formLogin.email.$error.email) {
          errors.email = "No es un email válido";
        }
      }
      if (formLogin.password.$invalid) {
        if (formLogin.password.$error.required) {
          errors.password = "El campo password no puede ser vacío";
        }
      }
      return errors;
    }
  }
]);
