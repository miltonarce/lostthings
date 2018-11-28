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
  .constant("API_SERVER", "http://localhost/lostthings/api/public");

//Módulo para los services
angular.module("lostThings.services", []);
//Módulo para los controllers
angular.module("lostThings.controllers", []);

angular
.module('lostThings.controllers')
.controller('DetailCtrl', [
	'$scope',
	'$stateParams',
	'Utils',
	'Items',
	'Authentication',
	function($scope, $stateParams, Utils, Items, Authentication) {
		
		//Request item
		$scope.item = null;

		//Información del usuario logueado
		const idUser = Authentication.getUserData().id;

		//Request comentario
		$scope.comment = { description: '', idUser: idUser };

		//Obtengo el detalle de la publicación
		Items.getDetail($stateParams.id).then(function(res) {
			$scope.item = res;
		}).catch(_err => Utils.showPopup('Detalle', 'Se produjo un error al obtener la información adicional'));

		/**
		 * Permite comentar una publicacion, realiza las validaciones y 
		 * genera el alta del comentario en la publicacion
		 * @param {Object} formComments
		 * @param {Object} comment
		 * @returns void
		 */
		$scope.addComment = function(formComments, comment) {
			$scope.errors = { description: null };
			if (formComments.description.$invalid) {
				if (formComments.description.$error.required) {
					$scope.errors.description = 'El campo no puede ser vacío';
				}
			} else {
				Items.commentPublication(comment, idUser).then(res => {
					$scope.item.comentarios = $scope.item.comentarios.concat(res);
					$scope.comment = '';
					$scope.$apply();
				}).catch(_err => Utils.showPopup('Comentar', 'Se produjo un error al comentar'));
			}
		}

	}
]);
angular.module('lostThings.controllers')
.controller('HomeCtrl', [
	'$scope',
	'$state',
	'Items',
	'Utils',
	function($scope, $state, Items, Utils) {
		
		//Flag para mostrar el campo de búsqueda
		$scope.showSearch = false;

		//Al ingresar a la view, actualiza la lista de items
		$scope.$on('$ionicView.beforeEnter', function() {
			$scope.getAllItems();
	    });	

		/**
		 * Permite mostrar y esconder el formulario
		 * de busqueda para realizar una busqueda de items
		 * @returns void
		 */
		$scope.toggleSearch = function() {
			$scope.showSearch = !$scope.showSearch;
		}

		/**
		 * Permite buscar los items, por default se busca '', osea trae todo
		 * @param {string} search
		 * @returns void
		 */
		$scope.searchItems = function(search = '') {
			Items.searchItems(search).then(res => {
				$scope.items = res.data;
				$scope.$apply();
			}).catch(_err => {
				Utils.showPopup('Home', `Se produjo un error al buscar ${search} en los resultados`);
			});
		}

		/**
		 * Permite actualizar la lista de resultados...
		 * Emite un evento para decirle que termino y que corte el refresh...
		 * @returns void
		 */
		$scope.doRefresh = function() {
			Items.getAllItems().then(res => {
				$scope.items = res.data;
				$scope.$broadcast('scroll.refreshComplete');
			}).catch(_err => { 
				$scope.$broadcast('scroll.refreshComplete');
				Utils.showPopup('Home', 'Se produjo un error al actualizar los resultados');
			});
		}

		/**
		 * Permite obtener todos los items publicados hasta la fecha,
		 * muestra mensaje de error si ocurre un error...
		 * @returns void
		 */
		$scope.getAllItems = function() {
			Items.getAllItems().then(res => {
				$scope.items = res.data;
			}).catch(_err => Utils.showPopup('Home', 'Se produjo un error al obtener los resultados'));
		}

		/**
		 * Permite ir al detalle de una publicación
		 * @param {number} id
		 * @returns void
		 */
		$scope.goDetail = function(id) {
			$state.go('detail', { 'id': id });
		}

	}
]);
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
        Authentication.login(user).then(success => {
          if (success) {
            Utils.showPopup("Autenticación", "Se ha autenticado correctamente!").then(() => $state.go("dashboard.home"));
          } else {
            Utils.showPopup("Autenticación", "Los datos ingresados no son correctos");
          }
        }).catch(_error => Utils.showPopup("Autenticación", "¡Ups se produjo un error al autenticarse"));
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

