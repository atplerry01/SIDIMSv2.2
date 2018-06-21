(function () {
    'use strict';
    var serviceId = 'repository.qacjob';

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
            
            this.getQAIncomingPersos = getQAIncomingPersos;
            this.getQAIncomingPrints = getQAIncomingPrints;

            this.getQCIncomingPersos = getQCIncomingPersos;
            this.getQCPendingPersos = getQCPendingPersos;
            this.getQCPendingDelivery = getQCPendingDelivery;
            this.getQCIncomingPrints = getQCIncomingPrints;
            this.getQCCardDeliveryLists = getQCCardDeliveryLists;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            //var forceRemote;
            return this._getById(entityName, id, forceRemote);
        }

        function getQAIncomingPersos(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy = 'modifiedOn desc';
            
            return EntityQuery.from('QAIncomingPersos')
                .select('id, jobId, jobStatusId, createdOn, modifiedOn')
                .orderBy(orderBy)
                .toType('JobTracker')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [JobTracker Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getQAIncomingPrints(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('QAIncomingPrints')
                .select('id, jobId, jobStatusId, createdOn, modifiedOn')
                .orderBy(orderBy)
                .toType('JobTracker')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [JobTracker Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


        function getQCIncomingPersos(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('QCIncomingPersos')
                .select('id, jobId, jobStatusId, createdOn, modifiedOn')
                .orderBy(orderBy)
                .toType('JobTracker')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [JobTracker Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getQCPendingPersos(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('QCPendingPersos')
                .select('id, jobId, createdOn, jobStausId, modifiedOn')
                .orderBy(orderBy)
                .toType('JobTracker')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [JobTracker Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getQCPendingDelivery(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('QCPendingDelivery')
                .select('id, jobId, jobStatusId, createdOn, modifiedOn')
                .orderBy(orderBy)
                .toType('JobTracker')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [JobTracker Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        //getQCCardDeliveryLists
        function getQCCardDeliveryLists(jobTrackerId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('QCCardDeliveryLists')
                .select('id, jobTrackerId, rangeFrom, rangeTo')
                .withParameters({ jobTrackerId: jobTrackerId })
                .toType('CardDelivery')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [CardDelivery Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getQCIncomingPrints(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('QCIncomingPrints')
                .select('id, jobId, jobStatusId, createdOn, modifiedOn')
                .orderBy(orderBy)
                .toType('JobTracker')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [JobTracker Partials] from remote data source', entity.length, true);
                return entity;
            }
        }



    }
})();