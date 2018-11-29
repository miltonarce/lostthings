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
      .state("dashboard.profile", {
        url: "/profile",
        views: {
          "tab-profile" : {
            templateUrl: "templates/dashboard-profile.html",
            controller: "ProfileCtrl"
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
	'$state',
	'$stateParams',
	'Utils',
	'Items',
	'Authentication',
	function($scope, $state, $stateParams, Utils, Items, Authentication) {
		
		//Contenido de la publicacion
		$scope.item = null;

		//Flag modo edición
		$scope.showEditable = false;

		//Información del usuario logueado
		const idUser = Authentication.getUserData().idusuario;

		//Request para editar la publicación
		$scope.requestEdit = {};

		//Request comentario
		$scope.comment = { description: '', idUser: idUser };

		//Obtengo el detalle de la publicación
		Items.getDetail($stateParams.id).then(function(res) {
			let item = res.data.data;
			$scope.item = item;
			$scope.requestEdit = createDefaultRequest(item, idUser);
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

		/**
		 * Permite cambiar el estado del flag para visualizar el contenido
		 * de edicion / lectura
		 * @returns void
		 */
		$scope.toggleEdit = function() {
			$scope.showEditable = !$scope.showEditable;
		}

		/**
		 * Permite actualizar el item de la publicacion
		 * @param {Object} formEdit 
		 * @param {Object} requestEdit 
		 */
		$scope.edit = function(formEdit, requestEdit) {
			$scope.errors = validateFields(formEdit);
			if (isValidForm($scope.errors)) {
				Items.edit($scope.item.idpublicacion, $scope.requestEdit).then(response =>  {
					if (response.status === 1) {
						Utils.showPopup('Editar', response.data.message).then(() => $state.go('dashboard.home'));
					} else {
						Utils.showPopup('Editar', response.data.message);
					}
				}).catch(_error => Utils.showPopup('Editar', '¡Ups se produjo un error al actualizar su publicación'));
			} 
		}

		/**
		 * Permite eliminar una publicación por el id de la misma
		 * @param id
		 */
		$scope.removeItem = function() {
			Utils.showConfirm('Eliminar', '¿Estás seguro de eliminar?').then(accept => {
				if (accept) {
					Items.remove($scope.item.idpublicacion).then(res => {
						Utils.showPopup('Eliminar', res.data.message).then(() => $state.go('dashboard.home'));
					}).catch(_err => Utils.showPopup('Eliminar', 'Se produjo un error al eliminar su publicación'));
				}
			})
		}

		/**
		 * Permite validar los datos ingresados por el usuario al modificar un item
		 * @param {Object} formPublish 
		 * @return errors
		 */
		function validateFields(formEdit) {
			let errors = { titulo: null, descripcion: null, ubicacion: null, img: null };
			if (formEdit.titulo.$invalid) {
				if (formEdit.titulo.$error.required) {
					errors.titulo = 'El campo nombre no puede ser vacío';
				}
			}
			if (formEdit.descripcion.$invalid) {
				if (formEdit.descripcion.$error.required) {
					errors.descripcion = 'El campo descripción no puede ser vacío';
				}
			}
			if (formEdit.ubicacion.$invalid) {
				if (formEdit.ubicacion.$error.required) {
					errors.ubicacion = 'El campo ubicación no puede ser vacío, ya que sirve para reducir la búsqueda';
				}
			}
			if (formEdit.file.$error.maxsize) {
				errors.img = 'La imagen no puede exceder 1MB';
			}
			return errors;
		}

		/**
		 * Permite saber si el formulario es valido
		 *	@returns boolean
		*/
		function isValidForm(errors) {
			return (
				errors.titulo === null &&
				errors.descripcion === null &&
				errors.ubicacion === null &&
				errors.img === null
			);
		}

		/**
		 * Permite crear el objeto default del request, se filtran los datos
		 * que ya trae el backend, porque no se necesitan por ejemplo los comentarios
		 * @param {Object} item 
		 * @param {Object} idUser 
		 * @returns Object
		 */
		function createDefaultRequest(item, idUser) {
			let { titulo, descripcion, ubicacion, img, fkidusuario } = item;
			return {
				titulo,
				descripcion,
				ubicacion,
				img,
				fecha_publicacion: Utils.getDate(),
				fkidusuario: idUser
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
.controller('ProfileCtrl', [
	'$scope',
	'$state',
	'Authentication',
	'Profile',
	'Utils',
	function($scope, $state, Authentication, Profile, Utils) {

		//Obtengo la información del usuario
		$scope.userData = Authentication.getUserData();

		$scope.requestPassword = { idUser: $scope.userData.idusuario, oldPassword: '', newPassword: '' } ;

		//Flag para mostrar el formulario de edición
		$scope.enableEdit = false;

		/**
		 * Permite habilitar / deshabilitar el formulario de edición
		 * @returns void
		 */
		$scope.toggleEnableEdit = function() {
			$scope.enableEdit = !$scope.enableEdit;
		}

		/**
		 * Permite editar el perfil del usuario con los datos recibidos
		 * @param {Object} formEdit
		 * @param {Object} user
		 */
		$scope.editProfile = function(formEdit, user) {
			$scope.errors = validateFields(formEdit);
			if ($scope.errors.usuario === null && $scope.errors.email === null) {
			 Profile.edit($scope.userData).then(response => {
				if (response.status === 1) {
					Utils.showPopup("Perfil", "Se actualizó correctamente su perfil!");
				} else {
					Utils.showPopup("Perfil", "No se pudo actualizar su perfil, intente más tarde");
				}
			 }).catch(_err => Utils.showPopup("Perfil", "¡Ups se produjo un error al modificar los datos"));
			} 
		}

		/**
		 * Permite modificar el password del usuario, valida los datos
		 * y realiza la actualización llamando al service...
		 * @param {string} formChangePassword 
		 * @param {string} requestPassword 
		 * @returns void
		 */
		$scope.changePassword = function(formChangePassword, requestPassword) {
			$scope.errorsFormChangePassword = validateFieldsPassword(formChangePassword);
			if ($scope.errorsFormChangePassword.oldPassword === null && $scope.errorsFormChangePassword.newPassword === null) {
				Profile.changePassword($scope.requestPassword).then(response => {
					if (response.status === 1) {
						Utils.showPopup("Perfil", "Se actualizó correctamente su password!");
					} else {
						Utils.showPopup("Perfil", "No se pudo actualizar su password, intente más tarde");
					}
				}).catch(_err => Utils.showPopup("Perfil", "¡Ups se produjo un error al modificar su password"));
			}
		}

		/**
		 * Permite validar los datos ingresados por el usuario
		 * @param {Object} formEdit
		 * @return errors
		 */
		function validateFields(formEdit) {
			let errors = {
				email: null,
				usuario: null,
			};
			if (formEdit.email.$invalid) {
				if (formEdit.email.$error.required) {
					errors.email = "El campo email no puede ser vacío";
				}
				if (formEdit.email.$error.email) {
					errors.email = "No es un email válido";
				}
			}
			if (formEdit.usuario.$invalid) {
				if (formEdit.usuario.$error.required) {
					errors.usuario = "El campo usuario no puede ser vacío";
				}
			}
			return errors;
		}

		/**
		 * Permite validar los campos del formulario de password
		 * @param {Object} formChangePassword
		 * @returns errors
		 */
		function validateFieldsPassword(formChangePassword) {
			let errors = {
				oldPassword: null,
				newPassword: null
			};
			if (formChangePassword.oldPassword.$invalid) {
				if (formChangePassword.oldPassword.$error.required) {
					errors.oldPassword = "Su password actual no puede ser vacía";
				}
			}
			if (formChangePassword.newPassword.$invalid) {
				if (formChangePassword.newPassword.$error.required) {
					errors.newPassword = "Su nuevo password no puede ser vacío";
				}
			}
			return errors;
		}

	}
]);
angular
.module('lostThings.controllers')
.controller('PublishCtrl', [
	'$scope',
	'$state',
	'Utils',
	'Items',
	'Authentication',
	function($scope, $state, Utils, Items, Authentication) {

		//Información del usuario
		$scope.userData = Authentication.getUserData();
			
		//Request Publish
		$scope.item = { 
			titulo: '', 
			descripcion: '', 
			ubicacion: '', 
			img: null, 
			fecha_publicacion: Utils.getDate(),
			fkidusuario: $scope.userData.idusuario
		};
		
		/**
		 * Permite publicar un articulo para que se pueda encontrar
		 * Si sale todo ok, redirige al home...
		 * @param {Object} formPublish
		 * @param {Object} item
		 * @returns void
		 */
		$scope.publish = function(formPublish, item) {
			$scope.errors = validateFields(formPublish);
			if (isValidForm($scope.errors)) {
				Items.publishItem($scope.item).then(response =>  {
					Utils.showPopup('Publicar', '<p>Se ha subido su publicación <br /> ¡Buena suerte!</p>')
						 .then(() => {
							let idNewItem = response.data.data.id;
							$state.go('detail', { 'id': 1 });
						});
				}).catch(_error => Utils.showPopup('Publicar', '¡Ups se produjo un error al querer publicar su artículo'));
			}
		}

		/**
		 * Permite validar los datos ingresados por el usuario al crear un item para publicar
		 * @param {Object} formPublish 
		 * @return errors
		 */
		function validateFields(formPublish) {
			let errors = { titulo: null, descripcion: null, ubicacion: null, img: null };
			if (formPublish.titulo.$invalid) {
				if (formPublish.titulo.$error.required) {
					errors.titulo = 'El campo nombre no puede ser vacío';
				}
			}
			if (formPublish.descripcion.$invalid) {
				if (formPublish.descripcion.$error.required) {
					errors.descripcion = 'El campo descripción no puede ser vacío';
				}
			}
			if (formPublish.ubicacion.$invalid) {
				if (formPublish.ubicacion.$error.required) {
					errors.ubicacion = 'El campo ubicación no puede ser vacío, ya que sirve para reducir la búsqueda';
				}
			}
			if (formPublish.file.$error.maxsize) {
				errors.img = 'La imagen no puede exceder 1MB';
			}
			return errors;
		}

		/**
		 * Permite saber si el formulario es valido
		 *	@returns boolean
		*/
		function isValidForm(errors) {
			return (
				errors.titulo === null &&
				errors.descripcion === null &&
				errors.ubicacion === null &&
				errors.img === null
			);
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
      fecha_alta: Utils.getDate()
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

  }
]);

angular.module("lostThings.services").factory("Authentication", [
  "$http",
  "API_SERVER",
  function($http, API_SERVER) {

    /**
     * Permite autenticar al usuario contra la API de PHP
     * @param {Object} user
     * @return boolean
     */
    function login(user) {
      return $http.post(`${API_SERVER}/login`, user).then(function(response) {
        if (response.data.status === 1) {
          setUserData(response.data.data.user);
          setToken(response.data.data.token);
          return true;
        }
        return false;
      });
    }

    /**
     * Permite eliminar el token del usuario y la data del mismo del localStorage
     * @returns void
     */
    function logout() {
      localStorage.clear();
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
      return getToken() !== null;
    }

    /**
     * Permite guardar el token en el localStorage
     * @param {string} token 
     */
    function setToken(token) {
      localStorage.setItem('token', token);
    }

     /**
     * Permite obtener el token JWT
     * @return {string}
     */
    function getToken() {
      return localStorage.getItem('token');
    }

    /** Permit guardar la informacion del usuario en el localStorage
     * @param {Object} userData
     * @returns void
     */
    function setUserData(userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }

    /**
     * Permite obtener la información del usuario logueado
     * @returns {Object} userData
     */
    function getUserData() {
      return JSON.parse(localStorage.getItem('userData'));
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
      return $http.get(`${API_SERVER}/items?search=${search}`);
    }

    /**
     * Permite publicar un item para mostrarse en el listado
     * @param {Object} item
     */
    function publishItem(item) {
      item.img = item.img ? `data:${item.img.filetype};base64, ${item.img.base64}` : null;
      return $http.post(`${API_SERVER}/items`, item);
    }

    /**
     * Permite obtener el detalle de una publicacion
     * @param {number} id
     * @returns Promise
     */
    function getDetail(id) {
      return $http.get(`${API_SERVER}/items/${id}`);
    }

    /**
     * Permite editar una publicación, se envia el id del mismo y el item
     * con los datos a modificar...
     * @param {number} id 
     * @param {Object} item 
     * @returns Promise
     */
    function edit(id, item) {
      return $http.put(`${API_SERVER}/items/${id}`, item);
    }

    /**
     * Permite eliminar una publicación por el id de la misma
     * @param {number} id 
     * @returns Promise
     */
    function remove(id) {
      return $http.delete(`${API_SERVER}/items/${id}`);
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
      edit: edit,
      remove: remove,
      commentPublication: commentPublication
    };
  }
]);


angular
.module('lostThings.services')
.factory('Profile', 
    ["$http",
    "API_SERVER",
    function($http, API_SERVER){
        
        /**
         * Permite editar los datos del usuario
         * @param userData
         * @returns Promise
         */
        function edit(userData) {
            return $http.put(`${API_SERVER}/profile`, userData);
        }

        /**
         * Permite modificar la contraseña que posee el usuario
         * @param {Object} requestPassword 
         */
        function changePassword(requestPassword) {
            //poner despues el valor real
            //return $http.put()
            return new Promise((resolve, reject) => resolve({data: { status: 1 , msg: 'todo ok'}}));
        }

        return {
            edit: edit,
            changePassword: changePassword
        }

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

		/**
		 * Permite crear la fecha del alta del usuario para enviar al backend de php
		 * en el formato que entiende mySQL
		 * @return string
		 */
		function getDate() {
			let date = new Date();
			return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
		}

		/**
		 * Permite crear un popup de confirmación
		 * @param {string} title
		 * @param {string} text
		 */
		function showConfirm(title, text) {
			return $ionicPopup.confirm({ title: title, template: text,  cssClass:'lost-things-popup', okText: 'Aceptar', cancelText: 'Cancelar' });
		}

        return {
			showPopup: showPopup,
			getDate: getDate,
			showConfirm: showConfirm
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
