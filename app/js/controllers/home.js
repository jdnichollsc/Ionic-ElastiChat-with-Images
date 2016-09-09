(function () {
	'use strict';

	angular
		.module('App')
		.controller('HomeController', HomeController);

	HomeController.$inject = ['$scope', '$rootScope', '$state',
  '$stateParams', 'MockService',
  '$ionicPopup', '$ionicScrollDelegate', '$timeout', '$interval',
  '$ionicActionSheet', '$filter', '$ionicModal'];
	function HomeController($scope, $rootScope, $state, $stateParams, MockService,
    $ionicPopup, $ionicScrollDelegate, $timeout, $interval, $ionicActionSheet, $filter, $ionicModal) {

		// mock acquiring data via $stateParams
		$scope.toUser = {
			_id: '534b8e5aaa5e7afc1b23e69b',
			pic: 'http://www.nicholls.co/images/nicholls.jpg',
			username: 'Nicholls'
		}

		// this could be on $rootScope rather than in $stateParams
		$scope.user = {
			_id: '534b8fb2aa5e7afc1b23e69c',
			pic: 'http://ionicframework.com/img/docs/mcfly.jpg',
			username: 'Marty'
		};

		$scope.input = {
			message: localStorage['userMessage-' + $scope.toUser._id] || ''
		};

		var messageCheckTimer;

		var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
		var footerBar; // gets set in $ionicView.enter
		var scroller;
		var txtInput; // ^^^

		$scope.$on('$ionicView.enter', function () {
			getMessages();

			$timeout(function () {
				footerBar = document.body.querySelector('.homeView .bar-footer');
				scroller = document.body.querySelector('.homeView .scroll-content');
				txtInput = angular.element(footerBar.querySelector('textarea'));
			}, 0);

			messageCheckTimer = $interval(function () {
				// here you could check for new messages if your app doesn't use push notifications or user disabled them
			}, 20000);
		});

		$scope.$on('$ionicView.leave', function () {
			// Make sure that the interval is destroyed
			if (angular.isDefined(messageCheckTimer)) {
				$interval.cancel(messageCheckTimer);
				messageCheckTimer = undefined;
			}
		});

		$scope.$on('$ionicView.beforeLeave', function () {
			if (!$scope.input.message || $scope.input.message === '') {
				localStorage.removeItem('userMessage-' + $scope.toUser._id);
			}
		});

		function getMessages() {
			// the service is mock but you would probably pass the toUser's GUID here
			MockService.getUserMessages({
				toUserId: $scope.toUser._id
			}).then(function (data) {
				$scope.doneLoading = true;
				$scope.messages = data.messages;
			});
		}

		$scope.$watch('input.message', function (newValue, oldValue) {
			console.log('input.message $watch, newValue ' + newValue);
			if (!newValue) newValue = '';
			localStorage['userMessage-' + $scope.toUser._id] = newValue;
		});

		var addMessage = function (message) {
			message._id = new Date().getTime(); // :~)
			message.date = new Date();
			message.username = $scope.user.username;
			message.userId = $scope.user._id;
			message.pic = $scope.user.picture;
			$scope.messages.push(message);
		};
		
		var lastPhoto = 'img/donut.png';

		$scope.sendPhoto = function () {
			$ionicActionSheet.show({
				buttons: [
					{ text: 'Take Photo' },
					{ text: 'Photo from Library' }
				],
				titleText: 'Upload image',
				cancelText: 'Cancel',
				buttonClicked: function (index) {
					
					var message = {
						toId: $scope.toUser._id,
						photo: lastPhoto
					};
					lastPhoto = lastPhoto === 'img/donut.png' ? 'img/woho.png' : 'img/donut.png';
					addMessage(message);

					$timeout(function () {
						var message = MockService.getMockMessage();
						message.date = new Date();
						$scope.messages.push(message);
					}, 2000);
					return true;
				}
			});
		};

		$scope.sendMessage = function (sendMessageForm) {
			var message = {
				toId: $scope.toUser._id,
				text: $scope.input.message
			};

			// if you do a web service call this will be needed as well as before the viewScroll calls
			// you can't see the effect of this in the browser it needs to be used on a real device
			// for some reason the one time blur event is not firing in the browser but does on devices
			keepKeyboardOpen();

			//MockService.sendMessage(message).then(function(data) {
			$scope.input.message = '';

			addMessage(message);
			$timeout(function () {
				keepKeyboardOpen();
			}, 0);

			$timeout(function () {
				var message = MockService.getMockMessage();
				message.date = new Date();
				$scope.messages.push(message);
				keepKeyboardOpen();
			}, 2000);
			//});
		};

		// this keeps the keyboard open on a device only after sending a message, it is non obtrusive
		function keepKeyboardOpen() {
			console.log('keepKeyboardOpen');
			txtInput.one('blur', function () {
				console.log('textarea blur, focus back on it');
				txtInput[0].focus();
			});
		}
		$scope.refreshScroll = function (scrollBottom, timeout) {
			$timeout(function () {
				scrollBottom = scrollBottom || $scope.scrollDown;
				viewScroll.resize();
				if (scrollBottom) {
					viewScroll.scrollBottom(true);
				}
				$scope.checkScroll();
			}, timeout || 1000);
		};
		$scope.scrollDown = true;
		$scope.checkScroll = function () {
			$timeout(function () {
				var currentTop = viewScroll.getScrollPosition().top;
				var maxScrollableDistanceFromTop = viewScroll.getScrollView().__maxScrollTop;
				$scope.scrollDown = (currentTop >= maxScrollableDistanceFromTop);
				$scope.$apply();
			}, 0);
			return true;
		};

		var openModal = function (templateUrl) {
			return $ionicModal.fromTemplateUrl(templateUrl, {
				scope: $scope,
				animation: 'slide-in-up',
				backdropClickToClose: false
			}).then(function (modal) {
				modal.show();
				$scope.modal = modal;
			});
		};

		$scope.photoBrowser = function (message) {
			var messages = $filter('orderBy')($filter('filter')($scope.messages, { photo: '' }), 'date');
			$scope.activeSlide = messages.indexOf(message);
			$scope.allImages = messages.map(function (message) {
				return message.photo;
			});

			openModal('templates/modals/fullscreenImages.html');
		};

		$scope.closeModal = function () {
			$scope.modal.remove();
		};

		$scope.onMessageHold = function (e, itemIndex, message) {
			console.log('onMessageHold');
			console.log('message: ' + JSON.stringify(message, null, 2));
			$ionicActionSheet.show({
				buttons: [{
					text: 'Copy Text'
				}, {
						text: 'Delete Message'
					}],
				buttonClicked: function (index) {
					switch (index) {
						case 0: // Copy Text
							//cordova.plugins.clipboard.copy(message.text);

							break;
						case 1: // Delete
							// no server side secrets here :~)
							$scope.messages.splice(itemIndex, 1);
							$timeout(function () {
								viewScroll.resize();
							}, 0);

							break;
					}

					return true;
				}
			});
		};

		// this prob seems weird here but I have reasons for this in my app, secret!
		$scope.viewProfile = function (msg) {
			if (msg.userId === $scope.user._id) {
				// go to your profile
			} else {
				// go to other users profile
			}
		};

		$scope.$on('elastic:resize', function (event, element, oldHeight, newHeight) {
			if (!footerBar) return;

			var newFooterHeight = newHeight + 10;
			newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

			footerBar.style.height = newFooterHeight + 'px';
			scroller.style.bottom = newFooterHeight + 'px';
		});

	}
})();