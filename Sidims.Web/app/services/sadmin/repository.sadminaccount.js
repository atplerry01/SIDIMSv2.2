(function () {
    'use strict';
    var serviceId = 'repository.sadminaccount';

    angular.module('app').factory(serviceId,
        ['$routeParams', 'common', 'authService', 'model', 'repository.abstract', AdminAccountRepositoryResource]);

    function AdminAccountRepositoryResource($routeParams, common, authService, model, AbstractRepository) {
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
            this.getAccountPatials = getAccountPatials;
            this.getUserRoles = getUserRoles;


        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            //var forceRemote;
            return this._getById(entityName, id, forceRemote);
        }

        function getAccountPatials(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            //if (!forceRemote) {
            //    entity = self._getAllLocal(entityName, orderBy);
            //    return self.$q.when(entity);
            //}

            return EntityQuery.from('Users')
                .select('id, lastName, email, userName, phoneNumber')
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self._areItemsLoaded(true);
                //self.log('Retrieved [Account Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getUserRoles(userId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('UserRoles')
                .select('id, name')
                .withParameters({ userId: userId })
                .toType('IdentityRole')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self._areItemsLoaded(true);
                //self.log('Retrieved [Account Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


        function getAccountRolePatials(forceRemote) {
            var self = this;
            var predicate = Predicate.create('isAdmin', '==', true);
            var entity = [];
            var orderBy;

            return EntityQuery.from('Roles')
                .select('userId, roleId')
                .toType('IdentityRole')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [Account Partials] from remote data source', entity.length, true);
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
                //self.log('Retrieved [Admin Account Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


        function getBasicInfoPatials(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy; //sortOrder;
            var userId = $routeParams.id;

            var predicate = Predicate.create('id', '==', userId);

            //if (!forceRemote) {
            //    entity = self._getAllLocal(entityName, orderBy);
            //    return self.$q.when(entity);
            //}

            return EntityQuery.from('Users')
                .select('id, firstName, lastName, email, userName, phoneNumber')
                .where(predicate)
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                for (var i = entity.length; i--;) {
                    entity[i].isPartial = true;
                }

                self._areItemsLoaded(true);
                //self.log('Retrieved [Baisc Info Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getRoleInfoPatials(forceRemote) {
            var self = this;
            var entity = [];
            var userId = $routeParams.id;
            
            var predicate = Predicate.create('userId', '==', userId);
          
            return EntityQuery.from('AppUserAccountTypes')
                .select('id, userId, accountTypeId, clientId')
                .where(predicate)
                .toType('ApplicationUserAccountType')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                for (var i = entity.length; i--;) {
                    entity[i].isPartial = true;
                }

                self._areItemsLoaded(true);
                //self.log('Retrieved [UserAccountTypes Info Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

    }
})();