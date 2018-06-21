(function () {
    'use strict';
    var controllerId = 'accordion';

    angular
        .module('app')
        .controller('accordion', accordion);

    accordion.$inject = ['$location', '$rootScope', '$scope', '$modal', '$sce', 'common'];

    function accordion($location, $rootScope, $scope, $modal, $sce, common) {
        /* jshint validthis:true */
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var $q = common.$q;
        var primePromise;

        var vm = this;

        activate();

        function activate() {
            common.activateController([], controllerId)
                .then(function () {
                    //log('Activated Login View');
                });
        }


        // Open Simple Modal
        $scope.openModal = function (modal_id, modal_size, modal_backdrop) {
            $rootScope.currentModal = $modal.open({
                templateUrl: modal_id,
                size: modal_size,
                backdrop: typeof modal_backdrop == 'undefined' ? true : modal_backdrop
            });
        };

        // Loading AJAX Content
        $scope.openAjaxModal = function (modal_id, url_location) {
            $rootScope.currentModal = $modal.open({
                templateUrl: modal_id,
                resolve: {
                    ajaxContent: function ($http) {
                        return $http.get(url_location).then(function (response) {
                            $rootScope.modalContent = $sce.trustAsHtml(response.data);
                        }, function (response) {
                            $rootScope.modalContent = $sce.trustAsHtml('<div class="label label-danger">Cannot load ajax content! Please check the given url.</div>');
                        });
                    }
                }
            });

            $rootScope.modalContent = $sce.trustAsHtml('Modal content is loading...');
        }



    }
})();