angular
.module('lostThings.controllers')
.controller('LogoutCtrl', [
	'$state',
	'Authentication',
	function($state, Authentication) {
		Authentication.logout();
		$state.go('login');
	}
]);
angular
.module('lostThings.controllers')
.controller('PublishCtrl', [
	'$scope',
	'$state',
	'Utils',
	'Items',
	function($scope, $state, Utils, Items) {
			
		//Request Publish
		$scope.item = { name: '', description: '', pic: null };
		
		/**
		 * Permite publicar un articulo para que se pueda encontrar
		 * Si sale todo ok, redirige al home...
		 * @param {Object} formPublish
		 * @param {Object} item
		 * @returns void
		 */
		$scope.publish = function(formPublish, item) {
			$scope.errors = validateFields(formPublish);
			if ($scope.errors.name === null && $scope.errors.description === null && $scope.errors.pic === null) {
				Items.publishItem(item).then(() =>  {
					Utils.showPopup('Publicar', '<p>Se ha subido su publicación <br /> ¡Buena suerte!</p>')
						 .then(() => $state.go('dashboard.home'));
				}).catch(_error => Utils.showPopup('Publicar', '¡Ups se produjo un error al querer publicar su artículo'));
			}
		}

		/**
		 * Permite validar los datos ingresados por el usuario al crear un item para publicar
		 * @param {Object} formPublish 
		 * @return errors
		 */
		function validateFields(formPublish) {
			let errors = { name: null, description: null, pic: null };
			if (formPublish.name.$invalid) {
				if (formPublish.name.$error.required) {
					errors.name = 'El campo nombre no puede ser vacío';
				}
			}
			if (formPublish.description.$invalid) {
				if (formPublish.description.$error.required) {
					errors.description = 'El campo descripción no puede ser vacío';
				}
			}
			if (formPublish.file.$error.maxsize) {
				errors.pic = 'La imagen no puede exceder 1MB';
			}
			return errors;
		}

	}
]);
angular.module("lostThings.controllers").controller("RegisterCtrl", [
  "$scope",
  "$state",
  "Authentication",
  "Utils",
  function($scope, $state, Authentication, Utils) {

    //Request Registro
    $scope.user = {
      email: "",
      password: "",
      usuario: "",
      nombre: "",
      apellido: "",
      fecha_alta: getDate()
    };

    /**
     * Permite registrar al usuario valida los datos recibidos, si sale todo OK
     * realiza un redirect al login
     * @param formRegister
     * @param user
     * @returns void
     */
    $scope.register = function(formRegister, user) {
      $scope.errors = validateFields(formRegister);
      if (isValidForm($scope.errors)) {
        Authentication.register(user)
          .then(success => {
            if (success) {
              Utils.showPopup("Registrarse", "Se ha creado su cuenta!").then(() => $state.go("login"));
            } else {
              Utils.showPopup("Registrarse", "Se produjo un error al registrar al usuario");
            }
          })
          .catch(_error => Utils.showPopup("Registrarse", "¡Ups se produjo un error al registrar al usuario"));
      }
      return false;
    };

    /**
     * Permite validar los datos ingresados por el usuario
     * @param {Object} formRegister
     * @return errors
     */
    function validateFields(formRegister) {
      let errors = {
        email: null,
        password: null,
        nombre: null,
        apellido: null,
        usuario: null,
        pic: ""
      };
      if (formRegister.email.$invalid) {
        if (formRegister.email.$error.required) {
          errors.email = "El campo email no puede ser vacío";
        }
        if (formRegister.email.$error.email) {
          errors.email = "No es un email válido";
        }
      }
      if (formRegister.password.$invalid) {
        if (formRegister.password.$error.required) {
          errors.password = "El campo password no puede ser vacío";
        }
      }
      if (formRegister.usuario.$invalid) {
        if (formRegister.usuario.$error.required) {
          errors.usuario = "El campo usuario no puede ser vacío";
        }
      }
      if (formRegister.nombre.$invalid) {
        if (formRegister.nombre.$error.required) {
          errors.nombre = "El campo nombre no puede ser vacío";
        }
      }
      if (formRegister.apellido.$invalid) {
        if (formRegister.apellido.$error.required) {
          errors.apellido = "El campo apellido no puede ser vacío";
        }
      }
      return errors;
    }

    /**
     * Permite saber si el formulario es valido
     *	@returns boolean
     */
    function isValidForm(errors) {
      return (
        errors.email === null &&
        errors.password === null &&
        errors.nombre === null &&
        errors.apellido === null &&
        errors.usuario === null
      );
    }

    /**
     * Permite crear la fecha del alta del usuario para enviar al backend de php
     * en el formato que entiende mySQL
     * @return string
     */
    function getDate() {
      let date = new Date();
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }

  }
]);

