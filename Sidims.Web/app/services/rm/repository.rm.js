(function () {
    'use strict';
    var serviceId = 'repository.rm';

    angular.module('app').factory(serviceId,
        ['$routeParams', 'common', 'authService', 'model', 'repository.abstract', relationshipmanager]);

    function relationshipmanager($routeParams, common, authService, model, AbstractRepository) {
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
         
            this.getNonPersojobs = getNonPersojobs;
            this.getRMUsers = getRMUsers;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function getNonPersojobs(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            //DispatchIncomingJobs
            return EntityQuery.from('NonPersoJobs')
                .select('id, jobName, sidProductId, serviceTypeId, description, isTreated, isDeleted, createdById, modifiedById, createdOn, modifiedOn')
                .toType('NonPersoJob')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self.log('Retrieved [NonPersoJob Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getRMUsers(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            //DispatchIncomingJobs
            return EntityQuery.from('RMUsers')
                .select('id, lastName, firstName, email')
                .toType('ApplicationUser')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self.log('Retrieved [RM Users Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


    }
})();