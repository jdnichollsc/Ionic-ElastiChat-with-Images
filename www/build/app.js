// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'App' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('App', ['ionic', 'ngCordova', 'ngAnimate', 'monospaced.elastic', 'angularMoment'])

.run(['$ionicPlatform',
      function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}])
.config(['$stateProvider',
         '$urlRouterProvider',
         '$ionicConfigProvider',
         '$compileProvider',
         function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {

    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content|ms-appx|x-wmapp0):|data:image\/|img\//);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|ghttps?|ms-appx|x-wmapp0):/);
    
    $ionicConfigProvider.scrolling.jsScrolling(ionic.Platform.isIOS());
    
    $stateProvider
        .state('home', {
            url: "/home",
            cache: false,
            templateUrl: "templates/home.html",
            controller: 'HomeController'
        });
        
    $urlRouterProvider.otherwise(function ($injector, $location) {
        var $state = $injector.get("$state");
        $state.go("home");
    });
}]);

/* global ionic */
(function (angular, ionic) {
	"use strict";

	ionic.Platform.isIE = function () {
		return ionic.Platform.ua.toLowerCase().indexOf('trident') > -1;
	}

	if (ionic.Platform.isIE()) {
		angular.module('ionic')
			.factory('$ionicNgClick', ['$parse', '$timeout', function ($parse, $timeout) {
				return function (scope, element, clickExpr) {
					var clickHandler = angular.isFunction(clickExpr) ? clickExpr : $parse(clickExpr);

					element.on('click', function (event) {
						scope.$apply(function () {
							if (scope.clicktimer) return; // Second call
							clickHandler(scope, { $event: (event) });
							scope.clicktimer = $timeout(function () { delete scope.clicktimer; }, 1, false);
						});
					});

					// Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
					// something else nearby.
					element.onclick = function (event) { };
				};
			}]);
	}

	function SelectDirective() {
		'use strict';

		return {
			restrict: 'E',
			replace: false,
			link: function (scope, element) {
				if (ionic.Platform && (ionic.Platform.isWindowsPhone() || ionic.Platform.isIE() || ionic.Platform.platform() === "edge")) {
					element.attr('data-tap-disabled', 'true');
				}
			}
		};
	}

	angular.module('ionic')
    .directive('select', SelectDirective);

	/*angular.module('ionic-datepicker')
	.directive('select', SelectDirective);*/

})(angular, ionic);
(function (Autolinker) {
    'use strict';

    angular
        .module('App')
        .directive('autolinker', autolinker);

    autolinker.$inject = ['$timeout'];
    function autolinker($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $timeout(function () {
                    var eleHtml = element.html();

                    if (eleHtml === '') {
                        return false;
                    }

                    var text = Autolinker.link(eleHtml, {
                        className: 'autolinker',
                        newWindow: false
                    });

                    element.html(text);

                    var autolinks = element[0].getElementsByClassName('autolinker');

                    for (var i = 0; i < autolinks.length; i++) {
                        angular.element(autolinks[i]).bind('click', function (e) {
                            var href = e.target.href;
                            if (href) {
                                //window.open(href, '_system');
                                window.open(href, '_blank');
                            }
                            e.preventDefault();
                            return false;
                        });
                    }
                }, 0);
            }
        }
    }
})(Autolinker);
(function () {
    'use strict';

    angular
        .module('App')
        .directive('img', img);

    img.$inject = ['$parse'];
    function img($parse) {
        function endsWith(url, path) {
            var index = url.length - path.length;
            return url.indexOf(path, index) !== -1;
        }

        return {
            restrict: 'E',
            link: function (scope, element, attributes) {

                element.on('error', function (ev) {
                    var src = this.src;
                    var fn = attributes.ngError && $parse(attributes.ngError);
                    // If theres an ng-error callback then call it
                    if (fn) {
                        scope.$apply(function () {
                            fn(scope, { $event: ev, $src: src });
                        });
                    }

                    // If theres an ng-error-src then set it
                    if (attributes.ngErrorSrc && !endsWith(src, attributes.ngErrorSrc)) {
                        element.attr('src', attributes.ngErrorSrc);
                    }
                });

                element.on('load', function (ev) {
                    var fn = attributes.ngSuccess && $parse(attributes.ngSuccess);
                    if (fn) {
                        scope.$apply(function () {
                            fn(scope, { $event: ev });
                        });
                    }
                });
            }
        }
    }
})();
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
(function () {
    'use strict';

    angular
        .module('App')
        .factory('MockService', MockService);

    MockService.$inject = ['$http', '$q'];
    function MockService($http, $q) {
        var me = {};

        me.getUserMessages = function (d) {
            /*
            var endpoint =
              'http://www.mocky.io/v2/547cf341501c337f0c9a63fd?callback=JSON_CALLBACK';
            return $http.jsonp(endpoint).then(function(response) {
              return response.data;
            }, function(err) {
              console.log('get user messages error, err: ' + JSON.stringify(
                err, null, 2));
            });
            */
            var deferred = $q.defer();

            setTimeout(function () {
                deferred.resolve(getMockMessages());
            }, 1500);

            return deferred.promise;
        };

        me.getMockMessage = function () {
            return {
                userId: '534b8e5aaa5e7afc1b23e69b',
                date: new Date(),
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
            };
        }

        return me;
    }

    function getMockMessages() {
        return {
            "messages": [
                { "_id": "535d625f898df4e80e2a125e", "text": "Ionic has changed the game for hybrid app development.", "userId": "534b8fb2aa5e7afc1b23e69c", "date": "2014-04-27T20:02:39.082Z", "read": true, "readDate": "2014-12-01T06:27:37.944Z" }, { "_id": "535f13ffee3b2a68112b9fc0", "text": "I like Ionic better than ice cream!", "userId": "534b8e5aaa5e7afc1b23e69b", "date": "2014-04-29T02:52:47.706Z", "read": true, "readDate": "2014-12-01T06:27:37.944Z" }, { "_id": "546a5843fd4c5d581efa263a", "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "userId": "534b8fb2aa5e7afc1b23e69c", "date": "2014-11-17T20:19:15.289Z", "read": true, "readDate": "2014-12-01T06:27:38.328Z" }, { "_id": "54764399ab43d1d4113abfd1", "text": "Am I dreaming?", "userId": "534b8e5aaa5e7afc1b23e69b", "date": "2014-11-26T21:18:17.591Z", "read": true, "readDate": "2014-12-01T06:27:38.337Z" }, { "_id": "547643aeab43d1d4113abfd2", "text": "Is this magic?", "userId": "534b8fb2aa5e7afc1b23e69c", "date": "2014-11-26T21:18:38.549Z", "read": true, "readDate": "2014-12-01T06:27:38.338Z" }, { "_id": "547815dbab43d1d4113abfef", "text": "Gee wiz, this is something special.", "userId": "534b8e5aaa5e7afc1b23e69b", "date": "2014-11-28T06:27:40.001Z", "read": true, "readDate": "2014-12-01T06:27:38.338Z" }, { "_id": "54781c69ab43d1d4113abff0", "text": "I think I like Ionic more than I like ice cream!", "userId": "534b8fb2aa5e7afc1b23e69c", "date": "2014-11-28T06:55:37.350Z", "read": true, "readDate": "2014-12-01T06:27:38.338Z" }, { "_id": "54781ca4ab43d1d4113abff1", "text": "Yea, it's pretty sweet", "userId": "534b8e5aaa5e7afc1b23e69b", "date": "2014-11-28T06:56:36.472Z", "read": true, "readDate": "2014-12-01T06:27:38.338Z" }, { "_id": "5478df86ab43d1d4113abff4", "text": "Wow, this is really something huh?", "userId": "534b8fb2aa5e7afc1b23e69c", "date": "2014-11-28T20:48:06.572Z", "read": true, "readDate": "2014-12-01T06:27:38.339Z" }, { "_id": "54781ca4ab43d1d4113abff1", "text": "Create amazing apps - ionicframework.com", "userId": "534b8e5aaa5e7afc1b23e69b", "date": "2014-11-29T06:56:36.472Z", "read": true, "readDate": "2014-12-01T06:27:38.338Z" },
                { "_id": "535d625f898df4e80e2a126e", "photo": "http://ionicframework.com/img/homepage/phones-viewapp_2x.png", "userId": "546a5843fd4c5d581efa263a", "date": "2015-08-25T20:02:39.082Z", "read": true, "readDate": "2014-13-02T06:27:37.944Z" }], "unread": 0
        };
    }
})();
(function () {
	'use strict';

	angular
		.module('App')
		.factory('Modals', Modals);

	Modals.$inject = ['$ionicModal'];
	function Modals($ionicModal) {

		var modals = [];

		var _openModal = function ($scope, templateUrl, animation) {
			return $ionicModal.fromTemplateUrl(templateUrl, {
				scope: $scope,
				animation: animation || 'slide-in-up',
				backdropClickToClose: false
			}).then(function (modal) {
				modals.push(modal);
				modal.show();
			});
		};

		var _closeModal = function () {
			var currentModal = modals.splice(-1, 1)[0];
			currentModal.remove();
		};

		var _closeAllModals = function () {
			modals.map(function (modal) {
				modal.remove();
			});
			modals = [];
		};

		return {
			openModal: _openModal,
			closeModal: _closeModal,
			closeAllModals: _closeAllModals
		};
	}
})();
(function () {
	'use strict';

	angular
		.module('App')
		.factory('Model', Model);

	//Model.$inject = ['Users'];
	function Model() {

		return {
			
		};
	}
})();
(function () {
    'use strict';

    angular
        .module('App')
        .filter('nl2br', nl2br);

    //nl2br.$inject = [];
    function nl2br() {

        return function(data) {
            if (!data) return data;
            return data.replace(/\n\r?/g, '<br />');
        };
    }
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImlzc3Vlcy5qcyIsImRpcmVjdGl2ZXMvYXV0b2xpbmtlci5qcyIsImRpcmVjdGl2ZXMvaW1nLmpzIiwiY29udHJvbGxlcnMvaG9tZS5qcyIsInNlcnZpY2VzL21vY2tTZXJ2aWNlLmpzIiwic2VydmljZXMvbW9kYWxzLmpzIiwic2VydmljZXMvbW9kZWwuanMiLCJmaWx0ZXJzL25sMmJyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW9uaWMgU3RhcnRlciBBcHBcclxuXHJcbi8vIGFuZ3VsYXIubW9kdWxlIGlzIGEgZ2xvYmFsIHBsYWNlIGZvciBjcmVhdGluZywgcmVnaXN0ZXJpbmcgYW5kIHJldHJpZXZpbmcgQW5ndWxhciBtb2R1bGVzXHJcbi8vICdBcHAnIGlzIHRoZSBuYW1lIG9mIHRoaXMgYW5ndWxhciBtb2R1bGUgZXhhbXBsZSAoYWxzbyBzZXQgaW4gYSA8Ym9keT4gYXR0cmlidXRlIGluIGluZGV4Lmh0bWwpXHJcbi8vIHRoZSAybmQgcGFyYW1ldGVyIGlzIGFuIGFycmF5IG9mICdyZXF1aXJlcydcclxuYW5ndWxhci5tb2R1bGUoJ0FwcCcsIFsnaW9uaWMnLCAnbmdDb3Jkb3ZhJywgJ25nQW5pbWF0ZScsICdtb25vc3BhY2VkLmVsYXN0aWMnLCAnYW5ndWxhck1vbWVudCddKVxyXG5cclxuLnJ1bihbJyRpb25pY1BsYXRmb3JtJyxcclxuICAgICAgZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0pIHtcclxuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgIGlmKHdpbmRvdy5jb3Jkb3ZhICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQpIHtcclxuICAgICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxyXG4gICAgICAvLyBmb3IgZm9ybSBpbnB1dHMpXHJcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5oaWRlS2V5Ym9hcmRBY2Nlc3NvcnlCYXIodHJ1ZSk7XHJcblxyXG4gICAgICAvLyBEb24ndCByZW1vdmUgdGhpcyBsaW5lIHVubGVzcyB5b3Uga25vdyB3aGF0IHlvdSBhcmUgZG9pbmcuIEl0IHN0b3BzIHRoZSB2aWV3cG9ydFxyXG4gICAgICAvLyBmcm9tIHNuYXBwaW5nIHdoZW4gdGV4dCBpbnB1dHMgYXJlIGZvY3VzZWQuIElvbmljIGhhbmRsZXMgdGhpcyBpbnRlcm5hbGx5IGZvclxyXG4gICAgICAvLyBhIG11Y2ggbmljZXIga2V5Ym9hcmQgZXhwZXJpZW5jZS5cclxuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmRpc2FibGVTY3JvbGwodHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBpZih3aW5kb3cuU3RhdHVzQmFyKSB7XHJcbiAgICAgIFN0YXR1c0Jhci5zdHlsZURlZmF1bHQoKTtcclxuICAgIH1cclxuICB9KTtcclxufV0pXHJcbi5jb25maWcoWyckc3RhdGVQcm92aWRlcicsXHJcbiAgICAgICAgICckdXJsUm91dGVyUHJvdmlkZXInLFxyXG4gICAgICAgICAnJGlvbmljQ29uZmlnUHJvdmlkZXInLFxyXG4gICAgICAgICAnJGNvbXBpbGVQcm92aWRlcicsXHJcbiAgICAgICAgIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkaW9uaWNDb25maWdQcm92aWRlciwgJGNvbXBpbGVQcm92aWRlcikge1xyXG5cclxuICAgICRjb21waWxlUHJvdmlkZXIuaW1nU3JjU2FuaXRpemF0aW9uV2hpdGVsaXN0KC9eXFxzKihodHRwcz98ZnRwfGZpbGV8YmxvYnxjb250ZW50fG1zLWFwcHh8eC13bWFwcDApOnxkYXRhOmltYWdlXFwvfGltZ1xcLy8pO1xyXG4gICAgJGNvbXBpbGVQcm92aWRlci5hSHJlZlNhbml0aXphdGlvbldoaXRlbGlzdCgvXlxccyooaHR0cHM/fGZ0cHxtYWlsdG98ZmlsZXxnaHR0cHM/fG1zLWFwcHh8eC13bWFwcDApOi8pO1xyXG4gICAgXHJcbiAgICAkaW9uaWNDb25maWdQcm92aWRlci5zY3JvbGxpbmcuanNTY3JvbGxpbmcoaW9uaWMuUGxhdGZvcm0uaXNJT1MoKSk7XHJcbiAgICBcclxuICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCdob21lJywge1xyXG4gICAgICAgICAgICB1cmw6IFwiL2hvbWVcIixcclxuICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0ZW1wbGF0ZXMvaG9tZS5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcidcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoZnVuY3Rpb24gKCRpbmplY3RvciwgJGxvY2F0aW9uKSB7XHJcbiAgICAgICAgdmFyICRzdGF0ZSA9ICRpbmplY3Rvci5nZXQoXCIkc3RhdGVcIik7XHJcbiAgICAgICAgJHN0YXRlLmdvKFwiaG9tZVwiKTtcclxuICAgIH0pO1xyXG59XSk7XHJcbiIsIi8qIGdsb2JhbCBpb25pYyAqL1xyXG4oZnVuY3Rpb24gKGFuZ3VsYXIsIGlvbmljKSB7XHJcblx0XCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5cdGlvbmljLlBsYXRmb3JtLmlzSUUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gaW9uaWMuUGxhdGZvcm0udWEudG9Mb3dlckNhc2UoKS5pbmRleE9mKCd0cmlkZW50JykgPiAtMTtcclxuXHR9XHJcblxyXG5cdGlmIChpb25pYy5QbGF0Zm9ybS5pc0lFKCkpIHtcclxuXHRcdGFuZ3VsYXIubW9kdWxlKCdpb25pYycpXHJcblx0XHRcdC5mYWN0b3J5KCckaW9uaWNOZ0NsaWNrJywgWyckcGFyc2UnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbiAoJHBhcnNlLCAkdGltZW91dCkge1xyXG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGNsaWNrRXhwcikge1xyXG5cdFx0XHRcdFx0dmFyIGNsaWNrSGFuZGxlciA9IGFuZ3VsYXIuaXNGdW5jdGlvbihjbGlja0V4cHIpID8gY2xpY2tFeHByIDogJHBhcnNlKGNsaWNrRXhwcik7XHJcblxyXG5cdFx0XHRcdFx0ZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRcdFx0c2NvcGUuJGFwcGx5KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoc2NvcGUuY2xpY2t0aW1lcikgcmV0dXJuOyAvLyBTZWNvbmQgY2FsbFxyXG5cdFx0XHRcdFx0XHRcdGNsaWNrSGFuZGxlcihzY29wZSwgeyAkZXZlbnQ6IChldmVudCkgfSk7XHJcblx0XHRcdFx0XHRcdFx0c2NvcGUuY2xpY2t0aW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHsgZGVsZXRlIHNjb3BlLmNsaWNrdGltZXI7IH0sIDEsIGZhbHNlKTtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHQvLyBIYWNrIGZvciBpT1MgU2FmYXJpJ3MgYmVuZWZpdC4gSXQgZ29lcyBzZWFyY2hpbmcgZm9yIG9uY2xpY2sgaGFuZGxlcnMgYW5kIGlzIGxpYWJsZSB0byBjbGlja1xyXG5cdFx0XHRcdFx0Ly8gc29tZXRoaW5nIGVsc2UgbmVhcmJ5LlxyXG5cdFx0XHRcdFx0ZWxlbWVudC5vbmNsaWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7IH07XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fV0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gU2VsZWN0RGlyZWN0aXZlKCkge1xyXG5cdFx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHJlc3RyaWN0OiAnRScsXHJcblx0XHRcdHJlcGxhY2U6IGZhbHNlLFxyXG5cdFx0XHRsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQpIHtcclxuXHRcdFx0XHRpZiAoaW9uaWMuUGxhdGZvcm0gJiYgKGlvbmljLlBsYXRmb3JtLmlzV2luZG93c1Bob25lKCkgfHwgaW9uaWMuUGxhdGZvcm0uaXNJRSgpIHx8IGlvbmljLlBsYXRmb3JtLnBsYXRmb3JtKCkgPT09IFwiZWRnZVwiKSkge1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5hdHRyKCdkYXRhLXRhcC1kaXNhYmxlZCcsICd0cnVlJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0YW5ndWxhci5tb2R1bGUoJ2lvbmljJylcclxuICAgIC5kaXJlY3RpdmUoJ3NlbGVjdCcsIFNlbGVjdERpcmVjdGl2ZSk7XHJcblxyXG5cdC8qYW5ndWxhci5tb2R1bGUoJ2lvbmljLWRhdGVwaWNrZXInKVxyXG5cdC5kaXJlY3RpdmUoJ3NlbGVjdCcsIFNlbGVjdERpcmVjdGl2ZSk7Ki9cclxuXHJcbn0pKGFuZ3VsYXIsIGlvbmljKTsiLCIoZnVuY3Rpb24gKEF1dG9saW5rZXIpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdhdXRvbGlua2VyJywgYXV0b2xpbmtlcik7XHJcblxyXG4gICAgYXV0b2xpbmtlci4kaW5qZWN0ID0gWyckdGltZW91dCddO1xyXG4gICAgZnVuY3Rpb24gYXV0b2xpbmtlcigkdGltZW91dCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlSHRtbCA9IGVsZW1lbnQuaHRtbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlSHRtbCA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRleHQgPSBBdXRvbGlua2VyLmxpbmsoZWxlSHRtbCwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdhdXRvbGlua2VyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3V2luZG93OiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lmh0bWwodGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhdXRvbGlua3MgPSBlbGVtZW50WzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2F1dG9saW5rZXInKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdXRvbGlua3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KGF1dG9saW5rc1tpXSkuYmluZCgnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhyZWYgPSBlLnRhcmdldC5ocmVmO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhyZWYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL3dpbmRvdy5vcGVuKGhyZWYsICdfc3lzdGVtJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9wZW4oaHJlZiwgJ19ibGFuaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoQXV0b2xpbmtlcik7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnQXBwJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdpbWcnLCBpbWcpO1xyXG5cclxuICAgIGltZy4kaW5qZWN0ID0gWyckcGFyc2UnXTtcclxuICAgIGZ1bmN0aW9uIGltZygkcGFyc2UpIHtcclxuICAgICAgICBmdW5jdGlvbiBlbmRzV2l0aCh1cmwsIHBhdGgpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdXJsLmxlbmd0aCAtIHBhdGgubGVuZ3RoO1xyXG4gICAgICAgICAgICByZXR1cm4gdXJsLmluZGV4T2YocGF0aCwgaW5kZXgpICE9PSAtMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xyXG5cclxuICAgICAgICAgICAgICAgIGVsZW1lbnQub24oJ2Vycm9yJywgZnVuY3Rpb24gKGV2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNyYyA9IHRoaXMuc3JjO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IGF0dHJpYnV0ZXMubmdFcnJvciAmJiAkcGFyc2UoYXR0cmlidXRlcy5uZ0Vycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZXMgYW4gbmctZXJyb3IgY2FsbGJhY2sgdGhlbiBjYWxsIGl0XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbihzY29wZSwgeyAkZXZlbnQ6IGV2LCAkc3JjOiBzcmMgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmVzIGFuIG5nLWVycm9yLXNyYyB0aGVuIHNldCBpdFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzLm5nRXJyb3JTcmMgJiYgIWVuZHNXaXRoKHNyYywgYXR0cmlidXRlcy5uZ0Vycm9yU3JjKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmF0dHIoJ3NyYycsIGF0dHJpYnV0ZXMubmdFcnJvclNyYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5vbignbG9hZCcsIGZ1bmN0aW9uIChldikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IGF0dHJpYnV0ZXMubmdTdWNjZXNzICYmICRwYXJzZShhdHRyaWJ1dGVzLm5nU3VjY2Vzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbihzY29wZSwgeyAkZXZlbnQ6IGV2IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnQXBwJylcclxuXHRcdC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIEhvbWVDb250cm9sbGVyKTtcclxuXHJcblx0SG9tZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHN0YXRlJyxcclxuICAnJHN0YXRlUGFyYW1zJywgJ01vY2tTZXJ2aWNlJyxcclxuICAnJGlvbmljUG9wdXAnLCAnJGlvbmljU2Nyb2xsRGVsZWdhdGUnLCAnJHRpbWVvdXQnLCAnJGludGVydmFsJyxcclxuICAnJGlvbmljQWN0aW9uU2hlZXQnLCAnJGZpbHRlcicsICckaW9uaWNNb2RhbCddO1xyXG5cdGZ1bmN0aW9uIEhvbWVDb250cm9sbGVyKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIE1vY2tTZXJ2aWNlLFxyXG4gICAgJGlvbmljUG9wdXAsICRpb25pY1Njcm9sbERlbGVnYXRlLCAkdGltZW91dCwgJGludGVydmFsLCAkaW9uaWNBY3Rpb25TaGVldCwgJGZpbHRlciwgJGlvbmljTW9kYWwpIHtcclxuXHJcblx0XHQvLyBtb2NrIGFjcXVpcmluZyBkYXRhIHZpYSAkc3RhdGVQYXJhbXNcclxuXHRcdCRzY29wZS50b1VzZXIgPSB7XHJcblx0XHRcdF9pZDogJzUzNGI4ZTVhYWE1ZTdhZmMxYjIzZTY5YicsXHJcblx0XHRcdHBpYzogJ2h0dHA6Ly93d3cubmljaG9sbHMuY28vaW1hZ2VzL25pY2hvbGxzLmpwZycsXHJcblx0XHRcdHVzZXJuYW1lOiAnTmljaG9sbHMnXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdGhpcyBjb3VsZCBiZSBvbiAkcm9vdFNjb3BlIHJhdGhlciB0aGFuIGluICRzdGF0ZVBhcmFtc1xyXG5cdFx0JHNjb3BlLnVzZXIgPSB7XHJcblx0XHRcdF9pZDogJzUzNGI4ZmIyYWE1ZTdhZmMxYjIzZTY5YycsXHJcblx0XHRcdHBpYzogJ2h0dHA6Ly9pb25pY2ZyYW1ld29yay5jb20vaW1nL2RvY3MvbWNmbHkuanBnJyxcclxuXHRcdFx0dXNlcm5hbWU6ICdNYXJ0eSdcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLmlucHV0ID0ge1xyXG5cdFx0XHRtZXNzYWdlOiBsb2NhbFN0b3JhZ2VbJ3VzZXJNZXNzYWdlLScgKyAkc2NvcGUudG9Vc2VyLl9pZF0gfHwgJydcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIG1lc3NhZ2VDaGVja1RpbWVyO1xyXG5cclxuXHRcdHZhciB2aWV3U2Nyb2xsID0gJGlvbmljU2Nyb2xsRGVsZWdhdGUuJGdldEJ5SGFuZGxlKCd1c2VyTWVzc2FnZVNjcm9sbCcpO1xyXG5cdFx0dmFyIGZvb3RlckJhcjsgLy8gZ2V0cyBzZXQgaW4gJGlvbmljVmlldy5lbnRlclxyXG5cdFx0dmFyIHNjcm9sbGVyO1xyXG5cdFx0dmFyIHR4dElucHV0OyAvLyBeXl5cclxuXHJcblx0XHQkc2NvcGUuJG9uKCckaW9uaWNWaWV3LmVudGVyJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRnZXRNZXNzYWdlcygpO1xyXG5cclxuXHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGZvb3RlckJhciA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignLmhvbWVWaWV3IC5iYXItZm9vdGVyJyk7XHJcblx0XHRcdFx0c2Nyb2xsZXIgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJy5ob21lVmlldyAuc2Nyb2xsLWNvbnRlbnQnKTtcclxuXHRcdFx0XHR0eHRJbnB1dCA9IGFuZ3VsYXIuZWxlbWVudChmb290ZXJCYXIucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKSk7XHJcblx0XHRcdH0sIDApO1xyXG5cclxuXHRcdFx0bWVzc2FnZUNoZWNrVGltZXIgPSAkaW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdC8vIGhlcmUgeW91IGNvdWxkIGNoZWNrIGZvciBuZXcgbWVzc2FnZXMgaWYgeW91ciBhcHAgZG9lc24ndCB1c2UgcHVzaCBub3RpZmljYXRpb25zIG9yIHVzZXIgZGlzYWJsZWQgdGhlbVxyXG5cdFx0XHR9LCAyMDAwMCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkc2NvcGUuJG9uKCckaW9uaWNWaWV3LmxlYXZlJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQvLyBNYWtlIHN1cmUgdGhhdCB0aGUgaW50ZXJ2YWwgaXMgZGVzdHJveWVkXHJcblx0XHRcdGlmIChhbmd1bGFyLmlzRGVmaW5lZChtZXNzYWdlQ2hlY2tUaW1lcikpIHtcclxuXHRcdFx0XHQkaW50ZXJ2YWwuY2FuY2VsKG1lc3NhZ2VDaGVja1RpbWVyKTtcclxuXHRcdFx0XHRtZXNzYWdlQ2hlY2tUaW1lciA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0JHNjb3BlLiRvbignJGlvbmljVmlldy5iZWZvcmVMZWF2ZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCEkc2NvcGUuaW5wdXQubWVzc2FnZSB8fCAkc2NvcGUuaW5wdXQubWVzc2FnZSA9PT0gJycpIHtcclxuXHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndXNlck1lc3NhZ2UtJyArICRzY29wZS50b1VzZXIuX2lkKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0TWVzc2FnZXMoKSB7XHJcblx0XHRcdC8vIHRoZSBzZXJ2aWNlIGlzIG1vY2sgYnV0IHlvdSB3b3VsZCBwcm9iYWJseSBwYXNzIHRoZSB0b1VzZXIncyBHVUlEIGhlcmVcclxuXHRcdFx0TW9ja1NlcnZpY2UuZ2V0VXNlck1lc3NhZ2VzKHtcclxuXHRcdFx0XHR0b1VzZXJJZDogJHNjb3BlLnRvVXNlci5faWRcclxuXHRcdFx0fSkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0XHRcdCRzY29wZS5kb25lTG9hZGluZyA9IHRydWU7XHJcblx0XHRcdFx0JHNjb3BlLm1lc3NhZ2VzID0gZGF0YS5tZXNzYWdlcztcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0JHNjb3BlLiR3YXRjaCgnaW5wdXQubWVzc2FnZScsIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ2lucHV0Lm1lc3NhZ2UgJHdhdGNoLCBuZXdWYWx1ZSAnICsgbmV3VmFsdWUpO1xyXG5cdFx0XHRpZiAoIW5ld1ZhbHVlKSBuZXdWYWx1ZSA9ICcnO1xyXG5cdFx0XHRsb2NhbFN0b3JhZ2VbJ3VzZXJNZXNzYWdlLScgKyAkc2NvcGUudG9Vc2VyLl9pZF0gPSBuZXdWYWx1ZTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHZhciBhZGRNZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuXHRcdFx0bWVzc2FnZS5faWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTsgLy8gOn4pXHJcblx0XHRcdG1lc3NhZ2UuZGF0ZSA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdG1lc3NhZ2UudXNlcm5hbWUgPSAkc2NvcGUudXNlci51c2VybmFtZTtcclxuXHRcdFx0bWVzc2FnZS51c2VySWQgPSAkc2NvcGUudXNlci5faWQ7XHJcblx0XHRcdG1lc3NhZ2UucGljID0gJHNjb3BlLnVzZXIucGljdHVyZTtcclxuXHRcdFx0JHNjb3BlLm1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHR2YXIgbGFzdFBob3RvID0gJ2ltZy9kb251dC5wbmcnO1xyXG5cclxuXHRcdCRzY29wZS5zZW5kUGhvdG8gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCRpb25pY0FjdGlvblNoZWV0LnNob3coe1xyXG5cdFx0XHRcdGJ1dHRvbnM6IFtcclxuXHRcdFx0XHRcdHsgdGV4dDogJ1Rha2UgUGhvdG8nIH0sXHJcblx0XHRcdFx0XHR7IHRleHQ6ICdQaG90byBmcm9tIExpYnJhcnknIH1cclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdHRpdGxlVGV4dDogJ1VwbG9hZCBpbWFnZScsXHJcblx0XHRcdFx0Y2FuY2VsVGV4dDogJ0NhbmNlbCcsXHJcblx0XHRcdFx0YnV0dG9uQ2xpY2tlZDogZnVuY3Rpb24gKGluZGV4KSB7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHZhciBtZXNzYWdlID0ge1xyXG5cdFx0XHRcdFx0XHR0b0lkOiAkc2NvcGUudG9Vc2VyLl9pZCxcclxuXHRcdFx0XHRcdFx0cGhvdG86IGxhc3RQaG90b1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdGxhc3RQaG90byA9IGxhc3RQaG90byA9PT0gJ2ltZy9kb251dC5wbmcnID8gJ2ltZy93b2hvLnBuZycgOiAnaW1nL2RvbnV0LnBuZyc7XHJcblx0XHRcdFx0XHRhZGRNZXNzYWdlKG1lc3NhZ2UpO1xyXG5cclxuXHRcdFx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0dmFyIG1lc3NhZ2UgPSBNb2NrU2VydmljZS5nZXRNb2NrTWVzc2FnZSgpO1xyXG5cdFx0XHRcdFx0XHRtZXNzYWdlLmRhdGUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHRcdFx0XHQkc2NvcGUubWVzc2FnZXMucHVzaChtZXNzYWdlKTtcclxuXHRcdFx0XHRcdH0sIDIwMDApO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnNlbmRNZXNzYWdlID0gZnVuY3Rpb24gKHNlbmRNZXNzYWdlRm9ybSkge1xyXG5cdFx0XHR2YXIgbWVzc2FnZSA9IHtcclxuXHRcdFx0XHR0b0lkOiAkc2NvcGUudG9Vc2VyLl9pZCxcclxuXHRcdFx0XHR0ZXh0OiAkc2NvcGUuaW5wdXQubWVzc2FnZVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0Ly8gaWYgeW91IGRvIGEgd2ViIHNlcnZpY2UgY2FsbCB0aGlzIHdpbGwgYmUgbmVlZGVkIGFzIHdlbGwgYXMgYmVmb3JlIHRoZSB2aWV3U2Nyb2xsIGNhbGxzXHJcblx0XHRcdC8vIHlvdSBjYW4ndCBzZWUgdGhlIGVmZmVjdCBvZiB0aGlzIGluIHRoZSBicm93c2VyIGl0IG5lZWRzIHRvIGJlIHVzZWQgb24gYSByZWFsIGRldmljZVxyXG5cdFx0XHQvLyBmb3Igc29tZSByZWFzb24gdGhlIG9uZSB0aW1lIGJsdXIgZXZlbnQgaXMgbm90IGZpcmluZyBpbiB0aGUgYnJvd3NlciBidXQgZG9lcyBvbiBkZXZpY2VzXHJcblx0XHRcdGtlZXBLZXlib2FyZE9wZW4oKTtcclxuXHJcblx0XHRcdC8vTW9ja1NlcnZpY2Uuc2VuZE1lc3NhZ2UobWVzc2FnZSkudGhlbihmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdCRzY29wZS5pbnB1dC5tZXNzYWdlID0gJyc7XHJcblxyXG5cdFx0XHRhZGRNZXNzYWdlKG1lc3NhZ2UpO1xyXG5cdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0a2VlcEtleWJvYXJkT3BlbigpO1xyXG5cdFx0XHR9LCAwKTtcclxuXHJcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgbWVzc2FnZSA9IE1vY2tTZXJ2aWNlLmdldE1vY2tNZXNzYWdlKCk7XHJcblx0XHRcdFx0bWVzc2FnZS5kYXRlID0gbmV3IERhdGUoKTtcclxuXHRcdFx0XHQkc2NvcGUubWVzc2FnZXMucHVzaChtZXNzYWdlKTtcclxuXHRcdFx0XHRrZWVwS2V5Ym9hcmRPcGVuKCk7XHJcblx0XHRcdH0sIDIwMDApO1xyXG5cdFx0XHQvL30pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyB0aGlzIGtlZXBzIHRoZSBrZXlib2FyZCBvcGVuIG9uIGEgZGV2aWNlIG9ubHkgYWZ0ZXIgc2VuZGluZyBhIG1lc3NhZ2UsIGl0IGlzIG5vbiBvYnRydXNpdmVcclxuXHRcdGZ1bmN0aW9uIGtlZXBLZXlib2FyZE9wZW4oKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdrZWVwS2V5Ym9hcmRPcGVuJyk7XHJcblx0XHRcdHR4dElucHV0Lm9uZSgnYmx1cicsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygndGV4dGFyZWEgYmx1ciwgZm9jdXMgYmFjayBvbiBpdCcpO1xyXG5cdFx0XHRcdHR4dElucHV0WzBdLmZvY3VzKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0JHNjb3BlLnJlZnJlc2hTY3JvbGwgPSBmdW5jdGlvbiAoc2Nyb2xsQm90dG9tLCB0aW1lb3V0KSB7XHJcblx0XHRcdCR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRzY3JvbGxCb3R0b20gPSBzY3JvbGxCb3R0b20gfHwgJHNjb3BlLnNjcm9sbERvd247XHJcblx0XHRcdFx0dmlld1Njcm9sbC5yZXNpemUoKTtcclxuXHRcdFx0XHRpZiAoc2Nyb2xsQm90dG9tKSB7XHJcblx0XHRcdFx0XHR2aWV3U2Nyb2xsLnNjcm9sbEJvdHRvbSh0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0JHNjb3BlLmNoZWNrU2Nyb2xsKCk7XHJcblx0XHRcdH0sIHRpbWVvdXQgfHwgMTAwMCk7XHJcblx0XHR9O1xyXG5cdFx0JHNjb3BlLnNjcm9sbERvd24gPSB0cnVlO1xyXG5cdFx0JHNjb3BlLmNoZWNrU2Nyb2xsID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dmFyIGN1cnJlbnRUb3AgPSB2aWV3U2Nyb2xsLmdldFNjcm9sbFBvc2l0aW9uKCkudG9wO1xyXG5cdFx0XHRcdHZhciBtYXhTY3JvbGxhYmxlRGlzdGFuY2VGcm9tVG9wID0gdmlld1Njcm9sbC5nZXRTY3JvbGxWaWV3KCkuX19tYXhTY3JvbGxUb3A7XHJcblx0XHRcdFx0JHNjb3BlLnNjcm9sbERvd24gPSAoY3VycmVudFRvcCA+PSBtYXhTY3JvbGxhYmxlRGlzdGFuY2VGcm9tVG9wKTtcclxuXHRcdFx0XHQkc2NvcGUuJGFwcGx5KCk7XHJcblx0XHRcdH0sIDApO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIG9wZW5Nb2RhbCA9IGZ1bmN0aW9uICh0ZW1wbGF0ZVVybCkge1xyXG5cdFx0XHRyZXR1cm4gJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKHRlbXBsYXRlVXJsLCB7XHJcblx0XHRcdFx0c2NvcGU6ICRzY29wZSxcclxuXHRcdFx0XHRhbmltYXRpb246ICdzbGlkZS1pbi11cCcsXHJcblx0XHRcdFx0YmFja2Ryb3BDbGlja1RvQ2xvc2U6IGZhbHNlXHJcblx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKG1vZGFsKSB7XHJcblx0XHRcdFx0bW9kYWwuc2hvdygpO1xyXG5cdFx0XHRcdCRzY29wZS5tb2RhbCA9IG1vZGFsO1xyXG5cdFx0XHR9KTtcclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLnBob3RvQnJvd3NlciA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcblx0XHRcdHZhciBtZXNzYWdlcyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkZmlsdGVyKCdmaWx0ZXInKSgkc2NvcGUubWVzc2FnZXMsIHsgcGhvdG86ICcnIH0pLCAnZGF0ZScpO1xyXG5cdFx0XHQkc2NvcGUuYWN0aXZlU2xpZGUgPSBtZXNzYWdlcy5pbmRleE9mKG1lc3NhZ2UpO1xyXG5cdFx0XHQkc2NvcGUuYWxsSW1hZ2VzID0gbWVzc2FnZXMubWFwKGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcblx0XHRcdFx0cmV0dXJuIG1lc3NhZ2UucGhvdG87XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0b3Blbk1vZGFsKCd0ZW1wbGF0ZXMvbW9kYWxzL2Z1bGxzY3JlZW5JbWFnZXMuaHRtbCcpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0JHNjb3BlLm1vZGFsLnJlbW92ZSgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQkc2NvcGUub25NZXNzYWdlSG9sZCA9IGZ1bmN0aW9uIChlLCBpdGVtSW5kZXgsIG1lc3NhZ2UpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ29uTWVzc2FnZUhvbGQnKTtcclxuXHRcdFx0Y29uc29sZS5sb2coJ21lc3NhZ2U6ICcgKyBKU09OLnN0cmluZ2lmeShtZXNzYWdlLCBudWxsLCAyKSk7XHJcblx0XHRcdCRpb25pY0FjdGlvblNoZWV0LnNob3coe1xyXG5cdFx0XHRcdGJ1dHRvbnM6IFt7XHJcblx0XHRcdFx0XHR0ZXh0OiAnQ29weSBUZXh0J1xyXG5cdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdFx0dGV4dDogJ0RlbGV0ZSBNZXNzYWdlJ1xyXG5cdFx0XHRcdFx0fV0sXHJcblx0XHRcdFx0YnV0dG9uQ2xpY2tlZDogZnVuY3Rpb24gKGluZGV4KSB7XHJcblx0XHRcdFx0XHRzd2l0Y2ggKGluZGV4KSB7XHJcblx0XHRcdFx0XHRcdGNhc2UgMDogLy8gQ29weSBUZXh0XHJcblx0XHRcdFx0XHRcdFx0Ly9jb3Jkb3ZhLnBsdWdpbnMuY2xpcGJvYXJkLmNvcHkobWVzc2FnZS50ZXh0KTtcclxuXHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgMTogLy8gRGVsZXRlXHJcblx0XHRcdFx0XHRcdFx0Ly8gbm8gc2VydmVyIHNpZGUgc2VjcmV0cyBoZXJlIDp+KVxyXG5cdFx0XHRcdFx0XHRcdCRzY29wZS5tZXNzYWdlcy5zcGxpY2UoaXRlbUluZGV4LCAxKTtcclxuXHRcdFx0XHRcdFx0XHQkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2aWV3U2Nyb2xsLnJlc2l6ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdH0sIDApO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyB0aGlzIHByb2Igc2VlbXMgd2VpcmQgaGVyZSBidXQgSSBoYXZlIHJlYXNvbnMgZm9yIHRoaXMgaW4gbXkgYXBwLCBzZWNyZXQhXHJcblx0XHQkc2NvcGUudmlld1Byb2ZpbGUgPSBmdW5jdGlvbiAobXNnKSB7XHJcblx0XHRcdGlmIChtc2cudXNlcklkID09PSAkc2NvcGUudXNlci5faWQpIHtcclxuXHRcdFx0XHQvLyBnbyB0byB5b3VyIHByb2ZpbGVcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBnbyB0byBvdGhlciB1c2VycyBwcm9maWxlXHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0JHNjb3BlLiRvbignZWxhc3RpYzpyZXNpemUnLCBmdW5jdGlvbiAoZXZlbnQsIGVsZW1lbnQsIG9sZEhlaWdodCwgbmV3SGVpZ2h0KSB7XHJcblx0XHRcdGlmICghZm9vdGVyQmFyKSByZXR1cm47XHJcblxyXG5cdFx0XHR2YXIgbmV3Rm9vdGVySGVpZ2h0ID0gbmV3SGVpZ2h0ICsgMTA7XHJcblx0XHRcdG5ld0Zvb3RlckhlaWdodCA9IChuZXdGb290ZXJIZWlnaHQgPiA0NCkgPyBuZXdGb290ZXJIZWlnaHQgOiA0NDtcclxuXHJcblx0XHRcdGZvb3RlckJhci5zdHlsZS5oZWlnaHQgPSBuZXdGb290ZXJIZWlnaHQgKyAncHgnO1xyXG5cdFx0XHRzY3JvbGxlci5zdHlsZS5ib3R0b20gPSBuZXdGb290ZXJIZWlnaHQgKyAncHgnO1xyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdNb2NrU2VydmljZScsIE1vY2tTZXJ2aWNlKTtcclxuXHJcbiAgICBNb2NrU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCcsICckcSddO1xyXG4gICAgZnVuY3Rpb24gTW9ja1NlcnZpY2UoJGh0dHAsICRxKSB7XHJcbiAgICAgICAgdmFyIG1lID0ge307XHJcblxyXG4gICAgICAgIG1lLmdldFVzZXJNZXNzYWdlcyA9IGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIHZhciBlbmRwb2ludCA9XHJcbiAgICAgICAgICAgICAgJ2h0dHA6Ly93d3cubW9ja3kuaW8vdjIvNTQ3Y2YzNDE1MDFjMzM3ZjBjOWE2M2ZkP2NhbGxiYWNrPUpTT05fQ0FMTEJBQ0snO1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuanNvbnAoZW5kcG9pbnQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dldCB1c2VyIG1lc3NhZ2VzIGVycm9yLCBlcnI6ICcgKyBKU09OLnN0cmluZ2lmeShcclxuICAgICAgICAgICAgICAgIGVyciwgbnVsbCwgMikpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShnZXRNb2NrTWVzc2FnZXMoKSk7XHJcbiAgICAgICAgICAgIH0sIDE1MDApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbWUuZ2V0TW9ja01lc3NhZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB1c2VySWQ6ICc1MzRiOGU1YWFhNWU3YWZjMWIyM2U2OWInLFxyXG4gICAgICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoKSxcclxuICAgICAgICAgICAgICAgIHRleHQ6ICdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudCB1dCBsYWJvcmUgZXQgZG9sb3JlIG1hZ25hIGFsaXF1YS4gVXQgZW5pbSBhZCBtaW5pbSB2ZW5pYW0sIHF1aXMgbm9zdHJ1ZCBleGVyY2l0YXRpb24gdWxsYW1jbyBsYWJvcmlzIG5pc2kgdXQgYWxpcXVpcCBleCBlYSBjb21tb2RvIGNvbnNlcXVhdC4nXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0TW9ja01lc3NhZ2VzKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwibWVzc2FnZXNcIjogW1xyXG4gICAgICAgICAgICAgICAgeyBcIl9pZFwiOiBcIjUzNWQ2MjVmODk4ZGY0ZTgwZTJhMTI1ZVwiLCBcInRleHRcIjogXCJJb25pYyBoYXMgY2hhbmdlZCB0aGUgZ2FtZSBmb3IgaHlicmlkIGFwcCBkZXZlbG9wbWVudC5cIiwgXCJ1c2VySWRcIjogXCI1MzRiOGZiMmFhNWU3YWZjMWIyM2U2OWNcIiwgXCJkYXRlXCI6IFwiMjAxNC0wNC0yN1QyMDowMjozOS4wODJaXCIsIFwicmVhZFwiOiB0cnVlLCBcInJlYWREYXRlXCI6IFwiMjAxNC0xMi0wMVQwNjoyNzozNy45NDRaXCIgfSwgeyBcIl9pZFwiOiBcIjUzNWYxM2ZmZWUzYjJhNjgxMTJiOWZjMFwiLCBcInRleHRcIjogXCJJIGxpa2UgSW9uaWMgYmV0dGVyIHRoYW4gaWNlIGNyZWFtIVwiLCBcInVzZXJJZFwiOiBcIjUzNGI4ZTVhYWE1ZTdhZmMxYjIzZTY5YlwiLCBcImRhdGVcIjogXCIyMDE0LTA0LTI5VDAyOjUyOjQ3LjcwNlpcIiwgXCJyZWFkXCI6IHRydWUsIFwicmVhZERhdGVcIjogXCIyMDE0LTEyLTAxVDA2OjI3OjM3Ljk0NFpcIiB9LCB7IFwiX2lkXCI6IFwiNTQ2YTU4NDNmZDRjNWQ1ODFlZmEyNjNhXCIsIFwidGV4dFwiOiBcIkxvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQsIHNlZCBkbyBlaXVzbW9kIHRlbXBvciBpbmNpZGlkdW50IHV0IGxhYm9yZSBldCBkb2xvcmUgbWFnbmEgYWxpcXVhLiBVdCBlbmltIGFkIG1pbmltIHZlbmlhbSwgcXVpcyBub3N0cnVkIGV4ZXJjaXRhdGlvbiB1bGxhbWNvIGxhYm9yaXMgbmlzaSB1dCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LiBEdWlzIGF1dGUgaXJ1cmUgZG9sb3IgaW4gcmVwcmVoZW5kZXJpdCBpbiB2b2x1cHRhdGUgdmVsaXQgZXNzZSBjaWxsdW0gZG9sb3JlIGV1IGZ1Z2lhdCBudWxsYSBwYXJpYXR1ci4gRXhjZXB0ZXVyIHNpbnQgb2NjYWVjYXQgY3VwaWRhdGF0IG5vbiBwcm9pZGVudCwgc3VudCBpbiBjdWxwYSBxdWkgb2ZmaWNpYSBkZXNlcnVudCBtb2xsaXQgYW5pbSBpZCBlc3QgbGFib3J1bS5cIiwgXCJ1c2VySWRcIjogXCI1MzRiOGZiMmFhNWU3YWZjMWIyM2U2OWNcIiwgXCJkYXRlXCI6IFwiMjAxNC0xMS0xN1QyMDoxOToxNS4yODlaXCIsIFwicmVhZFwiOiB0cnVlLCBcInJlYWREYXRlXCI6IFwiMjAxNC0xMi0wMVQwNjoyNzozOC4zMjhaXCIgfSwgeyBcIl9pZFwiOiBcIjU0NzY0Mzk5YWI0M2QxZDQxMTNhYmZkMVwiLCBcInRleHRcIjogXCJBbSBJIGRyZWFtaW5nP1wiLCBcInVzZXJJZFwiOiBcIjUzNGI4ZTVhYWE1ZTdhZmMxYjIzZTY5YlwiLCBcImRhdGVcIjogXCIyMDE0LTExLTI2VDIxOjE4OjE3LjU5MVpcIiwgXCJyZWFkXCI6IHRydWUsIFwicmVhZERhdGVcIjogXCIyMDE0LTEyLTAxVDA2OjI3OjM4LjMzN1pcIiB9LCB7IFwiX2lkXCI6IFwiNTQ3NjQzYWVhYjQzZDFkNDExM2FiZmQyXCIsIFwidGV4dFwiOiBcIklzIHRoaXMgbWFnaWM/XCIsIFwidXNlcklkXCI6IFwiNTM0YjhmYjJhYTVlN2FmYzFiMjNlNjljXCIsIFwiZGF0ZVwiOiBcIjIwMTQtMTEtMjZUMjE6MTg6MzguNTQ5WlwiLCBcInJlYWRcIjogdHJ1ZSwgXCJyZWFkRGF0ZVwiOiBcIjIwMTQtMTItMDFUMDY6Mjc6MzguMzM4WlwiIH0sIHsgXCJfaWRcIjogXCI1NDc4MTVkYmFiNDNkMWQ0MTEzYWJmZWZcIiwgXCJ0ZXh0XCI6IFwiR2VlIHdpeiwgdGhpcyBpcyBzb21ldGhpbmcgc3BlY2lhbC5cIiwgXCJ1c2VySWRcIjogXCI1MzRiOGU1YWFhNWU3YWZjMWIyM2U2OWJcIiwgXCJkYXRlXCI6IFwiMjAxNC0xMS0yOFQwNjoyNzo0MC4wMDFaXCIsIFwicmVhZFwiOiB0cnVlLCBcInJlYWREYXRlXCI6IFwiMjAxNC0xMi0wMVQwNjoyNzozOC4zMzhaXCIgfSwgeyBcIl9pZFwiOiBcIjU0NzgxYzY5YWI0M2QxZDQxMTNhYmZmMFwiLCBcInRleHRcIjogXCJJIHRoaW5rIEkgbGlrZSBJb25pYyBtb3JlIHRoYW4gSSBsaWtlIGljZSBjcmVhbSFcIiwgXCJ1c2VySWRcIjogXCI1MzRiOGZiMmFhNWU3YWZjMWIyM2U2OWNcIiwgXCJkYXRlXCI6IFwiMjAxNC0xMS0yOFQwNjo1NTozNy4zNTBaXCIsIFwicmVhZFwiOiB0cnVlLCBcInJlYWREYXRlXCI6IFwiMjAxNC0xMi0wMVQwNjoyNzozOC4zMzhaXCIgfSwgeyBcIl9pZFwiOiBcIjU0NzgxY2E0YWI0M2QxZDQxMTNhYmZmMVwiLCBcInRleHRcIjogXCJZZWEsIGl0J3MgcHJldHR5IHN3ZWV0XCIsIFwidXNlcklkXCI6IFwiNTM0YjhlNWFhYTVlN2FmYzFiMjNlNjliXCIsIFwiZGF0ZVwiOiBcIjIwMTQtMTEtMjhUMDY6NTY6MzYuNDcyWlwiLCBcInJlYWRcIjogdHJ1ZSwgXCJyZWFkRGF0ZVwiOiBcIjIwMTQtMTItMDFUMDY6Mjc6MzguMzM4WlwiIH0sIHsgXCJfaWRcIjogXCI1NDc4ZGY4NmFiNDNkMWQ0MTEzYWJmZjRcIiwgXCJ0ZXh0XCI6IFwiV293LCB0aGlzIGlzIHJlYWxseSBzb21ldGhpbmcgaHVoP1wiLCBcInVzZXJJZFwiOiBcIjUzNGI4ZmIyYWE1ZTdhZmMxYjIzZTY5Y1wiLCBcImRhdGVcIjogXCIyMDE0LTExLTI4VDIwOjQ4OjA2LjU3MlpcIiwgXCJyZWFkXCI6IHRydWUsIFwicmVhZERhdGVcIjogXCIyMDE0LTEyLTAxVDA2OjI3OjM4LjMzOVpcIiB9LCB7IFwiX2lkXCI6IFwiNTQ3ODFjYTRhYjQzZDFkNDExM2FiZmYxXCIsIFwidGV4dFwiOiBcIkNyZWF0ZSBhbWF6aW5nIGFwcHMgLSBpb25pY2ZyYW1ld29yay5jb21cIiwgXCJ1c2VySWRcIjogXCI1MzRiOGU1YWFhNWU3YWZjMWIyM2U2OWJcIiwgXCJkYXRlXCI6IFwiMjAxNC0xMS0yOVQwNjo1NjozNi40NzJaXCIsIFwicmVhZFwiOiB0cnVlLCBcInJlYWREYXRlXCI6IFwiMjAxNC0xMi0wMVQwNjoyNzozOC4zMzhaXCIgfSxcclxuICAgICAgICAgICAgICAgIHsgXCJfaWRcIjogXCI1MzVkNjI1Zjg5OGRmNGU4MGUyYTEyNmVcIiwgXCJwaG90b1wiOiBcImh0dHA6Ly9pb25pY2ZyYW1ld29yay5jb20vaW1nL2hvbWVwYWdlL3Bob25lcy12aWV3YXBwXzJ4LnBuZ1wiLCBcInVzZXJJZFwiOiBcIjU0NmE1ODQzZmQ0YzVkNTgxZWZhMjYzYVwiLCBcImRhdGVcIjogXCIyMDE1LTA4LTI1VDIwOjAyOjM5LjA4MlpcIiwgXCJyZWFkXCI6IHRydWUsIFwicmVhZERhdGVcIjogXCIyMDE0LTEzLTAyVDA2OjI3OjM3Ljk0NFpcIiB9XSwgXCJ1bnJlYWRcIjogMFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ0FwcCcpXHJcblx0XHQuZmFjdG9yeSgnTW9kYWxzJywgTW9kYWxzKTtcclxuXHJcblx0TW9kYWxzLiRpbmplY3QgPSBbJyRpb25pY01vZGFsJ107XHJcblx0ZnVuY3Rpb24gTW9kYWxzKCRpb25pY01vZGFsKSB7XHJcblxyXG5cdFx0dmFyIG1vZGFscyA9IFtdO1xyXG5cclxuXHRcdHZhciBfb3Blbk1vZGFsID0gZnVuY3Rpb24gKCRzY29wZSwgdGVtcGxhdGVVcmwsIGFuaW1hdGlvbikge1xyXG5cdFx0XHRyZXR1cm4gJGlvbmljTW9kYWwuZnJvbVRlbXBsYXRlVXJsKHRlbXBsYXRlVXJsLCB7XHJcblx0XHRcdFx0c2NvcGU6ICRzY29wZSxcclxuXHRcdFx0XHRhbmltYXRpb246IGFuaW1hdGlvbiB8fCAnc2xpZGUtaW4tdXAnLFxyXG5cdFx0XHRcdGJhY2tkcm9wQ2xpY2tUb0Nsb3NlOiBmYWxzZVxyXG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uIChtb2RhbCkge1xyXG5cdFx0XHRcdG1vZGFscy5wdXNoKG1vZGFsKTtcclxuXHRcdFx0XHRtb2RhbC5zaG93KCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgX2Nsb3NlTW9kYWwgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBjdXJyZW50TW9kYWwgPSBtb2RhbHMuc3BsaWNlKC0xLCAxKVswXTtcclxuXHRcdFx0Y3VycmVudE1vZGFsLnJlbW92ZSgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgX2Nsb3NlQWxsTW9kYWxzID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRtb2RhbHMubWFwKGZ1bmN0aW9uIChtb2RhbCkge1xyXG5cdFx0XHRcdG1vZGFsLnJlbW92ZSgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0bW9kYWxzID0gW107XHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG9wZW5Nb2RhbDogX29wZW5Nb2RhbCxcclxuXHRcdFx0Y2xvc2VNb2RhbDogX2Nsb3NlTW9kYWwsXHJcblx0XHRcdGNsb3NlQWxsTW9kYWxzOiBfY2xvc2VBbGxNb2RhbHNcclxuXHRcdH07XHJcblx0fVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdBcHAnKVxyXG5cdFx0LmZhY3RvcnkoJ01vZGVsJywgTW9kZWwpO1xyXG5cclxuXHQvL01vZGVsLiRpbmplY3QgPSBbJ1VzZXJzJ107XHJcblx0ZnVuY3Rpb24gTW9kZWwoKSB7XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0XHJcblx0XHR9O1xyXG5cdH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdBcHAnKVxyXG4gICAgICAgIC5maWx0ZXIoJ25sMmJyJywgbmwyYnIpO1xyXG5cclxuICAgIC8vbmwyYnIuJGluamVjdCA9IFtdO1xyXG4gICAgZnVuY3Rpb24gbmwyYnIoKSB7XHJcblxyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmICghZGF0YSkgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhLnJlcGxhY2UoL1xcblxccj8vZywgJzxiciAvPicpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
