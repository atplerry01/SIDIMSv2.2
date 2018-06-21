(function () {
    'use strict';
    var serviceId = 'repository.mailingjob';

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
            
            this.getMAIncomingPersos = getMAIncomingPersos;
            this.getMAPendingDeliverys = getMAPendingDeliverys;
            this.getMAJobSplits = getMAJobSplits;
            this.getMailingCardDelivery = getMailingCardDelivery;

        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            //var forceRemote;
            return this._getById(entityName, id, forceRemote);
        }



        function getMAIncomingPersos(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('MAIncomingJobs')
                .select('id, jobId, jobStatusId, modifiedOn')
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

        function getMAPendingDeliverys(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy = 'modifiedOn desc';

            return EntityQuery.from('MAPendingDeliverys')
                .select('id, jobId, modifiedOn')
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
            var orderBy;

            return EntityQuery.from('QCIncomingPersos')
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

        function getMAJobSplits(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('MAJobSplits')
                .select('id, jobTrackerId, departmentId, sidMachineId, rangeFrom, rangeTo, createdById, createdOn')
                .toType('JobSplit')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [JobTracker Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


        function getMailingCardDelivery(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('MailingCardDelivery')
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