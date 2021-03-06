"use strict";

/**
 * Módulos que utiliza la App
 * lostThings.controllers: Este módulo se encarga de manejar todos los controllers
 * lostThings.services: Este módulo se encarga de manejar todos los services
 * naif.base64: Este módulo es un módulo externo, que da una directiva para poder obtener
 * de forma rápida el base64 de un archivo de imagen, más info en el git del user
 * Instalación npm install angular-base64-upload --save
 * https://github.com/adonespitogo/angular-base64-upload
 */
angular.module('lostThings', ['ionic', 'lostThings.controllers', 'lostThings.services', 'naif.base64']).run(function ($ionicPlatform, $rootScope, $state, Utils, Authentication) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  }); //Permite validar cuando cambia el state si tiene permisos el usuario para acceder a una view especifica

  $rootScope.$on('$stateChangeStart', function (event, toState) {
    if (toState.data != undefined && toState.data.requiresAuth) {
      if (!Authentication.isLogged()) {
        event.preventDefault();
        Utils.showPopup('Usuario no autorizado', 'No se puede acceder a esta sección sin estar autenticado.').then(function () {
          return $state.go('login');
        });
      }
    }
  });
}).config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  /*
    Rutas de la aplicacion, hay 5 views las cuales no
    dependen de tab, ya que se necesita que no dependendan del tab
    estas son Login ,Register, Detail, Profile, Chat una vez que ingresan a la aplicación
    el dashboard es el main view (tabs)
  */
  $stateProvider.state('dashboard', {
    url: '/dashboard',
    abstract: true,
    templateUrl: 'templates/dashboard.html'
  }).state('dashboard.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/dashboard-home.html',
        controller: 'HomeCtrl'
      }
    },
    data: {
      requiresAuth: true
    }
  }).state('dashboard.friends', {
    url: '/friends',
    views: {
      'tab-friends': {
        templateUrl: 'templates/dashboard-friends.html',
        controller: 'FriendsCtrl'
      }
    },
    data: {
      requiresAuth: true
    }
  }).state('dashboard.publish', {
    url: '/publish',
    views: {
      'tab-publish': {
        templateUrl: 'templates/dashboard-publish.html',
        controller: 'PublishCtrl'
      }
    },
    data: {
      requiresAuth: true
    }
  }).state('dashboard.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/dashboard-profile.html',
        controller: 'ProfileCtrl'
      }
    },
    data: {
      requiresAuth: true
    }
  }) //Estas views no dependen del dashboard, ya que no se quiere mostrar los tabs...
  .state('detail', {
    url: '/detail/:id',
    templateUrl: 'templates/detail.html',
    controller: 'DetailCtrl',
    data: {
      requiresAuth: true
    }
  }).state('chat', {
    url: '/chat/:iduser/:tokenchat',
    templateUrl: 'templates/chat.html',
    controller: 'ChatCtrl',
    data: {
      requiresAuth: true
    }
  }).state('profile', {
    url: '/profile/:id/:isFriend',
    templateUrl: 'templates/profile.html',
    controller: 'ProfileUserCtrl',
    data: {
      requiresAuth: true
    }
  }).state('intro', {
    url: '/intro',
    templateUrl: 'templates/intro.html'
  }).state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  }).state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  }); //Por default se muestra la view de login...

  $urlRouterProvider.otherwise('/login'); //Se configura el texto del button back a mostrar...

  $ionicConfigProvider.backButton.text('Atrás');
}).constant('API_SERVER', 'http://localhost/lostthings/api/public'); //Módulo para los services

angular.module('lostThings.services', []); //Módulo para los controllers

angular.module('lostThings.controllers', []);
"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

angular.module('lostThings.controllers').controller('ChatCtrl', ['$scope', '$state', '$stateParams', 'Utils', 'Authentication', 'Chat', 'Profile', '$ionicLoading', function ($scope, $state, $stateParams, Utils, Authentication, Chat, Profile, $ionicLoading) {
  //Al ingresar a la view, obtiene los mensajes de los chats
  $scope.$on('$ionicView.beforeEnter', function () {
    //Datos del user logueado...
    $scope.idUser = Authentication.getUserData().idusuario;
    $scope.usuario = Authentication.getUserData().usuario; //Default request para el mensaje, se setea vacío

    $scope.msg = getDefaultMsg(); //Se obtiene la info adicional del usuario al enviar el mensaje (usuario, imagen, etc...)

    Profile.getAdditionalInfo($stateParams.iduser).then(function (res) {
      $scope.profile = res.data.data;
    }).catch(function (res) {
      return Utils.showPopup('Chat', 'Se produjo un error al obtener los datos del perfil');
    }); //Se obtiene todos los mensajes de este chat por el token...

    Chat.getChatsmsgs($stateParams.tokenchat).then(function (res) {
      return $scope.mensajeschat = res.data;
    }).catch(function () {
      return Utils.showPopup('Chat', 'Se produjo un error al obtener los mensajes del chat');
    });
  });
  /**
   * Permite enviar un mensaje a un usuario, valida los datos al enviar...
   * @param {Object} formComments
   * @param {Object} msg
   * @returns void
   */

  $scope.addmsg = function (formmsgs, msg) {
    $scope.errors = {
      mensaje: null
    };

    if (formmsgs.mensaje.$invalid) {
      if (formmsgs.mensaje.$error.required) {
        $scope.errors.mensaje = 'El campo no puede ser vacío';
      }
    } else {
      $ionicLoading.show();
      Chat.sendmsg({
        tokenchat: $stateParams.tokenchat,
        idUser: $scope.idUser,
        msg: msg.content
      }).then(function (res) {
        $ionicLoading.hide();

        if (res.data.status === 1) {
          var chatCreated = _objectSpread({}, res.data.data, {
            usuario: $scope.usuario
          });

          $scope.mensajeschat.push(chatCreated);
          $scope.msg = getDefaultMsg();
        } else {
          Utils.showPopup('Mensaje', res.data.message);
        }
      }).catch(function () {
        $ionicLoading.hide();
        Utils.showPopup('Mensaje ', 'Se produjo un error al enviar el mensaje');
      });
    }
  };
  /**
   * Permite resetear el campo del chat 
   * @returns Object
   */


  function getDefaultMsg() {
    return {
      content: ''
    };
  }
}]);
"use strict";

