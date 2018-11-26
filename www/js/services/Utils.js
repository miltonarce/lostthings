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