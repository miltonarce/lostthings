angular
.module('lostThings.services')
.factory('Users', 
    ["$http", 
    "API_SERVER",
    "Authentication",
    function($http, API_SERVER, Authentication){


        /**
         * Permite obtener el id del usuario que inicio sesión
         * @returns number
         */
        function getIdUserLogged() {
            return Authentication.getUserData().idusuario;
        }
      
        /**
         * Permite buscar personas por el nickname o el nombre
         * @param {string} name 
         * @returns Promise
         */
        function search(name) {
            return Promise.resolve([{
                id: 33,
                usuario: 'Facundo',
                lastname: 'Perez',
                email: 'facundo@gmail.com',
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Nine_Inch_Nails_logo.svg/220px-Nine_Inch_Nails_logo.svg.png'
            },
            {
                id: 2,
                usuario: 'aa',
                lastname: 'aa',
                email: 'aa@gmail.com',
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Nine_Inch_Nails_logo.svg/220px-Nine_Inch_Nails_logo.svg.png'
            },
            ])
        }

        /**
         * Permite obtener los amigos que posee el usuario logueado por el id del mismo
         * @returns Promise
         */
        function getFriendsByUser() {
            let idUser = getIdUserLogged();
            return Promise.resolve([{
                id: 33,
                usuario: 'Pepe',
                lastname: 'Perez',
                email: 'fafa@gmail.com',
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Nine_Inch_Nails_logo.svg/220px-Nine_Inch_Nails_logo.svg.png',
                fecha_creacion: '22-03-2017'
            },
            {
                id: 44,
                usuario: 'Pepe',
                lastname: 'Perez',
                email: 'fafa@gmail.com',
                img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Nine_Inch_Nails_logo.svg/220px-Nine_Inch_Nails_logo.svg.png',
                fecha_creacion: '22-03-2017'
            }])
        }

        /**
         * Permite agregar un amigo al listado de amigos que posee el usuario
         * @param {number} userIdFriend
         */
        function addFriend(userIdFriend) {
            let idUser = getIdUserLogged();
            return Promise.resolve({
                status: 1,
                msg: 'Se envio la solicitud'
            });
        }

        /**
         * Permite eliminar un amigo de la lista de amigos del usuario
         */
        function deleteFriend(userIdFriend) {
            let idUser = getIdUserLogged();
            return Promise.resolve({
                status: 1,
                msg: 'Se elimino el amigo...'
            });
        }

        /**
         * Permite obtener el perfil completo de un usuario por el id del mismo
         * @param {number} userId
         * @returns Promise
         */
        function getProfileUser(userId) {
            return Promise.resolve({
                idusuario: 1,
                usuario: 'Belu',
                nombre: 'Belen',
                apellido: 'Perez',
                email: 'belen3@gmail.com',
                img: 'https://randomuser.me/api/portraits/women/96.jpg'
            });
        }

        return {
            search: search,
            getFriendsByUser: getFriendsByUser,
            addFriend: addFriend,
            deleteFriend: deleteFriend,
            getProfileUser: getProfileUser
        }

    }
]);