angular.module('lostThings.controllers').controller('DetailCtrl', ['$scope', '$state', '$stateParams', 'Utils', 'Items', 'Comments', 'Authentication', '$ionicLoading', function ($scope, $state, $stateParams, Utils, Items, Comments, Authentication, $ionicLoading) {
  //Contenido de la publicacion
  $scope.item = null; //Comentarios de la publicación

  $scope.comentarios = []; //Permite saber si la publicación es del usuario logueado para poder editar o eliminarla...

  $scope.isMyPublish = false; //Información del usuario logueado

  var idUser = Authentication.getUserData().idusuario; //Al ingresar a la view, obtiene el detalle de la publicacion, con los comentarios

  $scope.$on('$ionicView.beforeEnter', function () {
    //Flag modo edición
    $scope.showEditable = false; //Request para editar la publicación

    $scope.requestEdit = {}; //Request comentario

    $scope.comment = getDefaultRequest(); //Obtengo el detalle de la publicación

    $ionicLoading.show();
    Items.getDetail($stateParams.id).then(function (res) {
      $ionicLoading.hide();
      var item = res.data;
      $scope.item = item;
      $scope.requestEdit = createDefaultRequest(item);
      $scope.isMyPublish = item.fkidusuario === idUser;
    }).catch(function () {
      $ionicLoading.hide();
      Utils.showPopup('Detalle', 'Se produjo un error al obtener la información adicional');
    });
    Comments.getComments($stateParams.id).then(function (res) {
      return $scope.comentarios = res.data;
    }).catch(function () {
      return Utils.showPopup('Detalle', 'Se produjo un error al obtener los comentarios de la publicación');
    });
  });
  /**
   * Permite comentar una publicacion, realiza las validaciones y 
   * genera el alta del comentario en la publicacion
   * @param {Object} formComments
   * @param {Object} comment
   * @returns void
   */

  $scope.addComment = function (formComments, comment) {
    $scope.errors = {
      comentario: null
    };

    if (formComments.comentario.$invalid) {
      if (formComments.comentario.$error.required) {
        $scope.errors.comentario = 'El campo no puede ser vacío';
      }
    } else {
      var idPublish = $scope.item.idpublicacion;
      Comments.publish(idPublish, $scope.comment).then(function (res) {
        if (res.data.status === 1) {
          $scope.comentarios.push(res.data.data);
          $scope.comment = getDefaultRequest();
        } else {
          Utils.showPopup('Comentar', res.data.message);
        }
      }).catch(function () {
        return Utils.showPopup('Comentar', 'Se produjo un error al comentar');
      });
    }
  };
  /**
   * Permite cambiar el estado del flag para visualizar el contenido
   * de edicion / lectura
   * @returns void
   */


  $scope.toggleEdit = function () {
    $scope.showEditable = !$scope.showEditable;
  };
  /**
   * Permite actualizar el item de la publicacion
   * @param {Object} formEdit 
   * @param {Object} requestEdit 
   * @returns void
   */


  $scope.edit = function (formEdit, requestEdit) {
    $scope.errors = validateFields(formEdit);

    if (isValidForm($scope.errors)) {
      Items.edit($scope.item.idpublicacion, $scope.requestEdit).then(function (response) {
        if (response.data.status === 1) {
          Utils.showPopup('Editar', 'Se actualizó el item').then(function () {
            return $state.go('dashboard.home');
          });
        } else {
          Utils.showPopup('Editar', response.data.message);
        }
      }).catch(function () {
        return Utils.showPopup('Editar', '¡Ups se produjo un error al actualizar su publicación');
      });
    }
  };
  /**
   * Permite eliminar una publicación por el id de la misma
   * @returns void
   */


  $scope.removeItem = function () {
    if ($scope.item.fkidusuario === idUser) {
      Utils.showConfirm('Eliminar', '¿Estás seguro de eliminar?').then(function (accept) {
        if (accept) {
          Items.remove($scope.item.idpublicacion).then(function (res) {
            Utils.showPopup('Eliminar', res.data.message).then(function () {
              return $state.go('dashboard.home');
            });
          }).catch(function () {
            return Utils.showPopup('Eliminar', 'Se produjo un error al eliminar su publicación');
          });
        }
      });
    } else {
      Utils.showPopup('Eliminar', 'No puedes eliminar una publicación que no es tuya');
    }
  };
  /**
   * Permite validar los datos ingresados por el usuario al modificar un item
   * @param {Object} formPublish 
   * @return errors
   */


  function validateFields(formEdit) {
    var errors = {
      titulo: null,
      descripcion: null,
      ubicacion: null,
      img: null
    };

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
    return errors.titulo === null && errors.descripcion === null && errors.ubicacion === null && errors.img === null;
  }
  /**
   * Permite crear el objeto default del request, se filtran los datos
   * que ya trae el backend, porque no se necesitan por ejemplo los comentarios
   * @param {Object} item 
   * @returns Object
   */


  function createDefaultRequest(item) {
    var titulo = item.titulo,
        descripcion = item.descripcion,
        ubicacion = item.ubicacion,
        img = item.img;
    return {
      titulo: titulo,
      descripcion: descripcion,
      ubicacion: ubicacion,
      img: img
    };
  }
  /**
   * Permite crear el request default
   * @returns Object
   */


  function getDefaultRequest() {
    return {
      comentario: '',
      idusuario: idUser
    };
  }
}]);
"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

