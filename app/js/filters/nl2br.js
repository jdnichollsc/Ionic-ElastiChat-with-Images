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