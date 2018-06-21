(function () {
    'use strict';
    var serviceId = 'repository.materialaudit';

    angular.module('app').factory(serviceId,
        ['$routeParams', 'common', 'authService', 'model', 'repository.abstract', materialaudit]);

    function materialaudit($routeParams, common, authService, model, AbstractRepository) {
        var entityName = model.entityNames.person;
        var entityNames = model.entityNames;
        var EntityQuery = breeze.EntityQuery;
        var filterValue = authService.authentication.userName;
        var Predicate = breeze.Predicate;
        var $q = common.$q;
        

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            // Exposed data access functions
            this.getById = getById;
         
            this.getIncomingJobs = getIncomingJobs;
            this.getDrivers = getDrivers;

        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function getIncomingJobs(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            //DispatchIncomingJobs
            return EntityQuery.from('MAudIncomingJobs')
                .select('id, sidClientId, deliveryProfileId, description, createdById, transactionDate')
                .toType('DeliveryNote')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self.log('Retrieved [DeliveryNote Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getDrivers(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            //DispatchIncomingJobs
            return EntityQuery.from('Drivers')
                .select('id, firstName, lastName')
                .toType('ApplicationUser')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self.log('Retrieved [Driver Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

    }
})();