angular.module('lostThings.controllers').controller('FriendsCtrl', ['$scope', '$state', '$stateParams', 'Utils', 'Friends', 'Profile', '$ionicLoading', 'Chat', function ($scope, $state, $stateParams, Utils, Friends, Profile, $ionicLoading, Chat) {
  //NgModel para el input del autocompletado
  $scope.search = ''; //Lista de usuarios por default vacía

  $scope.users = []; //Lista de amigos por default vacía

  $scope.friends = []; //Lista de solicitudes de amistad 

  $scope.invitations = []; //Al ingresar a la view, actualiza la lista de amigos

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.getFriendsByUser();
    $scope.getAllRequest();
  });
  /**
   * Permite actualizar la lista de amigos
   * Emite un evento para decirle que termino y que corte el refresh...
   * @returns void
   */

  $scope.doRefresh = function () {
    Friends.all().then(function (res) {
      $scope.friends = res.data;
      $scope.$broadcast('scroll.refreshComplete');
    }).catch(function () {
      $scope.$broadcast('scroll.refreshComplete');
      Utils.showPopup('Amigos', "Se produjo un error al obtener los amigos");
    });
    $scope.getAllRequest();
  };
  /**
   * Permite buscar si existen usuarios con el valor ingresado por el usuario,
   * consulta la API de amigos de PHP para obtener los resultados, se realiza si el
   * usuario ingresa mas de 2 carácteres
   * @param {string} search 
   * @returns void
   */


  $scope.searchFriends = function (search) {
    if (search.length >= 2) {
      $ionicLoading.show();
      Profile.search(search).then(function (res) {
        $ionicLoading.hide();
        $scope.users = $scope.mapperUsers($scope.friends, res.data);
      }).catch(function () {
        $ionicLoading.hide();
        Utils.showPopup('Amigos', "Se produjo al buscar los amigos por el campo ".concat(input));
      });
    }
  };
  /**
   * Permite buscar los amigos que posee el usuario
   * @returns void
   */


  $scope.getFriendsByUser = function () {
    $ionicLoading.show();
    Friends.all().then(function (res) {
      $ionicLoading.hide();
      $scope.friends = res.data;
    }).catch(function () {
      $ionicLoading.hide();
      Utils.showPopup('Amigos', "Se produjo un error al obtener los amigos");
    });
  };
  /**
   * Permite agregar un usuario a la lista de amigos de la persona que esta logueada
   * @param {number} id
   * @returns void
   */


  $scope.add = function (id) {
    Utils.showConfirm('Amigos', '¿Deseas enviar una solicitud de amistad?').then(function (accept) {
      if (accept) {
        $ionicLoading.show();
        Friends.sendRequest(id).then(function () {
          $ionicLoading.hide();
          Utils.showPopup('Amigos', 'Se envió la solicitud de amistad!');
        }).catch(function () {
          $ionicLoading.hide();
          Utils.showPopup('Amigos', 'Se produjo un error al enviar la solicitud');
        });
      }
    });
  };
  /**
   * Permite obtener todas las invitaciones que recibio el usuario..
   */


  $scope.getAllRequest = function () {
    Friends.allRequest().then(function (res) {
      return $scope.invitations = res.data;
    }).catch(function () {
      return Utils.showPopup('Amigos', 'Se produjo un error al obtener las solicitudes recibidas');
    });
  };
  /**
   * Permite eliminar a un usuario de la lista de amigos de la persona logueada, o eliminar una solicitud
   * recibida...
   * @param {number} idUser
   * @returns void
   */


  $scope.remove = function (id, isRequest) {
    Utils.showConfirm('Amigos', '¿Estas seguro de eliminar?').then(function (accept) {
      if (accept) {
        $ionicLoading.show();
        Friends.remove(id).then(function () {
          $ionicLoading.hide();

          if (isRequest) {
            $scope.invitations = $scope.invitations.filter(function (friend) {
              return friend.idamigo !== id;
            });
          } else {
            $scope.friends = $scope.friends.filter(function (friend) {
              return friend.idamigo !== id;
            });
          }
        }).catch(function () {
          $ionicLoading.hide();
          Utils.showPopup('Amigos', 'Se produjo un error al eliminar al usuario');
        });
      }
    });
  };
  /**
   * Permite iniciar una conversación un usuario X, no es necesario que sea amigo para iniciarla
   * @param {Object} user
   * @returns void
   */


  $scope.startChat = function (user) {
    $ionicLoading.show();
    Chat.createChat(user).then(function (res) {
      $ionicLoading.hide();
      var tokenchat = res.data.data.tokenchat;
      $state.go('chat', {
        'iduser': user.idusuario,
        'tokenchat': tokenchat
      });
    }).catch(function () {
      $ionicLoading.hide();
      Utils.showPopup('Chats', '¡Ups se produjo un error al querer chatear.');
    });
  };
  /**
   * Permite aceptar la invitación de un usuario
   * @param {Object} friend
   * @returns void
   */


  $scope.acceptFriend = function (friend) {
    Friends.acceptRequest(friend.idamigo).then(function () {
      $scope.invitations = $scope.invitations.filter(function (friend) {
        return friend.idamigo !== friend.idamigo;
      });
      $scope.friends = [].concat(_toConsumableArray($scope.friends), [friend]);
    }).catch(function () {
      return Utils.showPopup('Amigos', 'Se produjo un error al aceptar la solicitud de amistad');
    });
  };
  /**
   * Permite realizar un mapper del resultado de usuarios recibidos del autocompletado,
   * se verifica si existen amigos del usuario, si hay se agrega un flag para mostrarlo
   * en el html
   * @param {Array} friends
   * @param {Array} users
   * @return {Array} users
   */


  $scope.mapperUsers = function (friends, users) {
    return users.map(function (user) {
      if ($scope.isFriend(friends, user.idusuario)) {
        return _objectSpread({}, user, {
          isFriend: true
        });
      }

      return user;
    });
  };
  /**
   * Permite verificar si en la lista de amigos del usuario, el id recibido
   * por parametro es amigo de el
   * @param {Array} friends
   * @param {number} idUser
   * @returns boolean
   */


  $scope.isFriend = function (friends, idUser) {
    return friends.findIndex(function (friend) {
      return friend.idamigo === idUser;
    }) !== -1;
  };
  /**
   * Permite ir al perfil del usuario seleccionado por el id, verifica
   * si ya son amigos para mostrar en el perfil del usuario a ver...
   * @param {number} idUser
   * @returns void
   */


  $scope.showProfile = function (idUser) {
    var friendShip = $scope.isFriend($scope.friends, idUser);
    $state.go('profile', {
      'id': idUser,
      'isFriend': friendShip
    });
  };
}]);
"use strict";

