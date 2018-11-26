/**
 * Módulos que utiliza la App
 * lostThings.controllers : Este módulo se encarga de manejar todos los controllers
 * lostThings.services: Este módulo se encarga de manejar todos los services
 * naif.base64: Este módulo es un módulo externo, que da una directiva para poder obtener
 * de forma rápida el base64 de un archivo de imagen, más info en el git del user
 * Instalación npm install angular-base64-upload --save
 * https://github.com/adonespitogo/angular-base64-upload
 */

angular
  .module("lostThings", [
    "ionic",
    "lostThings.controllers",
    "lostThings.services",
    "naif.base64"
  ])
  .run(function($ionicPlatform, $rootScope, $state, Utils, Authentication) {
    $ionicPlatform.ready(function() {
      if (window.cordova && window.Keyboard) {
        window.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });

    //Permite validar cuando cambia el state si tiene permisos el usuario para acceder a una view especifica
    $rootScope.$on("$stateChangeStart", function(event, toState) {
      if (toState.data != undefined && toState.data.requiresAuth) {
        if (!Authentication.isLogged()) {
          event.preventDefault();
          Utils.showPopup(
            "Usuario no autorizado",
            "No se puede acceder a esta sección sin estar autenticado."
          ).then(() => $state.go("login"));
        }
      }
    });
  })
  .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    /*
    Rutas de la aplicacion, hay 2 views las cuales no
    dependen de tab, ya que se necesita que no dependendan del tab
    estas son Login y Register, una vez que ingresan a la aplicacion
    el dashboard es el main view (tabs)
  */
    $stateProvider

      //View abstract que sirve de base para los tabs del dashboard
      .state("dashboard", {
        url: "/dashboard",
        abstract: true,
        templateUrl: "templates/dashboard.html"
      })
      //Tabs
      .state("dashboard.home", {
        url: "/home",
        views: {
          "tab-home": {
            templateUrl: "templates/dashboard-home.html",
            controller: "HomeCtrl"
          }
        }
      })
      .state("dashboard.publish", {
        url: "/publish",
        views: {
          "tab-publish": {
            templateUrl: "templates/dashboard-publish.html",
            controller: "PublishCtrl"
          }
        },
        data: {
          requiresAuth: true
        }
      })
      .state("detail", {
        url: "/detail/:id",
        templateUrl: "templates/detail.html",
        controller: "DetailCtrl",
        data: {
          requiresAuth: true
        }
      })
      //Estas views no dependen del dashboard, ya que no se quiere mostrar los tabs...
      .state("login", {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: "LoginCtrl"
      })
      .state("register", {
        url: "/register",
        templateUrl: "templates/register.html",
        controller: "RegisterCtrl"
      })
      .state("logout", {
        url: "/logout",
        controller: "LogoutCtrl"
      });

    //Por default se muestra la view de login...
    $urlRouterProvider.otherwise("/login");

    //Se configura el texto del button back a mostrar...
    $ionicConfigProvider.backButton.text("Atrás");
  })
  .constant("API_SERVER", "http://localhost/lostthings/api");

//Módulo para los services
angular.module("lostThings.services", []);
//Módulo para los controllers
angular.module("lostThings.controllers", []);
