(function () {
    'use strict';

    var app = angular.module('app');

    // Todo: Configuration options will be coming from the db
    // Configure Toastr
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';

    var keyCodes = {
        backspace: 8,
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        del: 46
    };

    // For use with the HotTowel-Angular-Breeze add-on that uses Breeze
    var remoteServiceName = 'http://localhost:53401/breeze/sidimclients';
    var remoteServiceName1 = 'http://62.173.38.182/breeze/sidimclients';
    
    //var clientName = window.location.origin;
    //if (clientName == 'http://localhost:55094') {
    //    var remoteServiceName1 = 'http://localhost:53401/breeze/sidimclients';
    //    var remoteServiceName = 'http://62.173.38.182/breeze/sidimclients';
    //} else if (clientName == 'http://62.173.38.182') {
    //    var remoteServiceName = 'http://62.173.38.182/breeze/sidimclients';
    //}

    var events = {
        controllerActivateSuccess: 'controller.activateSuccess',
        spinnerToggle: 'spinner.toggle'
    };

    var config = {
        appErrorPrefix: '[WSS Error] ', //Configure the exceptionHandler decorator
        docTitle: '- Whycespace Educational Portal',
        events: events,
        keyCodes: keyCodes,
        remoteServiceName: remoteServiceName,
        version: '2.1.0'
    };

    app.value('config', config);
    
    app.config(['$logProvider', function ($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
    }]);
    
    //#region Configure the common services via commonConfig
    app.config(['commonConfigProvider', function (cfg) {
        cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
        cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
    }]);
    //#endregion
})();