angular.module('lostThings.controllers').controller('HomeCtrl', ['$scope', '$state', 'Items', 'Utils', '$ionicLoading', function ($scope, $state, Items, Utils, $ionicLoading) {
  //Flag para mostrar el campo de búsqueda
  $scope.showSearch = false; //Al ingresar a la view, actualiza la lista de items

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.getAllItems();
  });
  /**
   * Permite mostrar y esconder el formulario
   * de busqueda para realizar una busqueda de items
   * @returns void
   */

  $scope.toggleSearch = function () {
    $scope.showSearch = !$scope.showSearch;
  };
  /**
   * Permite buscar los items, por default se busca '', osea trae todo
   * @param {string} search
   * @returns void
   */


  $scope.searchItems = function () {
    var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    $ionicLoading.show();
    Items.searchItems(search).then(function (res) {
      $ionicLoading.hide();
      $scope.items = res.data;
    }).catch(function () {
      $ionicLoading.hide();
      Utils.showPopup('Home', "Se produjo un error al buscar ".concat(search, " en los resultados"));
    });
  };
  /**
   * Permite actualizar la lista de resultados...
   * Emite un evento para decirle que termino y que corte el refresh...
   * @returns void
   */


  $scope.doRefresh = function () {
    Items.getAllItems().then(function (res) {
      $scope.items = res.data;
      $scope.$broadcast('scroll.refreshComplete');
    }).catch(function () {
      $scope.$broadcast('scroll.refreshComplete');
      Utils.showPopup('Home', 'Se produjo un error al actualizar los resultados');
    });
  };
  /**
   * Permite obtener todos los items publicados hasta la fecha,
   * muestra mensaje de error si ocurre un error...
   * @returns void
   */


  $scope.getAllItems = function () {
    $ionicLoading.show();
    Items.getAllItems().then(function (res) {
      $ionicLoading.hide();
      $scope.items = res.data;
    }).catch(function () {
      $ionicLoading.hide();
      Utils.showPopup('Home', 'Se produjo un error al obtener los resultados');
    });
  };
  /**
   * Permite ir al detalle de una publicación
   * @param {number} id
   * @returns void
   */


  $scope.goDetail = function (id) {
    $state.go('detail', {
      'id': id
    });
  };
}]);
"use strict";

angular.module('lostThings.controllers').controller('LoginCtrl', ['$scope', '$state', 'Authentication', 'Utils', '$ionicLoading', function ($scope, $state, Authentication, Utils, $ionicLoading) {
  //Request Login
  $scope.user = {
    email: '',
    password: ''
  };
  /**
   * Permite autenticar al usuario
   * Valida los datos recibidos, si sale todo OK si sale bien , redirige...
   * @param {Object} formLogin
   * @param {Object} user
   * @returns void
   */

  $scope.login = function (formLogin, user) {
    $scope.errors = validateFields(formLogin);

    if ($scope.errors.email === null && $scope.errors.password === null) {
      $ionicLoading.show();
      Authentication.login(user).then(function (success) {
        $ionicLoading.hide();

        if (success) {
          Utils.showPopup('Iniciar Sesión', 'Se ha autenticado correctamente!').then(function () {
            return $state.go('dashboard.home');
          });
        } else {
          Utils.showPopup('Iniciar Sesión', 'Los datos ingresados no son correctos');
        }
      }).catch(function () {
        $ionicLoading.hide();
        Utils.showPopup('Iniciar Sesión', '¡Ups se produjo un error al autenticarse');
      });
    }
  };
  /**
   * Permite validar los datos ingresados por el usuario
   * @param {Object} formLogin
   * @return errors
   */


  function validateFields(formLogin) {
    var errors = {
      email: null,
      password: null
    };

    if (formLogin.email.$invalid) {
      if (formLogin.email.$error.required) {
        errors.email = 'El campo email no puede ser vacío';
      }

      if (formLogin.email.$error.email) {
        errors.email = 'No es un email válido';
      }
    }

    if (formLogin.password.$invalid) {
      if (formLogin.password.$error.required) {
        errors.password = 'El campo password no puede ser vacío';
      }
    }

    return errors;
  }
}]);
"use strict";

