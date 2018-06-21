(function () {
    'use strict';
    var serviceId = 'repository.cardengrjob';

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
            
            this.getIncomingPersos = getIncomingPersos;
            this.getIncomingPrints = getIncomingPrints;
            this.getResumableNewPersos = getResumableNewPersos;
            this.getResumablePendingPersos = getResumablePendingPersos;
            this.getResumablePartialPersos = getResumablePartialPersos;

            this.getCardIssuanceLogs = getCardIssuanceLogs;

            this.getJobSplitCEAnalysis = getJobSplitCEAnalysis;
            this.getCECardDelivery = getCECardDelivery;

        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            //var forceRemote;
            return this._getById(entityName, id, forceRemote);
        }


        function getIncomingPersos(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('CardEngrIncomingPersos')
                .select('id, jobId, createdOn, modifiedOn, jobStatusId')
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

        function getIncomingPrints(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('CardEngrIncomingPrints')
                .select('id, jobId, createdOn')
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

        function getResumableNewPersos(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('CardEngrResumeNewPersos')
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

        function getResumablePendingPersos(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('CardEngrResumePendingPersos')
                .select('id, jobId, createdOn')
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

        function getResumablePartialPersos(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('CardEngrResumePartialPersos')
                .select('id, jobId, createdOn, modifiedOn')
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

        function getCardIssuanceLogs(jobId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('CardIssuanceLogs')
                .select('id, cardIssuanceId, collectorId, issuanceId, issuanceTypeId, quantityIssued, quantityRemain, totalQuantity, issuedDate')
                .toType('CardIssuanceLog')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                return entity;
            }
        }


        function getJobSplitCEAnalysis(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('JobSplitCEAnalysis')
                .select('id, jobTrackerId, jobSplitId, quantityGood, quantityHeld, quantityBad, heldReturned, wasteReturned, createdById, createdOn, modifiedById, modifiedOn')
                .toType('JobSplitCEAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                return entity;
            }
        }

        function getCECardDelivery(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('CECardDelivery')
                .select('id, jobTrackerId, departmentId, targetDepartmentId, totalQuantity, totalHeld, totalWaste, deliveredById, deliveredOn, confirmedById, confirmedOn')
                .toType('CardDelivery')
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