(function () {
    'use strict';
    var controllerId = 'JobCheckQA';
    angular
        .module('app')
        .controller('JobCheckQA', JobCheckQA);

    JobCheckQA.$inject = ['$location', '$routeParams', '$scope', '$window', 'common', 'datacontext', 'model', 'ngAuthSettings', 'resourceService'];

    function JobCheckQA($location, $routeParams, $scope, $window, common, datacontext, model, ngAuthSettings, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var serviceBase = ngAuthSettings.apiResourceBaseUri;

        vm.gotoJobDetails = gotoJobDetails;
        vm.jobs = [];
        vm.qaIncomingPersos = [];
        vm.save = save;
        vm.requireMailing = false;
        vm.productImagePath = undefined;

        vm.checkboxModel = {
            chip: false,
            magstripe: false,
            indenting: false,
            embossing: false,
            picture: false,
            fulfillment: false,
            client: false,
            cardtype: false,
            pictureView: false,
            variant: false,
            cardIdNumber: false,
            bin: false,
            magstripeTrack: false,
            cvv: false,
            panSpacing: false,
        };

        activate();

        function activate() {
            var promises = [getRequestedQABySplitId()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        function getRequestedQABySplitId() {
            var val = $routeParams.splitId;

            return datacontext.resourcejob.getQABySplitId(val)
                .then(function (data) {
                    vm.splitQA = data;
                    getJobTracker(vm.splitQA[0].jobTrackerId);
                }, function (error) {
                    logError('Unable to get QA ' + val);
                });
        }

        function getJobTracker(val) {
            return datacontext.resourcejob.getJobTrackerById(val)
                .then(function (data) {
                    vm.jobTracker = data;
                    getJobVariant(vm.jobTracker.id);
                }, function (error) {
                    logError('Unable to get JobTracker ' + val);
                });
        }

        function getJobVariant(val) {
            return datacontext.resourcejob.getJobVariantByJobTrackerId(val)
                .then(function (data) {
                    vm.jobVariant = data[0];
                    isMailable(vm.jobVariant.serviceType.name);
                    getProductImage(vm.jobVariant.sidProductId);
                }, function (error) {
                    logError('Unable to get jobVariant ' + val);
                });
        }

        function isMailable(serviceType) {
            if (serviceType.indexOf('Mailing') >= 0) {
                vm.requireMailing = true;   
            }
        }

        function getProductImage(entity) {
            return datacontext.inventory.getProductImage(entity)
                .then(function (data) {
                    vm.productImage = '';
                    vm.productImage = data[0];
                    vm.productImagePath = serviceBase + 'uploads/' + vm.productImage.imageName;
                    //console.log(vm.productImagePath);
                }, function (error) {
                    logError('Unable to get JobTracker ' + val);
                });
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/qa/job-check/' + entity.job.id)
            }
        }

        function goBack() { $window.history.back(); }

        function save() {
            var val = $routeParams.splitId;
          
            vm.checkboxModel.id = vm.splitQA[0].id;
            vm.checkboxModel.jobSplitId = vm.splitQA[0].jobSplitId;
            vm.checkboxModel.jobTrackerId = vm.splitQA[0].jobTrackerId;

            updateEntity(vm.checkboxModel);
        }
    
        function updateEntity(entity) {  
            var resourceUri = model.resourceUri.qac + '/jobcheckprocess/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                goBack();
            },
			 function (response) {
			     //console.log(response);
			     $scope.message = "Failed to save resource due to:";
			 });
        }

    }
})();