angular.module('lostThings.controllers').controller('ProfileCtrl', ['$scope', '$state', 'Authentication', 'Profile', 'Utils', '$ionicLoading', function ($scope, $state, Authentication, Profile, Utils, $ionicLoading) {
  $scope.$on('$ionicView.beforeEnter', function () {
    //Request para cambiar la contraseña
    $scope.requestPassword = {
      password: '',
      newpassword: ''
    }; //Request para editar los datos

    $scope.requestEdit = {
      nombre: '',
      apellido: ''
    }; //Flag para mostrar el formulario de edición

    $scope.enableEdit = false;
    $ionicLoading.show();
    Profile.getAdditionalInfo().then(function (response) {
      $ionicLoading.hide();
      $scope.updateValues(response.data.data);
    }).catch(function () {
      $ionicLoading.hide();
      Utils.showPopup("Perfil", "¡Ups se produjo un error al obtener la información adicional");
    });
  });
  /**
   * Permite habilitar / deshabilitar el formulario de edición
   * @returns void
   */

  $scope.toggleEnableEdit = function () {
    $scope.enableEdit = !$scope.enableEdit;
  };
  /**
   * Permite editar el perfil del usuario con los datos recibidos
   * @param {Object} formEdit
   * @param {Object} user
   * @returns void
   */


  $scope.editProfile = function (formEdit, user) {
    $scope.errors = validateFields(formEdit);

    if ($scope.errors.nombre === null && $scope.errors.apellido === null) {
      $ionicLoading.show();
      Profile.edit($scope.requestEdit).then(function (response) {
        $ionicLoading.hide();

        if (response.data.status === 1) {
          Utils.showPopup("Perfil", "Se actualizó correctamente su perfil!").then(function () {
            $scope.updateValues(response.data.data);
            $scope.toggleEnableEdit();
          });
        } else {
          Utils.showPopup("Perfil", "No se pudo actualizar su perfil, intente más tarde");
        }
      }).catch(function () {
        $ionicLoading.hide();
        Utils.showPopup("Perfil", "¡Ups se produjo un error al modificar los datos");
      });
    }
  };
  /**
   * Permite modificar el password del usuario, valida los datos
   * y realiza la actualización llamando al service...
   * @param {string} formChangePassword 
   * @param {string} requestPassword 
   * @returns void
   */


  $scope.changePassword = function (formChangePassword, requestPassword) {
    $scope.errorsFormChangePassword = validateFieldsPassword(formChangePassword);

    if ($scope.errorsFormChangePassword.password === null && $scope.errorsFormChangePassword.newpassword === null) {
      $ionicLoading.show();
      Profile.changePassword($scope.requestPassword).then(function (response) {
        $ionicLoading.hide();

        if (response.data.status === 1) {
          Utils.showPopup("Perfil", "Se actualizó correctamente su password!");
        } else {
          Utils.showPopup("Perfil", "No se pudo actualizar su password, intente más tarde");
        }
      }).catch(function () {
        $ionicLoading.hide();
        Utils.showPopup("Perfil", "¡Ups se produjo un error al modificar su password");
      });
    }
  };
  /**
   * Permite cerrar la sesión del usuario, borra el token del mismo
   * redirige al login
   * @returns void
   */


  $scope.logout = function () {
    Authentication.logout();
    $state.go('login');
  };

  $scope.updateValues = function (user) {
    $scope.requestEdit.nombre = user.nombre;
    $scope.requestEdit.apellido = user.apellido;
  };
  /**
   * Permite validar los datos ingresados por el usuario
   * @param {Object} formEdit
   * @returns errors
   */


  function validateFields(formEdit) {
    var errors = {
      nombre: null,
      apellido: null
    };

    if (formEdit.nombre.$invalid) {
      if (formEdit.nombre.$error.required) {
        errors.nombre = "El campo nombre no puede ser vacío";
      }
    }

    if (formEdit.apellido.$invalid) {
      if (formEdit.apellido.$error.required) {
        errors.apellido = "El campo apellido no puede ser vacío";
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
    var errors = {
      password: null,
      newpassword: null
    };

    if (formChangePassword.password.$invalid) {
      if (formChangePassword.password.$error.required) {
        errors.password = "Su password actual no puede ser vacía";
      }
    }

    if (formChangePassword.newpassword.$invalid) {
      if (formChangePassword.newpassword.$error.required) {
        errors.newpassword = "Su nuevo password no puede ser vacío";
      }
    }

    return errors;
  }
}]);
"use strict";

angular.module('lostThings.controllers').controller('ProfileUserCtrl', ['$scope', '$state', '$stateParams', 'Authentication', 'Friends', 'Profile', 'Chat', 'Items', 'Utils', '$ionicLoading', function ($scope, $state, $stateParams, Authentication, Friends, Profile, Chat, Items, Utils, $ionicLoading) {
  $scope.profile = null;
  $scope.items = [];
  $scope.isFriend = false; //Al ingresar a la view, se trae toda la info del perfil del usuario, ya que puede variar...

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.isFriend = $stateParams.isFriend === 'true';
    $scope.getAllInfo($stateParams.id);
  });
  /**
   * Permite obtener toda la información necesaria para cargar esta view
   * la lista de publicaciones que publico el usuario, como tambien la info de su
   * perfil, se hace uso de Promise all para poder realizar de manera mas facil
   * las 2 peticiones, si falla una, ya no sirve y se muestra una notificación.
   * @param {number} idUser
   * @returns void
   */

  $scope.getAllInfo = function (idUser) {
    $ionicLoading.show();
    Promise.all([Profile.getAdditionalInfo(idUser), Items.getItemsByUser(idUser)]).then(function (results) {
      $ionicLoading.hide();
      $scope.profile = results[0].data.data;
      $scope.items = results[1].data;
      $scope.$apply();
    }).catch(function () {
      $ionicLoading.hide();
      Utils.showPopup('Perfil', "Se produjo un error al obtener la informaci\xF3n del perfil del usuario");
    });
  };
  /**
  * Permite iniciar una conversación un usuario X, no es necesario que sea amigo para iniciarla
  * @param {Object} user
  * @returns void
  */


  $scope.startChat = function (user) {
    $ionicLoading.show();
    Chat.createChat(user).then(function (res) {
      $ionicLoading.hide();
      var tokenchat = res.data.data.tokenchat;
      $state.go('chat', {
        'iduser': user.idusuario,
        'tokenchat': tokenchat
      });
    }).catch(function () {
      $ionicLoading.hide();
      Utils.showPopup('Chats', '¡Ups se produjo un error al querer chatear.');
    });
  };
  /**
   * Permite agregar un usuario a la lista de amigos de la persona que esta logueada
   * @param {Object} user
   * @returns void
   */


  $scope.addFriend = function (user) {
    Utils.showConfirm('Amigos', '¿Deseas enviar una solicitud de amistad?').then(function (accept) {
      if (accept) {
        $ionicLoading.show();
        Friends.sendRequest(user.idusuario).then(function () {
          $ionicLoading.hide();
          Utils.showPopup('Amigos', 'Se envió la solicitud de amistad!');
        }).catch(function () {
          $ionicLoading.hide();
          Utils.showPopup('Amigos', "Se produjo un error al enviar la solicitud a ".concat(user.usuario));
        });
      }
    });
  };
  /**
  * Permite eliminar a un usuario de la lista de amigos de la persona logueada
  * recibida...
  * @param {Object} profile
  * @returns void
  */


  $scope.removeFriend = function (profile) {
    Utils.showConfirm('Amigos', "\xBFEstas seguro de eliminar a ".concat(profile.nombre, " de tus amigos?")).then(function (accept) {
      if (accept) {
        $ionicLoading.show();
        Friends.remove(profile.idusuario).then(function () {
          $ionicLoading.hide();
          $scope.isFriend = false;
        }).catch(function () {
          $ionicLoading.hide();
          Utils.showPopup('Amigos', 'Se produjo un error al eliminar al usuario');
        });
      }
    });
  };
  /**
   * Permite ir al detalle de una publicación
   * @param {number} id
   * @returns void
   */


  $scope.goDetail = function (id) {
    $state.go('detail', {
      'id': id
    });
  };
}]);
"use strict";

