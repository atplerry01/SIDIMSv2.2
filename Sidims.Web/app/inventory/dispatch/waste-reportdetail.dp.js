(function () {
    'use strict';
    var controllerId = 'WasteReportDetailIN';
    angular
        .module('app')
        .controller('WasteReportDetailIN', WasteReportDetailIN);

    WasteReportDetailIN.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext'];

    function WasteReportDetailIN($location, $routeParams, $scope, common, datacontext) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);


        vm.deliveryNote = undefined;
        vm.deliveryProfile = undefined;
        vm.deliveryNoteLogs = [];
        vm.wasteNote = [];
        vm.gotoJobDetails = gotoJobDetails;
      
        activate();

        function activate() {
            
            var promises = [getRequestedWasteDeliveryNote(), getCardWasteAnalysis(), getJobTrackers(), getJobs(), getProductionStaffs()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Jobs View'); });
        }

        // get DeliveryNoteById
        function getRequestedWasteDeliveryNote() {
            var val = $routeParams.id;
            ////console.log(val);

            return datacontext.dispatchjob.getWasteDeliveryNoteById(val)
                .then(function (data) {

                    vm.wasteNote = data;
                    ////console.log(vm.wasteNote);

                    getRequestedDeliveryProfile(vm.wasteNote.deliveryProfileId);
                    getWasteNoteLogByNoteIds(vm.wasteNote.id);
                    // DeliveryNoteLog
                    // DispatchDelivery

                }, function (error) {
                    logError('Unable to get deliveryNote ' + val);
                });
        }

        function getRequestedDeliveryProfile(entityId) {
            return datacontext.dispatchjob.getDeliveryProfileById(entityId)
                .then(function (data) {
                    vm.deliveryProfile = data;
                    ////console.log(vm.deliveryProfile);
                }, function (error) {
                    logError('Unable to get deliveryProfile ' + entityId);
                });
        }

        function getJobs(forceRefresh) {
            return datacontext.resourcejob.getJobs(forceRefresh).then(function (data) {
                vm.jobs = data;
                ////console.log(vm.jobs);
                return vm.jobs;
            });
        }

        function getJobTrackers(forceRefresh) {
            return datacontext.resourcejob.getJobTrackers(forceRefresh).then(function (data) {
                vm.jobTrackers = data;
                ////console.log(vm.jobTrackers);
                return vm.jobTrackers;
            });
        }

        function getWasteNoteLogByNoteIds(deliveryNoteId, forceRefresh) {
            return datacontext.dispatchjob.getWasteLogByNoteId(deliveryNoteId, forceRefresh).then(function (data) {
                vm.deliveryNoteLogs = data;
                ////console.log(vm.deliveryNoteLogs);
                return vm.deliveryNoteLogs;
            });
        }

        function getCardWasteAnalysis(forceRefresh) {
            return datacontext.dispatchjob.getCardWasteAnalysis(forceRefresh).then(function (data) {
                vm.cardAnalysis = data;
                ////console.log(vm.cardAnalysis);
                return vm.cardAnalysis;
            });
        }


        function getDispatchDelivery(clientId, forceRefresh) {
            return datacontext.dispatchjob.getDispatchDelivery(clientId, forceRefresh).then(function (data) {
                vm.dispatchDelivery = data;
                ////console.log(vm.dispatchDelivery);
                return vm.dispatchDelivery;
            });
        }






        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/in/card-setup/' + entity.job.id)
            }
        }

        function goBack() { $window.history.back(); }


        $scope.printToCart = function (printSectionId) {
            var innerContents = document.getElementById(printSectionId).innerHTML;
            var popupWinindow = window.open('', '_blank', 'width=800,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
            popupWinindow.document.open();
            popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
            popupWinindow.document.close();
        }
    
        function getProductionStaffs(forceRefresh) {
            return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
                vm.staffs = data;
                return vm.staffs;
            });
        }


    }
})();
