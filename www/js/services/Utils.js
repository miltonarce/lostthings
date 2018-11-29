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