// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter',
['ionic',
'starter.controllers',
'starter.services',
'ngCordova'
])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.chats', {
        url: '/chats',
        views: {
            'tab-chats': {
                templateUrl: 'templates/tab-chats.html',
                controller: 'ChatsCtrl'
            }
        }
    })
    .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
            'tab-chats': {
                templateUrl: 'templates/chat-detail.html',
                controller: 'ChatDetailCtrl'
            }
        }
    })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

})
.run(function($cordovaPush,$ionicPlatform,$rootScope) {

    var androidConfig = {
        "senderID": "775034540259",
    };

    var iosConfig = {
        "badge": true,
        "sound": true,
        "alert": true,
    };


    ionic.Platform.ready(function(){
        if(ionic.Platform.platform() === 'ios') {
            $cordovaPush.register(iosConfig).then(function(deviceToken) {
                console.log("deviceToken: " + deviceToken)
            }, function(err) {
                alert("Registration error: " + err)
            });

            $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
                if (notification.alert) {
                    navigator.notification.alert(notification.alert);
                }

                if (notification.sound) {
                    var snd = new Media(event.sound);
                    snd.play();
                }

                if (notification.badge) {
                    $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
                        // Success!
                    }, function(err) {
                        // An error occurred. Show a message to the user
                    });
                }
            });
        } else if(ionic.Platform.platform() === 'android') {
            $cordovaPush.register(iosConfig).then(function(deviceToken) {
                console.log("deviceToken: " + deviceToken)
            }, function(err) {
                alert("Registration error: " + err)
            });

            $cordovaPush.register(androidConfig).then(function(result) {
                // Success
                console.log('register success');
            }, function(err) {
                // Error
                console.log(err);
            })

            $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
                console.log(notification);
                switch(notification.event) {
                    case 'registered':
                    if (notification.regid.length > 0 ) {
                        console.log('registration ID = ' + notification.regid);
                    }
                    break;

                    case 'message':
                    console.log(notification);
                    // this is the actual push notification. its format depends on the data model from the push server
                    alert(notification.payload['gcm.notification.body']);
                    break;

                    case 'error':
                    alert('GCM error = ' + notification.msg);
                    break;

                    default:
                    alert('An unknown GCM event has occurred');
                    break;
                }
            });
        }
    });

});

});
