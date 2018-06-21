(function () {
    'use strict';
    var serviceId = 'repository.dispatchjob';

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
            this.getDeliveryNoteById = getDeliveryNoteById;
            this.getWasteDeliveryNoteById = getWasteDeliveryNoteById;
            this.getDeliveryProfileById = getDeliveryProfileById;
            this.getJobBatchTrackerById = getJobBatchTrackerById;
            
            this.getIncomingJobs = getIncomingJobs;
            this.getDeliveryNoteLogByNoteId = getDeliveryNoteLogByNoteId;
            this.getWasteLogByNoteId = getWasteLogByNoteId;
            this.getDeliveryReports = getDeliveryReports;
            this.getWasteDeliveryReports = getWasteDeliveryReports;
            this.getDeliveryProfiles = getDeliveryProfiles;
            this.getJobBatchTrackerByTrackId = getJobBatchTrackerByTrackId;
            this.getCardWasteAnalysis = getCardWasteAnalysis;

            this.getClientIncomingJobs = getClientIncomingJobs;
            this.getDispatchDelivery = getDispatchDelivery;
            this.getDispatchDeliveryGenerated = getDispatchDeliveryGenerated;

            this.getAllDispatchDelivery = getAllDispatchDelivery;
            this.getPendingCardWaste = getPendingCardWaste;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function getJobBatchTrackerById(id, forceRemote) {
            return this._getById('JobBatchTracker', id, forceRemote);
        }

        function getDeliveryNoteById(id, forceRemote) {
            return this._getById(entityNames.deliveryNote, id, forceRemote);
        }

        function getWasteDeliveryNoteById(id, forceRemote) {
            return this._getById(entityNames.wasteDeliveryNote, id, forceRemote);
        }

        function getDeliveryProfileById(id, forceRemote) {
            return this._getById(entityNames.deliveryProfile, id, forceRemote);
        }


        function getClientIncomingJobs(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('DispatchIncomingJobs')
                .select('id, sectorId, name')
                .toType('SidClient')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [SidClient Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getAllDispatchDelivery(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('AllDispatchDelivery')
                .select('id, sidClientId, jobTrackerId, rangeFrom, rangeTo')
                .toType('DispatchDelivery')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [DispatchDelivery Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getDispatchDelivery(clientId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('DispatchDelivery')
                .select('id, sidClientId, jobTrackerId, rangeFrom, rangeTo')
                .withParameters({ clientId: clientId })
                .toType('DispatchDelivery')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [DispatchDelivery Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getDispatchDeliveryGenerated(clientId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('DispatchDeliveryGenerated')
                .select('id, sidClientId, jobTrackerId, rangeFrom, rangeTo, createdOn')
                .withParameters({ clientId: clientId })
                .toType('DispatchDelivery')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [DispatchDelivery Partials] from remote data source', entity.length, true);
                return entity;
            }
        }



        function getIncomingJobs(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            //DispatchIncomingJobs
            return EntityQuery.from('DPCardDeliveryLogConfirmations')
                .select('id, jobTrackerId, rangeFrom, rangeTo, isConfirmed')
                .toType('CardDeliveryLog')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [CardDeliveryLog Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getDeliveryProfiles(sidClientId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('DeliveryProfileByClientId')
                .select('id, name, sidClientId, address, state, country, contactPerson')
                .withParameters({ sidClientId: sidClientId })
                .toType('DeliveryProfile')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobTracker Partials] from remote data source', entity.length, true);
                return entity;
            }
        }
     
        function getDeliveryNoteLogByNoteId(noteId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('DispatchDeliveryNoteLogs')
                .select('id, jobTrackerId, deliveryNoteId, dispatchDeliveryId, quantityReceived, quantityDelivered, previousDelivery, ommitted, pending, isPartial')
                .withParameters({ noteId: noteId })
                .toType('DeliveryNoteLog')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [DeliveryNoteLog Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getWasteLogByNoteId(noteId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('WasteDeliveryNoteLogs')
                .select('id, auditStatus, cardWasteAnalysisId, wasteDeliveryNoteId')
                .withParameters({ noteId: noteId })
                .toType('WasteDeliveryNoteLog')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [DeliveryNoteLog Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getWasteLogByNoteId(noteId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('WasteDeliveryNoteLogs')
                .select('id, auditStatus, cardWasteAnalysisId, wasteDeliveryNoteId')
                .withParameters({ noteId: noteId })
                .toType('WasteDeliveryNoteLog')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [DeliveryNoteLog Partials] from remote data source', entity.length, true);
                return entity;
            }
        }
        
        function getDeliveryReports(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('DispatchDeliveryNotes')
                .select('id, sidClientId, deliveryProfileId, createdById, description, transactionDate')
                .toType('DeliveryNote')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [DeliveryNotes Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getCardWasteAnalysis(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('AllCardWasteAnalysis')
                .select('id, jobSplitId, jobSplitCEAnalysisId, jobTrackerId, modifiedById, quantityBad, wasteByUnitId, wasteErrorSourceId')
                .toType('CardWasteAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [DeliveryNotes Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


        function getWasteDeliveryReports(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('WasteDispatchDeliveryNotes')
                .select('id, sidClientId, deliveryProfileId, createdById, description, transactionDate')
                .toType('WasteDeliveryNote')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [DeliveryNotes Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


        function getPendingCardWaste(clientId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('PendingCardWaste')
                .select('id, jobTrackerId, jobSplitId, quantityBad, wasteErrorSourceId, createdById, createdOn')
                .withParameters({ clientId: clientId })
                .toType('CardWasteAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [DeliveryNotes Partials] from remote data source', entity.length, true);
                return entity;
            }
        }





        function getIncomingJobs1(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('DispatchIncomingJobs')
                .select('id, jobId')
                .toType('JobTracker')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobTracker Partials] from remote data source', entity.length, true);
                return entity;
            }
        }



        //Todo: tobe removed
        function getJobBatchTrackerByTrackId(jobTrackerId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('JobBatchByTrackerId')
                .select('id, jobId, jobTrackerId, cardIssuanceLogId')
                .withParameters({ jobTrackerId: jobTrackerId })
                .toType('JobBatchTracker')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [JobTracker Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

    }
})();