angular.module("lostThings.services").factory("Authentication", [
  "$http",
  "API_SERVER",
  function($http, API_SERVER) {
    //Token JWT
    let token = null;

    //Información del usuario logueado
    let userData = null;

    /**
     * Permite autenticar al usuario contra la API de PHP
     * @param {Object} user
     * @return boolean
     */
    function login(user) {
      return $http.post(`${API_SERVER}/login`, user).then(function(response) {
        if (response.data.status === 1) {
          userData = response.data.data;
          token = response.data.token;
          return true;
        }
        return false;
      });
    }

    /**
     * Permite eliminar el token del usuario y la data del mismo
     * @returns void
     */
    function logout() {
      token = null;
      userData = null;
    }

    /**
     * Permite registrar al usuario utilizando la API de PHP
     * @param {Object} user
     * @returns Object
     */
    function register(user) {
      return $http.post(`${API_SERVER}/register`, user).then(function(res) {
        let response = res.data;
        if (response.status === 1) {
          return true;
        }
        return false;
      });
    }

    /**
     * Permite saber si el usuario esta logueado, valida si existe el token
     * @return boolean
     */
    function isLogged() {
      return token !== null;
    }

    /**
     * Permite obtener el token JWT
     * @return token
     */
    function getToken() {
      return token;
    }

    /**
     * Permite obtener la información del usuario logueado
     * @returns {Object} userData
     */
    function getUserData() {
      return userData;
    }

    return {
      login: login,
      register: register,
      isLogged: isLogged,
      getUserData: getUserData,
      getToken: getToken,
      logout: logout
    };
  }
]);

angular.module("lostThings.services").factory("Items", [
  "$http",
  "API_SERVER",
  function($http, API_SERVER) {

    /**
     * Permite obtener todos los items perdidos
     * @returns Promise
     */
    function getAllItems() {
      return $http.get(`${API_SERVER}/items`);
    }

    /**
     * Permite buscar los items por el valor ingresado como parametro
     * @param {string} search
     * returns Promise
     */
    function searchItems(search) {
      // return $http.get(`${API_SERVER}/items?search=${search}`).then(function(res) {

      // });
      //Mock
      return new Promise((resolve, reject) => resolve(searchItemsMock));
    }

    /**
     * Permite publicar un item para mostrarse en el listado
     * @param {Object} item
     */
    function publishItem(item) {
      /*return $http.post(`${API_SERVER}/items`).then(function(res) {
                
            });*/
      //Mock
      return new Promise((resolve, reject) => resolve(publishItemMock));
    }

    /**
     * Permite obtener el detalle de una publicacion
     * @param {number} id
     * @returns Promise
     */
    function getDetail(id) {
      //return $http.get(`${API_SERVER}/items/id=${id}`);
      return new Promise((resolve, reject) => resolve(mockgetDetail));
    }

    /**
     * Permite comentar una publicación
     * @param {Object} item
     */
    function commentPublication(item, idUser) {
      //return $http.get(`${API_SERVER}/items/id=${id}`);
      commentPublicationMock.descripcion = item.description;
      return new Promise((resolve, reject) => resolve(commentPublicationMock));
    }

    return {
      getAllItems: getAllItems,
      searchItems: searchItems,
      publishItem: publishItem,
      getDetail: getDetail,
      commentPublication: commentPublication
    };
  }
]);

