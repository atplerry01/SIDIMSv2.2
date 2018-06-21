(function () {
    'use strict';
    var controllerId = 'JobStatusDetail';
    angular
        .module('app')
        .controller('JobStatusDetail', JobStatusDetail);

    JobStatusDetail.$inject = ['$location', '$routeParams', '$scope', 'common', 'datacontext', 'model', 'resourceService'];

    function JobStatusDetail($location, $routeParams, $scope, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var val = $routeParams.trackerId;

        vm.jobTracker = undefined
        vm.jobs = [];
        vm.gotoJobFlag = gotoJobFlag;

        vm.issuanceLogs = [];
        vm.cardissuancelogs = [];

        vm.cardops = [];
        vm.printanalysis = [];
        vm.jobsplitceanalysis = [];
        vm.qaprocess = [];
        vm.mailingDepartment = [];
        vm.mailingsplits = [];

        activate();

        function activate() {
            initLookups();

            var promises = [getRequestedJobTrackers(), getClientVaultReport(), getJobIssuanceLog(), getProductionStaffs(), getDepartmentList()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Job Status View'); });
        }

        // Todo
        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.department = lookups.departments;
        }

        function getRequestedJobTrackers(forceRefresh) {
            var val = $routeParams.trackerId;
            return datacontext.resourcejob.getJobTrackerById(val, forceRefresh).then(function (data) {
                vm.jobTracker = data;

                //console.log(vm.jobTracker);

                getProductVariant(vm.jobTracker.jobId);
                getJobByTrackerId();


                if (vm.jobTracker.stage01CardOps.name !== 'Not Required') {
                    getCardOpByJobTrackerId(vm.jobTracker.jobId);
                }

                if (vm.jobTracker.stage02Inventory.name !== 'Not Required') {
                    // Related Printing
                    getCardIssuanceLogByTrackerId(vm.jobTracker.id);
                }

                if (vm.jobTracker.stage03Printing.name !== 'Not Required') {
                    // Related Printing
                    getJobSplitByTrackerId(vm.jobTracker.id);
                    getPrintAnalysisByTrackerId(vm.jobTracker.id);
                }

                if (vm.jobTracker.stage06FirstJobRun.name !== 'Not Required') {
                    getJobSplitByTrackerId(vm.jobTracker.id);
                    getJobSplitCEAnalysis(val);
                }

                if (vm.jobTracker.stage05QA.name !== 'Not Required') {
                    getJobSplitByTrackerId(vm.jobTracker.id);
                    getQAProcess(val);
                }

                if (vm.jobTracker.stage07CardEngrResume.name !== 'Not Required') {
                    getJobSplitByTrackerId(vm.jobTracker.id);
                    getJobSplitCEAnalysis(val);
                }

                if (vm.jobTracker.stage09Mailing.name !== 'Not Required') {
                    getMailingSplits(vm.jobTracker.id);
                }



                //} else if (vm.jobTracker.stage07CardEngrResume.name !== 'Not Required') {
                //    // Related CE
                //} else if (vm.jobTracker.stage08QC.name !== 'Not Required') {
                //    // Related QC
                //    //getJobSplitQCAnalysis(val);
                //} else if (vm.jobTracker.stage09Mailing.name !== 'Not Required') {
                //    // Related Mailing
                //} else if (vm.jobTracker.stage10Dispatch.name === 'Completed') {
                //    // Related Dispatch
                //}

                return vm.jobTracker;
            });
        }

        // CardOps
        function getCardOpByJobTrackerId(val, forceRefresh) {
            return datacontext.resourcejob.getCardOpsByJobId(val, forceRefresh).then(function (data) {
                vm.cardops = data;
                return vm.cardops;
            });
        }

        // Inventory
        function getCardIssuanceLogByTrackerId(val, forceRefresh) {
            return datacontext.resourcejob.getCardIssuanceLogByTrackerId(val, forceRefresh).then(function (data) {
                vm.cardissuancelogs = data;
                return vm.cardissuancelogs;
            });
        }

        // Printing
        function getPrintAnalysisByTrackerId(val, forceRefresh) {
            return datacontext.resourcejob.getPrintAnalysisByTrackerId(val, forceRefresh).then(function (data) {
                vm.printanalysis = data;
                return vm.printanalysis;
            });
        }

        // CE 1
        function getJobSplitCEAnalysis(val, forceRefresh) {
            return datacontext.resourcejob.getJobSplitCEAnalysisByJobTrackerId(val, forceRefresh).then(function (data) {
                vm.jobsplitceanalysis = data;
                //console.log(vm.jobsplitceanalysis);
                return vm.jobsplitceanalysis;
            });
        }

        function getJobSplitByTrackerId(val, forceRefresh) {
            return datacontext.resourcejob.getJobSplitByTrackerId(val, forceRefresh).then(function (data) {
                vm.jobSplits = data;
                //getMailingSplits(vm.jobSplits, val);
                return vm.jobSplits;
            });
        }

        // QA
        function getQAProcess(val, forceRefresh) {
            return datacontext.resourcejob.getPersoJobSplitByJobTrackerId(val)
                .then(function (data) {
                    vm.qaprocess = data;
                }, function (error) {
                    logError('Unable to get JobSplit ' + entityId);
                });
        }


        // MA
        function getMailingSplits(val, forceRefresh) {
            return datacontext.resourcejob.getMailingJobSplitByJobTrackerId(val, forceRefresh).then(function (data) {
                vm.mailingsplits = data;
                return vm.mailingsplits;
            });
        }


        function getProductVariant(jobId, forceRefresh) {
            return datacontext.resourcejob.getJobVariantByJobId(jobId, forceRefresh).then(function (data) {
                //console.log(data);
                if (data.length !== 0) {
                    vm.jobVariants = data[0];
                    vm.productName = true;
                }

                return vm.jobVariants;
            });
        }

        function getJobIssuanceLog() {
            var val = $routeParams.trackerId;
            return datacontext.inventjob.getCardIssuanceLogs(val)
                .then(function (data) {
                    vm.issuanceLogs = data;
                }, function (error) {
                    logError('Unable to get CardIssuanceLog ' + val);
                });
        }


        function getJobByTrackerId(forceRefresh) {
            var val = $routeParams.trackerId;
            return datacontext.resourcejob.getJobByTrackerId(val, forceRefresh)
                .then(function (data) {
                    vm.jobs = data;
                    return vm.jobs;
                });
        }

        function getClientVaultReport(forceRefresh) {
            var val = $routeParams.trackerId;
            //console.log(val);
            return datacontext.inventory.getClientVaultReportByTrackerId(val, forceRefresh).then(function (data) {
                vm.clientVault = data;

                if (vm.clientVault.length == 0) {
                    vm.createVault = true;
                }
                return vm.clientVault;
            });
        }

        function getProductionStaffs(forceRefresh) {
            return datacontext.inventaccount.getProductionStaffs(forceRefresh).then(function (data) {
                vm.staffs = data;
                //console.log(vm.staffs);
                return vm.staffs;
            });
        }

        function getDepartmentList() {
            // Mailing Department
            angular.forEach(vm.department, function (todo, key) {
                if (todo.name === 'Mailing') {
                    vm.mailingDepartment.push(todo);
                    //console.log(vm.mailingDepartment);
                }
            });
        }


        function goBack() { $window.history.back(); }

        function gotoJobFlag() {
            var trackerId = $routeParams.trackerId;
            $location.path('/job-flag/' + trackerId);
        }

    }
})();
