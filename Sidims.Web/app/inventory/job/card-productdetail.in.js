(function () {
    'use strict';
    var controllerId = 'CardProductSetupDetailIN';
    angular
        .module('app')
        .controller('CardProductSetupDetailIN', CardProductSetupDetailIN);

    CardProductSetupDetailIN.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function CardProductSetupDetailIN($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);


        vm.cardsetup = undefined;

        vm.issuanceLogs = [];
        vm.collectors = [];
        vm.job = undefined;
        vm.jobs = [];
        vm.jobTracker = undefined;
        vm.stateCheck = undefined;
        vm.goBack = goBack;
        vm.save = save;
        vm.selectedClientVariant = [];
        vm.newProducts = [];
        vm.sidProducts = [];

        activate();

        function activate() {
            initLookups();
          
            var promises = [getRequestedJob()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated JobDetails View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.jobStatus = lookups.jobStatus;
            vm.products = lookups.sidProducts;
            vm.sidVariants = lookups.sidVariants;
        }
    
        function getRequestedJob() {
            var val = $routeParams.trackerId;
            return datacontext.resourcejob.getJobTrackerById(val)
                .then(function (data) {
                    vm.jobTracker = data;
                    getJobVariant();
                    getJobs(); //Todo: get the Request job Navigation
                }, function (error) {
                    logError('Unable to get JobTracker ' + val);
                });
        }

        function getJobVariant(forceRefresh) {
            var val = vm.jobTracker.jobId;
            return datacontext.resourcejob.getJobVariantByJobId(val, forceRefresh).then(function (data) {
                vm.jobVariant = data[0];
                vm.cardsetup = data[0];
                //console.log(vm.cardsetup);
                //if (vm.jobVariant.length !== 0) {
                //    $location.path('/in/card-issuance/' + $routeParams.trackerId);
                //}
                
                return vm.jobVariant;
            });
        }

        function goBack() { $window.history.back(); }

        function save() {
            var val = $routeParams.trackerId;
          
            vm.newEntity = {
                id: vm.jobVariant.id,
                jobId: vm.jobTracker.jobId,
                sidProductId: vm.cardsetup.sidProduct.id,
                sidVariantId: vm.cardsetup.sidVariant.id
            };

            //console.log(vm.newEntity);
            createEntity(vm.newEntity);
        }

        function createEntity(entity) {
            var val = $routeParams.trackerId;
            var resourceUri = model.resourceUri.inventory + '/jobvariant/update';
            resourceService.updateResource(resourceUri, entity).then(function (response) {
                vm.cardsetup = {};
                //console.log(response);
                $location.path('/in/card-issuance/' + val);
            },
			 function (response) {
			     //console.log(response);
			 });
        }

        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                //console.log(vm.jobs);
                //console.log(vm.jobTracker.job);

                // setups all requested items
                vm.cardsetup = {
                    cardType: vm.jobTracker.job.sidCardType.name
                };

                getProductList(vm.jobTracker.job.sidClientId, vm.jobTracker.job.sidCardType.id);

                return vm.jobs;
            });
        }

        function getProductList(clientId, cardTypeId) {
            angular.forEach(vm.products, function (todo, key) {
                if (todo.sidCardTypeId == cardTypeId && todo.sidClientId == clientId) {
                    vm.newProducts.push(todo);
                    vm.sidProducts.push(todo);
                }
            });
        }


    }


})();