angular
.module('lostThings.services')
.factory('Utils', 
    ['$ionicPopup', 
    function($ionicPopup){
        
        /**
		 * Permite crear una instancia del popup de ionic
		 * @param {string} title titulo del popup
		 * @param {string} text texto del popup, puede ser HTML
		 * @returns Promise
		 */
		function showPopup(title, text) {
			return $ionicPopup.alert({ title: title, template: text, cssClass:'lost-things-popup', okText: 'Aceptar' });
		}

        return {
            showPopup: showPopup
        }

    }
]);
/*! angular-base64-upload - v0.1.23
* https://github.com/adonespitogo/angular-base64-upload
* Copyright (c) Adones Pitogo <pitogo.adones@gmail.com> [Sat Aug 05 2017]
* Licensed MIT */
(function(window, undefined) {

  'use strict';

  /* istanbul ignore next */
  //http://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
  window._arrayBufferToBase64 = function(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;

    for (var i = 0; i < len; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };


  var mod = window.angular.module('naif.base64', []);

  mod.directive('baseSixtyFourInput', [
    '$window',
    '$q',
    function($window, $q) {

      var isolateScope = {
        onChange: '&',
        onAfterValidate: '&',
        parser: '&'
      };

      var FILE_READER_EVENTS = ['onabort', 'onerror', 'onloadstart', 'onloadend', 'onprogress', 'onload'];

      FILE_READER_EVENTS.forEach(function(e) {
        isolateScope[e] = '&';
      });

      return {
        restrict: 'A',
        require: 'ngModel',
        scope: isolateScope,
        link: function(scope, elem, attrs, ngModel) {

          var rawFiles = [];
          var fileObjects = [];

          /* istanbul ignore if */
          if (!ngModel) {
            return;
          }

          // VALIDATIONS =========================================================

          function _maxnum(val) {
            if (attrs.maxnum && attrs.multiple && val) {
              var valid = val.length <= parseInt(attrs.maxnum);
              ngModel.$setValidity('maxnum', valid);
            }
            return val;
          }

          function _minnum(val) {
            if (attrs.minnum && attrs.multiple && val) {
              var valid = val.length >= parseInt(attrs.minnum);
              ngModel.$setValidity('minnum', valid);
            }
            return val;
          }

          function _maxsize(val) {
            var valid = true;

            if (attrs.maxsize && val) {
              var max = parseFloat(attrs.maxsize) * 1000;

              if (attrs.multiple) {
                for (var i = 0; i < val.length; i++) {
                  var file = val[i];
                  if (file.filesize > max) {
                    valid = false;
                    break;
                  }
                }
              } else {
                valid = val.filesize <= max;
              }
              ngModel.$setValidity('maxsize', valid);
            }

            return val;
          }

          function _minsize(val) {
            var valid = true;
            var min = parseFloat(attrs.minsize) * 1000;

            if (attrs.minsize && val) {
              if (attrs.multiple) {
                for (var i = 0; i < val.length; i++) {
                  var file = val[i];
                  if (file.filesize < min) {
                    valid = false;
                    break;
                  }
                }
              } else {
                valid = val.filesize >= min;
              }
              ngModel.$setValidity('minsize', valid);
            }

            return val;
          }

          function _accept(val) {
            var valid = true;
            var regExp, exp, fileExt;
            if (attrs.accept) {
              exp = attrs.accept.trim().replace(/[,\s]+/gi, "|").replace(/\./g, "\\.").replace(/\/\*/g, "/.*");
              regExp = new RegExp(exp);
            }

            if (attrs.accept && val) {
              if (attrs.multiple) {
                for (var i = 0; i < val.length; i++) {
                  var file = val[i];
                  fileExt = "." + file.filename.split('.').pop();
                  valid = regExp.test(file.filetype) || regExp.test(fileExt);

                  if (!valid) {
                    break;
                  }
                }
              } else {
                fileExt = "." + val.filename.split('.').pop();
                valid = regExp.test(val.filetype) || regExp.test(fileExt);
              }
              ngModel.$setValidity('accept', valid);
            }

            return val;
          }

          //end validations ===============

          function _setViewValue() {
            var newVal = attrs.multiple ? fileObjects : fileObjects[0];
            ngModel.$setViewValue(newVal);
            _maxsize(newVal);
            _minsize(newVal);
            _maxnum(newVal);
            _minnum(newVal);
            _accept(newVal);
          }

          function _attachHandlerForEvent(eventName, handler, fReader, file, fileObject) {
            fReader[eventName] = function(e) {
              handler()(e, fReader, file, rawFiles, fileObjects, fileObject);
            };
          }

          function _readerOnLoad(fReader, file, fileObject) {

            return function(e) {

              var buffer = e.target.result;
              var promise;

              // do not convert the image to base64 if it exceeds the maximum
              // size to prevent the browser from freezing
              var exceedsMaxSize = attrs.maxsize && file.size > attrs.maxsize * 1024;
              if (attrs.doNotParseIfOversize !== undefined && exceedsMaxSize) {
                fileObject.base64 = null;
              } else {
                fileObject.base64 = $window._arrayBufferToBase64(buffer);
              }

              if (attrs.parser) {
                promise = $q.when(scope.parser()(file, fileObject));
              } else {
                promise = $q.when(fileObject);
              }

              promise.then(function(fileObj) {
                fileObjects.push(fileObj);
                // fulfill the promise here.
                file.deferredObj.resolve();
              });

              if (attrs.onload) {
                if (scope.onload && typeof scope.onload() === "function") {
                  scope.onload()(e, fReader, file, rawFiles, fileObjects, fileObject);
                } else {
                  scope.onload(e, rawFiles);
                }
              }

            };

          }

          function _attachEventHandlers(fReader, file, fileObject) {

            for (var i = FILE_READER_EVENTS.length - 1; i >= 0; i--) {
              var e = FILE_READER_EVENTS[i];
              if (attrs[e] && e !== 'onload') { // don't attach handler to onload yet
                _attachHandlerForEvent(e, scope[e], fReader, file, fileObject);
              }
            }

            fReader.onload = _readerOnLoad(fReader, file, fileObject);
          }

          function _readFiles() {
            var promises = [];
            var i;
            for (i = rawFiles.length - 1; i >= 0; i--) {
              // append file a new promise, that waits until resolved
              rawFiles[i].deferredObj = $q.defer();
              promises.push(rawFiles[i].deferredObj.promise);
              // TODO: Make sure all promises are resolved even during file reader error, otherwise view value wont be updated
            }

            // set view value once all files are read
            $q.all(promises).then(_setViewValue);

            for (i = rawFiles.length - 1; i >= 0; i--) {
              var reader = new $window.FileReader();
              var file = rawFiles[i];
              var fileObject = {};

              fileObject.filetype = file.type;
              fileObject.filename = file.name;
              fileObject.filesize = file.size;

              _attachEventHandlers(reader, file, fileObject);
              reader.readAsArrayBuffer(file);
            }
          }

          function _onChange(e) {
            if (attrs.onChange) {
              if (scope.onChange && typeof scope.onChange() === "function") {
                scope.onChange()(e, rawFiles);
              } else {
                scope.onChange(e, rawFiles);
              }
            }
          }

          function _onAfterValidate(e) {
            if (attrs.onAfterValidate) {
              // wait for all promises, in rawFiles,
              //   then call onAfterValidate
              var promises = [];
              for (var i = rawFiles.length - 1; i >= 0; i--) {
                promises.push(rawFiles[i].deferredObj.promise);
              }
              $q.all(promises).then(function() {
                if (scope.onAfterValidate && typeof scope.onAfterValidate() === "function") {
                  scope.onAfterValidate()(e, fileObjects, rawFiles);
                } else {
                  scope.onAfterValidate(e, fileObjects, rawFiles);
                }
              });
            }
          }

          ngModel.$isEmpty = function(val) {
            return !val || (angular.isArray(val) ? val.length === 0 : !val.base64);
          };

          // http://stackoverflow.com/questions/1703228/how-can-i-clear-an-html-file-input-with-javascript
          scope._clearInput = function() {
            elem[0].value = '';
          };

          scope.$watch(function() {
            return ngModel.$viewValue;
          }, function(val) {
            if (ngModel.$isEmpty(val) && ngModel.$dirty) {
              scope._clearInput();
              // Remove validation errors
              ngModel.$setValidity('maxnum', true);
              ngModel.$setValidity('minnum', true);
              ngModel.$setValidity('maxsize', true);
              ngModel.$setValidity('minsize', true);
              ngModel.$setValidity('accept', true);
            }
          });

          elem.on('change', function(e) {

            fileObjects = [];
            fileObjects = angular.copy(fileObjects);

            if (e.target.files.length === 0) {
              rawFiles = [];
              _setViewValue();
            } else {
              rawFiles = e.target.files; // use event target so we can mock the files from test
              _readFiles();
              _onChange(e);
              _onAfterValidate(e);
            }

            if (attrs.allowSameFile) {
              scope._clearInput();
            }

          });

        }
      };

    }
  ]);

})(window);
