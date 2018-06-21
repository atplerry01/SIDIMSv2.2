(function () {
    'use strict';
    var serviceId = 'repository.customerservice';

    angular.module('app').factory(serviceId,
        ['$routeParams', 'common', 'authService', 'model', 'repository.abstract', RepositoryResource]);

    function RepositoryResource($routeParams, common, authService, model, AbstractRepository) {
        var entityName = model.entityNames.person;
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
        
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            //var forceRemote;
            return this._getById(entityName, id, forceRemote);
        }

        function getIncomingJobs(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('CSIncomingJobs')
                .select('id, sidClientId, deliveryProfileId, description, createdById, transactionDate')
                .toType('DeliveryNote')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self.log('Retrieved [JobTracker Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


    }
})();