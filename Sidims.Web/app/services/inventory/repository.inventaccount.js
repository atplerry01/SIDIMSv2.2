(function () {
    'use strict';
    var serviceId = 'repository.inventaccount';

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
            this.getCardEngrStaffs = getCardEngrStaffs;
            this.getInventoryStaffs = getInventoryStaffs;
            this.getMailingStaffs = getMailingStaffs;
            this.getProductionStaffs = getProductionStaffs;

            this.getInventoryUsers = getInventoryUsers;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            //var forceRemote;
            return this._getById(entityName, id, forceRemote);
        }

        function getInventoryUsers(forceRemote) {
            var self = this;
            var predicate = Predicate.create('isAdmin', '==', true);
            var entity = [];
            var orderBy;

            //if (!forceRemote) {
            //    entity = self._getAllLocal(entityName, orderBy);
            //    return self.$q.when(entity);
            //}

            return EntityQuery.from('InventoryUsers')
                .select('id, firstName, lastName, email, userName, phoneNumber')
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved[Inventory Users Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


        function getCardEngrStaffs(forceRemote) {
            var self = this;
            var predicate = Predicate.create('isAdmin', '==', true);
            var entity = [];
            var orderBy;

            //if (!forceRemote) {
            //    entity = self._getAllLocal(entityName, orderBy);
            //    return self.$q.when(entity);
            //}

            return EntityQuery.from('CardEngrStaffs')
                .select('id, firstName, lastName, email, userName, phoneNumber')
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved[AccountCardEngr Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getProductionStaffs(forceRemote) {
            var self = this;
            var predicate = Predicate.create('isAdmin', '==', true);
            var entity = [];
            var orderBy;

            return EntityQuery.from('ProductionStaffs')
                .select('id, firstName, lastName, email, userName, phoneNumber')
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved[ProductionStaffAccount Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getInventoryStaffs(forceRemote) {
            var self = this;
            var predicate = Predicate.create('isAdmin', '==', true);
            var entity = [];
            var orderBy;

            //if (!forceRemote) {
            //    entity = self._getAllLocal(entityName, orderBy);
            //    return self.$q.when(entity);
            //}

            return EntityQuery.from('InventoryStaffs')
                .select('id, firstName, lastName, email, userName, phoneNumber')
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved[AccountInventory Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getMailingStaffs(forceRemote) {
            var self = this;
            var predicate = Predicate.create('isAdmin', '==', true);
            var entity = [];
            var orderBy;

            //if (!forceRemote) {
            //    entity = self._getAllLocal(entityName, orderBy);
            //    return self.$q.when(entity);
            //}

            return EntityQuery.from('MailingStaffs')
                .select('id, firstName, lastName, email, userName, phoneNumber')
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved[AccountMailing Partials] from remote data source', entity.length, true);
                return entity;
            }
        }



        function getAdminPatials(forceRemote) {
            var self = this;
            var predicate = Predicate.create('isAdmin', '==', true);
            var entity = [];
            var orderBy;

            //if (!forceRemote) {
            //    entity = self._getAllLocal(entityName, orderBy, predicate);
            //    return self.$q.when(entity);
            //}

            return EntityQuery.from('Admins')
                .select('id, firstName, lastName, email, userName, phoneNumber')
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                for (var i = entity.length; i--;) {
                    entity[i].isPartial = true;
                    entity[i].isAdmin = true;
                }

                self._areItemsLoaded(true);
                //self.log('Retrieved[Admin Account Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

    }
})();