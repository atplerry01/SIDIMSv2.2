(function () {
    'use strict';
    var serviceId = 'repository.inventjob';

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
            this.getCardIssuanceById = getCardIssuanceById;
            this.getCardIssuanceLogById = getCardIssuanceLogById;

            this.getJobs = getJobs;
            this.getIncomingJobs = getIncomingJobs;
            this.getCardIssuances = getCardIssuances;
            this.getCardIssuanceByJobId = getCardIssuanceByJobId;
            this.getCardIssuanceLogs = getCardIssuanceLogs;
            this.getCardIssuanceLogByTrackerId = getCardIssuanceLogByTrackerId;
            this.getAllCardIssuanceLogs = getAllCardIssuanceLogs;
            this.getPartialJobs = getPartialJobs;
            this.getIncomingHeldCards = getIncomingHeldCards;
            this.getIncomingHeldPrints = getIncomingHeldPrints;
            this.getCESplitAnalysis = getCESplitAnalysis;
            this.getCESplitAnalysisHeldCard = getCESplitAnalysisHeldCard;
            this.getApprovedCardWastes = getApprovedCardWastes;
            this.getApprovedPrintWastes = getApprovedPrintWastes;

        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function getCardIssuanceById(id, forceRemote) {
            return this._getById('CardIssuance', id, forceRemote);
        }

        function getCardIssuanceLogById(id, forceRemote) {
            return this._getById('CardIssuanceLog', id, forceRemote);
        }

        function getJobs(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('InventoryJobs')
                .select('id, jobName, sidClientId, serviceTypeId, remarkId, quantity')
                .toType('Job')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                return entity;
            }
        }

        function getIncomingJobs(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('InventoryIncomingJobs')
                .select('id, jobId, jobStatusId, createdOn, modifiedOn, isDeleted')
                .toType('JobTracker')
                .orderBy(orderBy)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                return entity;
            }
        }

        function getPartialJobs(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('InventoryPartialJobs')
                .select('id, jobId, totalQuantity, totalQuantityIssued, totalQuantityRemain')
                .toType('CardIssuance')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [CardIssuance Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getCardIssuanceByJobId(jobId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('CardIssuanceByJobId')
                .select('id, jobId, collectorId, issuanceId, totalQuantityIssued, totalQuantityRemain, totalQuantity')
                 .withParameters({ jobId: jobId })
                .toType('CardIssuance')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [CardIssuance Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


        function getCardIssuanceLogs(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('CardIssuanceLogs')
                .select('id, cardIssuanceId, collectorId, issuanceId, issuanceTypeId, quantityIssued, quantityRemain, totalQuantity')
                .toType('CardIssuanceLog')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                return entity;
            }
        }


        function getApprovedCardWastes(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('ApprovedCardWastes')
                .select('id, jobTrackerId, jobSplitId, quantityBad, wasteErrorSourceId, wasteByUnitId')
                .toType('CardWasteAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [JobSplitCEAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getApprovedPrintWastes(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('ApprovedPrintWastes')
                .select('id, jobTrackerId, jobSplitId, quantityBad, wasteErrorSourceId, wasteByUnitId')
                .toType('PrintWasteAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [JobSplitCEAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getIncomingHeldCards(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('IncomingHeldCards')
                .select('id, jobTrackerId, jobSplitCEAnalysisId, jobSplitId, quantityHeld, wasteErrorSourceId, wasteByUnitId, createdOn, createdById')
                .toType('CardHeldAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self._areItemsLoaded(true);
                //self.log('Retrieved [CardHeld Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getIncomingHeldPrints(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('IncomingHeldPrints')
                .select('id, jobTrackerId, jobSplitPrintCEAnalysisId, jobSplitId, quantityHeld, wasteErrorSourceId, wasteByUnitId, createdOn, createdById')
                .toType('PrintHeldAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self._areItemsLoaded(true);
                //self.log('Retrieved [CardHeld Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getCESplitAnalysis(jobTrackerId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('CESplitAnalysisByTrackerId')
                .select('id, jobSplit, jobSplitId, quantityGood, quantityHeld, isHeldCardCollected, quantityBad, isBadCardCollected, createdById, createdOn')
                .withParameters({ jobTrackerId: jobTrackerId })
                .toType('JobSplitCEAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [JobSplitCEAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getCESplitAnalysisHeldCard(jobTrackerId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('CESplitAnalysisHeldCardsByTrackerId')
                .select('id, jobSplit, jobSplitId, quantityGood, quantityHeld, isHeldCardCollected, quantityBad, isBadCardCollected, createdById, createdOn')
                .withParameters({ jobTrackerId: jobTrackerId })
                .toType('JobSplitCEAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [JobSplitCEAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getCardIssuances(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('CardIssuances')
                .select('id, jobId, collectorId, issuanceId, issuanceStatusId, totalQuantity, totalQuantityIssued, totalQuantityRemain')
                .toType('CardIssuance')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [CardIssuance Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getCardIssuanceLogByTrackerId(jobTrackerId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('CardIssuanceLogByTrackerId')
                .select('id, cardIssuanceId, collectorId, issuanceId, issuanceTypeId, quantityIssued, quantityRemain, totalQuantity, issuedDate')
                .withParameters({ jobTrackerId: jobTrackerId })
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

        function getAllCardIssuanceLogs(jobTrackerId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('CardIssuanceLogByJobTrackerId')
                .select('id, cardIssuanceId, collectorId, issuanceId, issuanceTypeId, quantityIssued, quantityRemain, totalQuantity')
                .withParameters({ jobTrackerId: jobTrackerId })
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

        



    }
})();