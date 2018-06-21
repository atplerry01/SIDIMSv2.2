(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId,
        ['common', 'config', 'entityManagerFactory', 'model', 'repositories', 'authService', datacontext]);

    function datacontext(common, config, emFactory, model, repositories, authService) {
        var entityNames = model.entityNames;
        var events = config.events;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var manager = emFactory.newManager();
        var primePromise;
        var repoNames =
            [
                'account', 'lookup',
                'cardopsaccount', 'cardopsflag', 'cardopsjob', 'cardopsproduct', 'cardopstracker', 'application',
                'sadminaccount', 'sadminassessment', 'sadmincbt', 'sadminclassroom', 'sadmincommunity', 'sadminlibrary', 'sadminschedule', 'supervisor',
                'cardopslookup', 'printingjob', 'cardengrjob', 'resourcejob', 'inventjob', 'inventory', 'inventaccount', 'dispatchjob', 'materialaudit', 'qacjob', 'mailingjob', 'customerservice', 'rm'
            ];

        var $q = common.$q;

        var filterValue = authService.authentication.userName;
        var page = authService.authentication.page;

        var service = {
            cancel: cancel,
            markDeleted: markDeleted,
            prime: prime,
            save: save
            // Repositories to be added on demand:
            //      attendees
            //      lookups
            //      sessions
            //      speakers
        };

        init();

        return service;

        function init() {
            repositories.init(manager);
            defineLazyLoadedRepos();
            setupEventForHasChangesChanged();
        }
        
        function cancel() {
            if (manager.hasChanges()) {
                manager.rejectChanges();
                logSuccess('Canceled changes', null, true);
            }
        }

        // Add ES5 property to datacontext for each named repo
        function defineLazyLoadedRepos() {
            repoNames.forEach(function (name) {
                Object.defineProperty(service, name, {
                    configurable: true, // will redefine this property once
                    get: function () {
                        // The 1st time the repo is request via this property, 
                        // we ask the repositories for it (which will inject it).
                        var repo = repositories.getRepo(name);
                        // Rewrite this property to always return this repo;
                        // no longer redefinable
                        Object.defineProperty(service, name, {
                            value: repo,
                            configurable: false,
                            enumerable: true
                        });
                        return repo;
                    }
                });
            });
        }
        
        function markDeleted(entity) {
            return entity.entityAspect.setDeleted();
        }

        function prime() {
            if (primePromise) return primePromise;
            var auth = authService.authentication;
            
            if (auth.roles !== "") {
                var roles = auth.roles; //JSON.parse(auth.roles);
                var page = roles[0];
            }
            
            if (page !== undefined) {
                primePromise = $q.all([
                   service.lookup.getAll(),
                ])
               .then(extendMetadata)
               .then(success);
                return primePromise;
            } else {
                //console.log(page);
            }

            if (page) {
                primePromise = $q.all([
                    service.lookup.getAll(),
                ])
                .then(extendMetadata)
                .then(success);
                return primePromise;
            }

            if (page == 'Admin') {
                primePromise = $q.all([
                    service.lookup.getAll(),
                ])
                .then(extendMetadata)
                .then(success);
                return primePromise;

            } else if (page == 'Supervisor') {
                primePromise = $q.all([
                    service.lookup.getAll(),
                ])
                .then(extendMetadata)
                .then(success);
                return primePromise;

            } else if (page == 'CardOps') {
                primePromise = $q.all([
                    service.lookup.getAll(),
                ])
                .then(extendMetadata)
                .then(success);
                return primePromise;

            } else if (page == 'CardOps Supervisor || Inventory Supervisor || QA Supervisor || QC Supervisor || Mailing Supervisor || CS Supervisor || CardEngr Supervisor || Printing Supervisor') {
                primePromise = $q.all([
                    service.lookup.getAll(),
                ])
                .then(extendMetadata)
                .then(success);
                return primePromise;

            } else if (page == 'Inventory') {
                primePromise = $q.all([
                    service.lookup.getAll(),
                ])
                .then(extendMetadata)
                .then(success);
                return primePromise;

            } else if (page == 'CardEngr') {
                primePromise = $q.all([
                    service.lookup.getAll(),
                ])
                .then(extendMetadata)
                .then(success);
                return primePromise;

            } else if (page == 'Printing') {
                primePromise = $q.all([
                    service.lookup.getAll(),
                ])
                .then(extendMetadata)
                .then(success);
                return primePromise;

            } else if (page === 'QA' || page === 'QC') {
                primePromise = $q.all([
                    service.lookup.getAll(),
                ])
                .then(extendMetadata)
                .then(success);
                return primePromise;

            } else if (page == 'Mailing') {
                primePromise = $q.all([
                    service.lookup.getAll(),
                ])
                .then(extendMetadata)
                .then(success);
                return primePromise;

            } else if (page == 'Admin') {
                //console.log('Admin');
            } else if (page == 'Inventory') {

                primePromise = $q.all([
                    service.lookup.getAll(),
                ])
                .then(extendMetadata)
                .then(success);
                return primePromise;

            } else if (page == 'MaterialAudit') {
                primePromise = $q.all([
                    service.lookup.getAll(),
                ])
                .then(extendMetadata)
                .then(success);
                return primePromise;

            } else if (page == 'CS') {
                primePromise = $q.all([
                    service.lookup.getAll(),
                ])
                .then(extendMetadata)
                .then(success);
                return primePromise;

            } else if (page == 'RM') {
                primePromise = $q.all([
                    service.lookup.getAll(),
                ])
                .then(extendMetadata)
                .then(success);
                return primePromise;

            } else {
                //service.lookup.getAll()
                //primePromise = $q.all([
                //         service.lookup.getAll(),
                //])
                //     .then(extendMetadata)
                //     .then(success);
                //return primePromise;
            }

            function success() {
                service.lookup.setLookups();
                log('Primed the data');
            }

            function extendMetadata() {
                var metadataStore = manager.metadataStore;
                var types = metadataStore.getEntityTypes();
                types.forEach(function (type) {
                    if (type instanceof breeze.EntityType) {
                        set(type.shortName, type);
                    }
                });

                var personEntityName = entityNames.person;
                ['Accounts', 'Account', 'User', 'Users'].forEach(function (r) {
                    set(r, personEntityName);
                });

                var serverJobEntityName = entityNames.serverJobQueue;
                ['RecentServerJobQueues'].forEach(function (r) {
                    set(r, serverJobEntityName);
                });

                function set(resourceName, entityName) {
                    metadataStore.setEntityTypeForResourceName(resourceName, entityName);
                }
            }

        }
        
        function save() {
            return manager.saveChanges()
                .then(saveSucceeded, saveFailed);
            
            function saveSucceeded(result) {
                logSuccess('Saved data', result, true);
            }
            
            function saveFailed(error) {
                var msg = config.appErrorPrefix + 'Save failed: ' +
                    breeze.saveErrorMessageService.getErrorMessage(error);
                error.message = msg;
                logError(msg, error);
                throw error;
            }
        }

        function setupEventForHasChangesChanged() {
            manager.hasChangesChanged.subscribe(function (eventArgs) {
                var data = { hasChanges: eventArgs.hasChanges };
                // send the message (the ctrl receives it)
                common.$broadcast(events.hasChangesChanged, data);
            });
        }

    }
})();