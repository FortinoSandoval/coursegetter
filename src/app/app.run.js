(function() {
  'use strict';

  angular.module('app').run(runBlock);

  /** @ngInject */
  function runBlock($document, $log, $rootScope, tmhDynamicLocale, $http) {
    $rootScope.$on('$translateChangeSuccess', function(event, data) { // eslint-disable-line angular/on-watch
      tmhDynamicLocale.set(data.language);
      $document[0].documentElement.setAttribute('lang', data.language);
    });

    $http.defaults.headers.common.Authorization = 'Basic YWRtaW46Q2h1Y2hpczQh';


    $log.debug('App run block end');
  }

})();