angular.module('lostThings.controllers').controller('PublishCtrl', ['$scope', '$state', 'Utils', 'Items', 'Authentication', "$ionicLoading", function ($scope, $state, Utils, Items, Authentication, $ionicLoading) {
  $scope.$on('$ionicView.beforeEnter', function () {
    //Información del usuario
    $scope.userData = Authentication.getUserData(); //Request Publish

    $scope.item = defaultRequest();
  });
  /**
   * Permite publicar un articulo para que se pueda encontrar
   * Si sale todo ok, redirige al home...
   * @param {Object} formPublish
   * @param {Object} item
   * @returns void
   */

  $scope.publish = function (formPublish, item) {
    $scope.errors = validateFields(formPublish);

    if (isValidForm($scope.errors)) {
      $ionicLoading.show();
      Items.publishItem($scope.item).then(function (response) {
        $ionicLoading.hide();
        Utils.showPopup('Publicar', '<p>Se ha subido su publicación <br /> ¡Buena suerte!</p>').then(function () {
          return $state.go('dashboard.home');
        });
      }).catch(function () {
        $ionicLoading.hide();
        Utils.showPopup('Publicar', '¡Ups se produjo un error al querer publicar su artículo');
      });
    }
  };
  /**
   * Permite validar los datos ingresados por el usuario al crear un item para publicar
   * @param {Object} formPublish 
   * @returns errors
   */


  function validateFields(formPublish) {
    var errors = {
      titulo: null,
      descripcion: null,
      ubicacion: null,
      img: null
    };

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
   * @param {Object} errors
   *	@returns boolean
  */


  function isValidForm(errors) {
    return errors.titulo === null && errors.descripcion === null && errors.ubicacion === null && errors.img === null;
  }
  /**
   * Permite generar el request default para publicar un item
   * @returns Object
   */


  function defaultRequest() {
    return {
      titulo: '',
      descripcion: '',
      ubicacion: '',
      img: null
    };
  }
}]);
"use strict";

angular.module('lostThings.controllers').controller('RegisterCtrl', ['$scope', '$state', 'Authentication', 'Utils', '$ionicLoading', function ($scope, $state, Authentication, Utils, $ionicLoading) {
  //Request Registro
  $scope.user = {
    email: '',
    password: '',
    usuario: '',
    nombre: '',
    apellido: ''
  };
  /**
   * Permite registrar al usuario valida los datos recibidos, si sale todo OK
   * realiza un redirect al login
   * @param {Object} formRegister
   * @param {Object} user
   * @returns void
   */

  $scope.register = function (formRegister, user) {
    $scope.errors = validateFields(formRegister);

    if (isValidForm($scope.errors)) {
      $ionicLoading.show();
      Authentication.register(user).then(function (success) {
        $ionicLoading.hide();

        if (success) {
          Utils.showPopup('Registrarse', 'Se ha creado su cuenta!').then(function () {
            return $state.go('login');
          });
        } else {
          Utils.showPopup('Registrarse', 'Se produjo un error al registrar al usuario');
        }
      }).catch(function () {
        $ionicLoading.hide();
        Utils.showPopup('Registrarse', '¡Ups se produjo un error al registrar al usuario');
      });
    }

    return false;
  };
  /**
   * Permite validar los datos ingresados por el usuario
   * @param {Object} formRegister
   * @return errors
   */


  function validateFields(formRegister) {
    var errors = {
      email: null,
      password: null,
      nombre: null,
      apellido: null,
      usuario: null,
      pic: ''
    };

    if (formRegister.email.$invalid) {
      if (formRegister.email.$error.required) {
        errors.email = 'El campo email no puede ser vacío';
      }

      if (formRegister.email.$error.email) {
        errors.email = 'No es un email válido';
      }
    }

    if (formRegister.password.$invalid) {
      if (formRegister.password.$error.required) {
        errors.password = 'El campo password no puede ser vacío';
      }
    }

    if (formRegister.usuario.$invalid) {
      if (formRegister.usuario.$error.required) {
        errors.usuario = 'El campo usuario no puede ser vacío';
      }
    }

    if (formRegister.nombre.$invalid) {
      if (formRegister.nombre.$error.required) {
        errors.nombre = 'El campo nombre no puede ser vacío';
      }
    }

    if (formRegister.apellido.$invalid) {
      if (formRegister.apellido.$error.required) {
        errors.apellido = 'El campo apellido no puede ser vacío';
      }
    }

    return errors;
  }
  /**
   * Permite saber si el formulario es valido
   *	@returns boolean
   */


  function isValidForm(errors) {
    return errors.email === null && errors.password === null && errors.nombre === null && errors.apellido === null && errors.usuario === null;
  }
}]);
"use strict";

angular.module('lostThings.services').factory('Authentication', ['$http', 'API_SERVER', function ($http, API_SERVER) {
  //Constantes 
  var KEY_LOST_THINGS_TOKEN = 'lost_things_token';
  var KEY_LOST_THINGS_USER = 'lost_things_user';
  /**
   * Permite autenticar al usuario contra la API de PHP
   * @param {Object} user
   * @returns Promise<boolean>
   */

  function login(user) {
    return $http.post("".concat(API_SERVER, "/login"), user).then(function (response) {
      if (response.data.status === 1) {
        setUserData(response.data.data.user);
        setToken(response.data.data.token);
        return true;
      }

      return false;
    });
  }
  /**
   * Permite obtener el token
   * @returns {string}
   */


  function getToken() {
    return localStorage.getItem(KEY_LOST_THINGS_TOKEN);
  }
  /**
   * Permite guardar el token en el localStorage
   * @param {string} value
   * @returns void
   */


  function setToken(value) {
    localStorage.setItem(KEY_LOST_THINGS_TOKEN, value);
  }
  /**
   * Permite guardar la info del usuario en el localStorage
   * @param {Object} value
   * @returns void
   */


  function setUserData(value) {
    localStorage.setItem(KEY_LOST_THINGS_USER, JSON.stringify(value));
  }
  /**
   * Permite obtener la información del usuario logueado
   * @returns Object
   */


  function getUserData() {
    return JSON.parse(localStorage.getItem(KEY_LOST_THINGS_USER));
  }
  /**
   * Permite eliminar los datos del usuario autenticado del localStorage...
   * @returns void
   */


  function logout() {
    localStorage.clear();
  }
  /**
   * Permite obtener el header por defecto para los endpoints con autenticación
   */


  function getHeaderForAPI() {
    return {
      headers: {
        'X-Token': getToken()
      }
    };
  }
  /**
   * Permite registrar al usuario utilizando la API de PHP
   * @param {Object} user
   * @returns Promise<boolean>
   */


  function register(user) {
    return $http.post("".concat(API_SERVER, "/profile"), user).then(function (res) {
      var response = res.data;

      if (response.status === 1) {
        return true;
      }

      return false;
    });
  }
  /**
   * Permite saber si el usuario esta logueado, valida si existe el token
   * @returns boolean
   */


  function isLogged() {
    return getToken() !== null;
  }

  return {
    login: login,
    logout: logout,
    register: register,
    isLogged: isLogged,
    getUserData: getUserData,
    getToken: getToken,
    getHeaderForAPI: getHeaderForAPI
  };
}]);
"use strict";

angular.module('lostThings.services').factory('Chat', ['$http', 'API_SERVER', 'Authentication', function ($http, API_SERVER, Authentication) {
  /**
   * Permite generar un chat con su token único
   * @param {Object} user
   * @returns Promise
   */
  function createChat(user) {
    return $http.post("".concat(API_SERVER, "/chats"), user, Authentication.getHeaderForAPI());
  }
  /**
   * Permite obtener los mensajes que posee una chat por el tokenchat de la room
   * @param {string} tokenchat 
   * @returns Promise
   */


  function getChatsmsgs(tokenchat) {
    return $http.get("".concat(API_SERVER, "/chatsmsgs/").concat(tokenchat), Authentication.getHeaderForAPI());
  }
  /**
   * Permite enviar mensaje al chat
   * @param {Object} data 
   * @returns Promise
   */


  function sendmsg(data) {
    return $http.post("".concat(API_SERVER, "/chatsmsgs"), data, Authentication.getHeaderForAPI());
  }

  return {
    createChat: createChat,
    getChatsmsgs: getChatsmsgs,
    sendmsg: sendmsg
  };
}]);
"use strict";

angular.module('lostThings.services').factory('Comments', ['$http', 'API_SERVER', 'Authentication', function ($http, API_SERVER, Authentication) {
  /**
   * Permite obtener los comentarios que posee una publicacion por el id de la publicacion
   * @param {number} id 
   * @returns Promise
   */
  function getComments(id) {
    return $http.get("".concat(API_SERVER, "/comments/").concat(id), Authentication.getHeaderForAPI());
  }
  /**
   * Permite publicar un comentario a la publicacion
   * @param {number} id 
   * @param {Object} comment 
   * @returns Promise
   */


  function publish(id, comment) {
    return $http.post("".concat(API_SERVER, "/comments/").concat(id), comment, Authentication.getHeaderForAPI());
  }

  return {
    getComments: getComments,
    publish: publish
  };
}]);
"use strict";

angular.module('lostThings.services').factory('Friends', ['$http', 'API_SERVER', 'Authentication', function ($http, API_SERVER, Authentication) {
  /**
   * Permite obtener los amigos que posee el usuario logueado por el id del mismo
   * @returns Promise
   */
  function all() {
    return $http.get("".concat(API_SERVER, "/friends"), Authentication.getHeaderForAPI());
  }
  /**
   * Permite obtener todas las invitaciones recibidas
   * @returns Promise
   */


  function allRequest() {
    return $http.get("".concat(API_SERVER, "/friends/request"), Authentication.getHeaderForAPI());
  }
  /**
   * Permite enviar una solicitud de amistad
   * @param {number} id
   * @returns Promise
   */


  function sendRequest(id) {
    return $http.post("".concat(API_SERVER, "/friends/request/").concat(id), null, Authentication.getHeaderForAPI());
  }
  /**
   * Permite aceptar una solicitud de amistad
   * @param {number} id
   * @returns Promise
   */


  function acceptRequest(id) {
    return $http.put("".concat(API_SERVER, "/friends/request/").concat(id), null, Authentication.getHeaderForAPI());
  }
  /**
   * Permite eliminar un amigo de la lista de amigos del usuario
   * @param {number} id
   * @returns Promise
   */


  function remove(id) {
    return $http.delete("".concat(API_SERVER, "/friends/").concat(id), Authentication.getHeaderForAPI());
  }

  return {
    all: all,
    allRequest: allRequest,
    sendRequest: sendRequest,
    acceptRequest: acceptRequest,
    remove: remove
  };
}]);
"use strict";

angular.module('lostThings.services').factory('Items', ['$http', 'API_SERVER', 'Authentication', function ($http, API_SERVER, Authentication) {
  /**
   * Permite obtener todos los items perdidos
   * @returns Promise
   */
  function getAllItems() {
    return $http.get("".concat(API_SERVER, "/items"));
  }
  /**
   * Permite obtener los items que publico el usuario
   * @param {number} idUser
   * @returns Promise
   */


  function getItemsByUser(idUser) {
    return $http.get("".concat(API_SERVER, "/items/user/").concat(idUser), Authentication.getHeaderForAPI());
  }
  /**
   * Permite buscar los items por el valor ingresado como parametro, si el usuario
   * ingresa vacio, se trae todo...
   * @param {string} input
   * @returns Promise
   */


  function searchItems(input) {
    if (input.length > 0) {
      return $http.get("".concat(API_SERVER, "/items/search/").concat(input));
    } else {
      return getAllItems();
    }
  }
  /**
   * Permite publicar un item para mostrarse en el listado,
   * antes de enviar se manipula el request y se genera el base64 para la imagen...
   * @param {Object} item
   * @returns Promise
   */


  function publishItem(item) {
    item.img = item.img ? "data:".concat(item.img.filetype, ";base64, ").concat(item.img.base64) : null;
    return $http.post("".concat(API_SERVER, "/items"), item, Authentication.getHeaderForAPI());
  }
  /**
   * Permite obtener el detalle de una publicacion
   * @param {number} id
   * @returns Promise
   */


  function getDetail(id) {
    return $http.get("".concat(API_SERVER, "/items/").concat(id), Authentication.getHeaderForAPI());
  }
  /**
   * Permite editar una publicación, se envia el id del mismo y el item
   * con los datos a modificar...
   * @param {number} id 
   * @param {Object} item 
   * @returns Promise
   */


  function edit(id, item) {
    return $http.put("".concat(API_SERVER, "/items/").concat(id), item, Authentication.getHeaderForAPI());
  }
  /**
   * Permite eliminar una publicación por el id de la misma
   * @param {number} id 
   * @returns Promise
   */


  function remove(id) {
    return $http.delete("".concat(API_SERVER, "/items/").concat(id), Authentication.getHeaderForAPI());
  }

  return {
    getAllItems: getAllItems,
    getItemsByUser: getItemsByUser,
    searchItems: searchItems,
    publishItem: publishItem,
    getDetail: getDetail,
    edit: edit,
    remove: remove
  };
}]);
"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

angular.module('lostThings.services').factory('Profile', ['$http', 'API_SERVER', 'Authentication', function ($http, API_SERVER, Authentication) {
  /**
   * Permite editar los datos del usuario, se envia en el HEADER 
   * el api key del jwt...
   * @param {Object} userData
   * @returns Promise
   */
  function edit(userData) {
    return $http.put("".concat(API_SERVER, "/profile"), userData, Authentication.getHeaderForAPI());
  }
  /**
   * Permite modificar la contraseña que posee el usuario
   * @param {Object} requestPassword 
   * @returns Promise
   */


  function changePassword(requestPassword) {
    return $http.put("".concat(API_SERVER, "/profile"), requestPassword, Authentication.getHeaderForAPI());
  }
  /**
   * Permite obtener la información del usuario adicional
   * @param {string} idUser
   * @returns Promise
   */


  function getAdditionalInfo(idUser) {
    if (idUser) {
      return $http.get("".concat(API_SERVER, "/profile/").concat(idUser), Authentication.getHeaderForAPI());
    }

    return $http.get("".concat(API_SERVER, "/profile"), Authentication.getHeaderForAPI());
  }
  /**
   * Permite buscar personas por el nickname o el nombre, se elimina de la lista
   * el usuario que esta buscando...
   * @param {string} input 
   * @returns Promise
   */


  function search(input) {
    var idUser = Authentication.getUserData().idusuario;
    return $http.get("".concat(API_SERVER, "/profile/search/").concat(input), Authentication.getHeaderForAPI()).then(function (response) {
      return _objectSpread({}, response, {
        data: response.data.filter(function (user) {
          return user.idusuario !== idUser;
        })
      });
    });
  }

  return {
    edit: edit,
    changePassword: changePassword,
    getAdditionalInfo: getAdditionalInfo,
    search: search
  };
}]);
"use strict";

angular.module('lostThings.services').factory('Utils', ['$ionicPopup', function ($ionicPopup) {
  /**
  * Permite crear una instancia del popup de ionic
  * @param {string} title titulo del popup
  * @param {string} text texto del popup, puede ser HTML
  * @returns Promise
  */
  function showPopup(title, text) {
    return $ionicPopup.alert({
      title: title,
      template: text,
      cssClass: 'lost-things-popup',
      okText: 'Aceptar'
    });
  }
  /**
   * Permite crear la fecha del alta del usuario para enviar al backend de php
   * en el formato que entiende mySQL
   * @returns string
   */


  function getDate() {
    var date = new Date();
    return "".concat(date.getFullYear(), "-").concat(date.getMonth(), "-").concat(date.getDate());
  }
  /**
   * Permite crear un popup de confirmación
   * @param {string} title
   * @param {string} text
   * @returns Promise
   */


  function showConfirm(title, text) {
    return $ionicPopup.confirm({
      title: title,
      template: text,
      cssClass: 'lost-things-popup',
      okText: 'Aceptar',
      cancelText: 'Cancelar'
    });
  }

  return {
    showPopup: showPopup,
    getDate: getDate,
    showConfirm: showConfirm
  };
}]);
"use strict";

/*! angular-base64-upload - v0.1.23
* https://github.com/adonespitogo/angular-base64-upload
* Copyright (c) Adones Pitogo <pitogo.adones@gmail.com> [Sat Aug 05 2017]
* Licensed MIT */
(function (window, undefined) {
  'use strict';
  /* istanbul ignore next */
  //http://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string

  window._arrayBufferToBase64 = function (buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;

    for (var i = 0; i < len; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
  };

  var mod = window.angular.module('naif.base64', []);
  mod.directive('baseSixtyFourInput', ['$window', '$q', function ($window, $q) {
    var isolateScope = {
      onChange: '&',
      onAfterValidate: '&',
      parser: '&'
    };
    var FILE_READER_EVENTS = ['onabort', 'onerror', 'onloadstart', 'onloadend', 'onprogress', 'onload'];
    FILE_READER_EVENTS.forEach(function (e) {
      isolateScope[e] = '&';
    });
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: isolateScope,
      link: function link(scope, elem, attrs, ngModel) {
        var rawFiles = [];
        var fileObjects = [];
        /* istanbul ignore if */

        if (!ngModel) {
          return;
        } // VALIDATIONS =========================================================


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
        } //end validations ===============


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
          fReader[eventName] = function (e) {
            handler()(e, fReader, file, rawFiles, fileObjects, fileObject);
          };
        }

        function _readerOnLoad(fReader, file, fileObject) {
          return function (e) {
            var buffer = e.target.result;
            var promise; // do not convert the image to base64 if it exceeds the maximum
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

            promise.then(function (fileObj) {
              fileObjects.push(fileObj); // fulfill the promise here.

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

            if (attrs[e] && e !== 'onload') {
              // don't attach handler to onload yet
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
            promises.push(rawFiles[i].deferredObj.promise); // TODO: Make sure all promises are resolved even during file reader error, otherwise view value wont be updated
          } // set view value once all files are read


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

            $q.all(promises).then(function () {
              if (scope.onAfterValidate && typeof scope.onAfterValidate() === "function") {
                scope.onAfterValidate()(e, fileObjects, rawFiles);
              } else {
                scope.onAfterValidate(e, fileObjects, rawFiles);
              }
            });
          }
        }

        ngModel.$isEmpty = function (val) {
          return !val || (angular.isArray(val) ? val.length === 0 : !val.base64);
        }; // http://stackoverflow.com/questions/1703228/how-can-i-clear-an-html-file-input-with-javascript


        scope._clearInput = function () {
          elem[0].value = '';
        };

        scope.$watch(function () {
          return ngModel.$viewValue;
        }, function (val) {
          if (ngModel.$isEmpty(val) && ngModel.$dirty) {
            scope._clearInput(); // Remove validation errors


            ngModel.$setValidity('maxnum', true);
            ngModel.$setValidity('minnum', true);
            ngModel.$setValidity('maxsize', true);
            ngModel.$setValidity('minsize', true);
            ngModel.$setValidity('accept', true);
          }
        });
        elem.on('change', function (e) {
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
  }]);
})(window);