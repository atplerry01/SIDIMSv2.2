(function () {
    'use strict';
    var serviceId = 'repository.supervisor';

    angular.module('app').factory(serviceId,
        ['$routeParams', 'common', 'authService', 'model', 'repository.abstract', RepositoryResource]);

    function RepositoryResource($routeParams, common, authService, model, AbstractRepository) {
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
            this.getFlaggedJobs = getFlaggedJobs;
            this.getResolvedFlaggedJobs = getResolvedFlaggedJobs;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            //var forceRemote;
            return this._getById(entityName, id, forceRemote);
        }

        function getFlaggedJobs(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('FlaggedJobs')
                .select('id, jobTrackerId, flagTypeId, description, recommendation')
                .toType(entityNames.jobFlag)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self._areItemsLoaded(true);
                self.log('Retrieved [Account Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getResolvedFlaggedJobs(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('ResolvedFlaggedJobs')
                .select('id, jobTrackerId, flagTypeId, description, recommendation')
                .toType(entityNames.jobFlag)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self._areItemsLoaded(true);
                self.log('Retrieved [Account Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

    }
})();