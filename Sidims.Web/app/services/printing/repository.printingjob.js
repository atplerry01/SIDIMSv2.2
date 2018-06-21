(function () {
    'use strict';
    var serviceId = 'repository.printingjob';

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
            this.getById = getById;
            this.getPrintSplitQCAnalysisById = getPrintSplitQCAnalysisById;

            this.getIncomingPrints = getIncomingPrints;
            this.getPrintAnalysis = getPrintAnalysis;
            this.getJobSplitPrintCEAnalysisReport = getJobSplitPrintCEAnalysisReport;
            this.getJobSplitPrintCEAnalysis = getJobSplitPrintCEAnalysis;
            this.getPrintDeliverables = getPrintDeliverables;
            this.getPrintCardDelivery = getPrintCardDelivery;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            //var forceRemote;
            return this._getById(entityName, id, forceRemote);
        }

        function getPrintSplitQCAnalysisById(id, forceRemote) {
            return this._getById(entityNames.jobSplitPrintQCAnalysis, id, forceRemote);
        }

        function getIncomingPrints(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('IncomingPrints')
                .select('id, jobId, jobStatusId, modifiedOn')
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

        function getPrintAnalysis(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('PrintAnalysis')
                .select('id, jobId')
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

        function getPrintDeliverables(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('PrintDeliverables')
                .select('id, jobId')
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

        function getJobSplitPrintCEAnalysisReport(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('JobSplitPrintCEAnalysis')
                .select('id, jobSplit, jobTrackerId, quantityGood, quantityHeld, quantityBad, wasteReturned, heldReturned')
                .toType('JobSplitPrintCEAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [JobSplitCEAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getJobSplitPrintCEAnalysis(jobTrackerId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('JobSplitPrintAnalysisByTrackerId')
                .select('id, jobSplit, quantityGood, quantityHeld, quantityBad')
                .withParameters({ jobTrackerId: jobTrackerId })
                .toType('JobSplitPrintCEAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [JobSplitCEAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getResumableNewPersos(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('CardEngrResumeNewPersos')
                .select('id, jobId')
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
            var orderBy;

            return EntityQuery.from('CardEngrResumePartialPersos')
                .select('id, jobId')
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
                .select('id, cardIssuanceId, collectorId, issuanceId, issuanceTypeId, quantityIssued, quantityRemain, totalQuantity')
                //.withParameters({ jobId: jobId })
                .toType('CardIssuanceLog')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [Issuance Log Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getPrintCardDelivery(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('PrintCardDelivery')
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