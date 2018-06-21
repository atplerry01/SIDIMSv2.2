(function () {
    'use strict';
    var controllerId = 'RemarkCO';
    angular
        .module('app')
        .controller('RemarkCO', RemarkCO);

    RemarkCO.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function RemarkCO($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.clients = [];
        vm.remarks = [];
        vm.remark = undefined;
        vm.goBack = goBack;
        vm.gotoRemarks = gotoRemarks;
        vm.save = saveRemark;
        vm.addNewRemark = addNewRemark;

        activate();

        function activate() {
            initLookups();
            var promises = [getRemarks(), getRequestedRemark()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Remark View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.clients = lookups.clients;
        }


        function getRemarks(forceRefresh) {
            return datacontext.cardopslookup.getRemarks(forceRefresh)
                .then(function (data) {
                    vm.remarks = data;
                    return vm.remarks;
                });
        }

        function getRequestedRemark() {
            var val = $routeParams.id;
            if (!isNaN(val)) {
                return datacontext.cardopslookup.getRemarkById(val)
                .then(function (data) {
                    vm.remark = data;
                    //console.log(vm.remark);

                }, function (error) {
                    logError('Unable to get Remark ' + val);
                });
            }
        }

        function goBack() { $window.history.back(); }

        function addNewRemark() {
            $location.path('co/lookups/remark/new');
        }

        function saveRemark() {
            var val = $routeParams.id;
           
            if (val === 'new' || isNaN(val)) {
                // Create new entity
                vm.newEntity = {
                    sidClientId: vm.remark.sidClient.id,
                    name: vm.remark.name
                };

                createEntity(vm.newEntity);
            } else {
                // Update Entity
                vm.updateEntity = {
                    id: vm.remark.id,
                    sidClientId: vm.remark.sidClientId,
                    name: vm.remark.name
                };

                updateRemarks(vm.updateEntity);
            }
        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.lookups + '/remark/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.remark = {};
                getRemarks();
            },
			 function (response) {
			     var errors = [];
			     for (var key in response.data.modelState) {
			         for (var i = 0; i < response.data.modelState[key].length; i++) {
			             errors.push(response.data.modelState[key][i]);
			         }
			     }
			     $scope.message = "Failed to save resource due to:" + errors.join(' ');
			 });
        }

        function gotoRemarks(entity) {
            if (entity && entity.id) {
                $location.path('/co/lookups/remark/' + entity.id);
            }
        }

        function updateRemarks(entity) {
            var resourceUri = model.resourceUri.lookups + '/remark/update';
            resourceService.updateResource(resourceUri, entity, entity.id).then(function (response) {
                vm.remark = {};
                getRemarks();
                $location.path('co/lookups/remarks')
            },
			 function (response) {
			     var errors = [];
			     for (var key in response.data.modelState) {
			         for (var i = 0; i < response.data.modelState[key].length; i++) {
			             errors.push(response.data.modelState[key][i]);
			         }
			     }
			     $scope.message = "Failed to save resource due to:" + errors.join(' ');
			 });
        }

    }
})();
