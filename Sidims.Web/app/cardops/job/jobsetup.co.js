(function () {
    'use strict';
    var controllerId = 'JobSetupCO';
    angular
        .module('app')
        .controller('JobSetupCO', JobSetupCO);

    JobSetupCO.$inject = ['$location', '$routeParams', '$scope', 'config', 'common', 'datacontext', 'model', 'resourceService'];

    function JobSetupCO($location, $routeParams, $scope, config, common, datacontext, model, resourceService) {
        /* jshint validthis:true */
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        vm.serverJob = undefined;
        vm.job = [];
        vm.goBack = goBack;
        vm.gotoJobDetails = gotoJobDetails;
        //vm.updateRemark = updateRemark;

        vm.save = saveJob;
        vm.clients = [];
        vm.newClientInfo = [];
        vm.jobTypes = [];
        vm.remarks = [];
        vm.sectors = [];
        vm.priority = [];
        vm.sidVariants = [];
        vm.sidCardTypes = [];
        vm.updateClientList = updateClientList;

        vm.jobsetup = {};

        vm.jobNames = [];
        vm.jobName = undefined;
        vm.jobQuantity;
        vm.clientRemarks = [];

        vm.serverJobs = [];
        vm.filteredServerJobs = [];
        vm.serverJobsSearch = '';
        vm.search = search;

        vm.serverJobCount = 0;
        vm.serverJobFilteredCount = 0;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 10,
            pageSize: 20
        };
        vm.pageChanged = pageChanged;

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.serverJobFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        vm.errorMessage = '';

        activate();

        function activate() {
            initLookups();

            var promises = [getRequestedServerJob()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Variants View'); });
        }

        function initLookups() {
            var lookups = datacontext.lookup.lookupCachedData;
            vm.clients = lookups.clients;
            vm.remarks = lookups.remarks;
            vm.sidCardTypes = lookups.sidCardTypes;
            vm.dictionaryClientNames = lookups.dictionaryClientNames;
            vm.dictionaryCardTypes = lookups.dictionaryCardTypes;
            vm.dictionaryServiceTypes = lookups.dictionaryServiceTypes;
        }

        function getRequestedServerJob() {
            var val = $routeParams.id;

            if (val) {
                return datacontext.resourcejob.getByServerJobQueueId(val)
                .then(function (data) {
                    
                    vm.jobsetup.jobName = data.jobName;
                 
                    var fileName = vm.jobsetup.jobName.toLowerCase();
                    fileName = fileName.replace(/\s/gi, "_");
                    vm.fileName = fileName;

                    getClientName(fileName);
                    getCardType(fileName);
                    getJobQuantity(fileName);

                    return vm.jobsetup;
                }, function (error) {
                    logError('Unable to get variant ' + val);
                });
            }
        }



        function updateClientList(entity) {
            vm.clientRemarks = [];
            angular.forEach(vm.remarks, function (todo, key) {
                if (todo.sidClientId == vm.jobsetup.sidClient.id) {
                    vm.clientRemarks.push(todo);
                }
            });
        }
        
        function isInt(value) {
            return !isNaN(value) && (function (x) { return (x | 0) === x; })(parseFloat(value))
        }

        function gotoJobDetails(entity) {
            if (entity && entity.id) {
                $location.path('/co/job-setup/' + entity.id)
            }
        }

        function goBack() { $window.history.back(); }

        function saveJob() {
            var val = $routeParams.id;

            if (document.getElementById('jobName').value == ""
                 || document.getElementById('jobName').value == undefined) {
                alert("Please select a valid Job Name");
                return false;
            }

            if (vm.jobsetup.remark !== undefined) {
                vm.remark = vm.jobsetup.remark.id;
            }

            if (vm.jobsetup.jobName !== null || vm.jobsetup.jobName !== undefined) {
                vm.newJob = {
                    jobName: vm.jobsetup.jobName,
                    sidClientId: vm.jobsetup.sidClient.id,
                    sidCardTypeId: vm.jobsetup.sidCardType.id,
                    quantity: vm.jobsetup.quantity
                };

                if (vm.jobsetup.remark !== undefined) {
                    vm.newJob.remarkId = vm.jobsetup.remark.id;
                }
                createEntity(vm.newJob);
            } else {
                vm.errorMessage = 'No Job Selected'
            }

        }

        function createEntity(entity) {
            var resourceUri = model.resourceUri.co + '/job/create';
            resourceService.saveResource(resourceUri, entity).then(function (response) {
                vm.serverJob = {};
                vm.jobsetup = {};
                gotoJobStatus();
            },
                function (response) {
                    //console.log(response);
			     var errors = [];
			     for (var key in response.data.modelState) {
			         for (var i = 0; i < response.data.modelState[key].length; i++) {
			             errors.push(response.data.modelState[key][i]);
			         }
                 }
			     $scope.message = "Failed to save resource due to:" + errors.join(' ');
			     //gotoJobStatus();
			 });
        }

        function gotoJobStatus() {
            $location.path('/co/pending-jobs');
        }

       
        function getServerJobs(forceRefresh) {
            return datacontext.resourcejob.getServerJobQueues(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.serverJobsSearch)
                .then(function (data) {
                    vm.jobNames = vm.serverJobs = vm.filteredServerJobs = data;
                    if (!vm.serverJobCount || forceRefresh) {
                        getServerJobCount();
                    }
                    getServerJobFilteredCount();
                    return data;
                });
        }

        function getServerJobCount() {
            return datacontext.resourcejob.getServerJobCount().then(function (data) {
                return vm.serverJobCount = data;
            });
        }

        function getServerJobFilteredCount() {
            vm.serverJobFilteredCount = datacontext.resourcejob.getServerJobFilteredCount(vm.serverJobsSearch);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) { vm.serverJobsSearch = ''; }
            getServerJobs();
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getServerJobs();
        }
        

        function getCardType(fileName) {
            fileName = fileName.toLowerCase();
            var found = false;
            for (var i = 0; i < vm.dictionaryCardTypes.length && !found; i++) {

                var cardCodes = vm.dictionaryCardTypes[i].cardCodeName.toLowerCase();
                var res = cardCodes.split("_");
                for (var j = 0; j < res.length && !found; j++) {
                    var n = fileName.indexOf(res[j]);
                    if (n > 0) {
                        found = true;
                        if (found) {
                            vm.jobsetup.sidCardType = vm.dictionaryCardTypes[i].sidCardType;
                        }
                        break;
                    }
                }
            }


        }
        
        function getClientName(fileName) {
            // scan thru the array dictionary if the word in contain in the fileName
            var found = false;
            for (var i = 0; i < vm.dictionaryClientNames.length && !found; i++) {
                var shortCodes = vm.dictionaryClientNames[i].clientCodeName;
                // Check if we have _ split
                var res = shortCodes.split("_");

                for (var j = 0; j < res.length && !found; j++) {
                    var n = fileName.indexOf(res[j].toLowerCase());

                    if (n >= 0) {
                        found = true;

                        if (found) {
                            vm.jobsetup.sector = vm.dictionaryClientNames[i].sidClient.sector;
                            vm.jobsetup.sidClient = vm.dictionaryClientNames[i].sidClient;
                            updateClientList();
                        }
                        break;
                    }
                }

            }

        }

        function wordInString(s, word) {
            return new RegExp('\\b' + word + '\\b', 'i').test(s);
        }

        function getJobQuantity(entity) {
            var str = entity.replace(/_/g, " ").replace(/\./g, ' '); //.replace(/\./g, '_')
            var stringArray = [];
            stringArray = str.split(' ');

            for (var i = 0; i < stringArray.length; i++) {
                getJobNumber(stringArray[i]);
            }
        }

        function getJobNumber(entity) {
            // start with n and the next number is an interger
            // nFirst or n100
            if (entity.startsWith("n")) {
                if (isInt(entity.substring(1, entity.length))) { // cut the n and check theremain value
                    vm.jobsetup.quantity = entity.substring(1, entity.length);
                }
            }
        }
    }
})();
