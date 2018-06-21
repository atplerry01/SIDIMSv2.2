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
            this.getllAccountPatials = getllAccountPatials;
            this.getAdminPatials = getAdminPatials;
            this.getManagementPatials = getManagementPatials;
            this.getAccountantPatials = getAccountantPatials;
            this.getLibrarianPatials = getLibrarianPatials;
            this.getTeacherPatials = getTeacherPatials;
            this.getStudentPatials = getStudentPatials;
            this.getParentPatials = getParentPatials;

            this.getBasicInfoPatials = getBasicInfoPatials;
            this.getRoleInfoPatials = getRoleInfoPatials;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            //var forceRemote;
            return this._getById(entityName, id, forceRemote);
        }

        function getllAccountPatials(forceRemote) {
            var self = this;
            var predicate = Predicate.create('isAdmin', '==', true);
            var entity = [];
            var orderBy;

            //if (!forceRemote) {
            //    entity = self._getAllLocal(entityName, orderBy);
            //    return self.$q.when(entity);
            //}

            return EntityQuery.from('Users')
                .select('id, firstName, lastName, email, userName, phoneNumber')
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                self.log('Retrieved [Account Partials] from remote data source', entity.length, true);
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
                self.log('Retrieved [Admin Account Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getManagementPatials(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy = 'firstName'; //sortOrder;

            //if (!forceRemote) {
            //    entity = self._getAllLocal(entityName, orderBy);
            //    return self.$q.when(entity);
            //}

            return EntityQuery.from('Managements')
                .select('id, firstName, lastName, email, userName, phoneNumber')
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                for (var i = entity.length; i--;) {
                    entity[i].isPartial = true;
                    entity[i].isManagement = true;
                }
                self._areItemsLoaded(true);
                self.log('Retrieved [Management Account Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getAccountantPatials(forceRemote) {
            var self = this;
            var predicate = Predicate.create('isAccountant', '==', true);
            var entity = [];
            var orderBy; //sortOrder;

            //if (!forceRemote) {
            //    entity = self._getAllLocal(entityName, orderBy);
            //    return self.$q.when(entity);
            //}

            return EntityQuery.from('Accountants')
                .select('id, firstName, lastName, email, userName, phoneNumber')
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                for (var i = entity.length; i--;) {
                    entity[i].isPartial = true;
                    entity[i].isAccountant = true;
                }

                self._areItemsLoaded(true);
                self.log('Retrieved [Accountant Account Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getLibrarianPatials(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy; //sortOrder;

            //if (!forceRemote) {
            //    entity = self._getAllLocal(entityName, orderBy);
            //    return self.$q.when(entity);
            //}

            return EntityQuery.from('Librarians')
                .select('id, firstName, lastName, email, userName, phoneNumber')
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                for (var i = entity.length; i--;) {
                    entity[i].isPartial = true;
                    entity[i].isLibrarian = true;
                }

                self._areItemsLoaded(true);
                self.log('Retrieved [Librarian Account Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getTeacherPatials(forceRemote) {
            var self = this;
            var predicate = Predicate.create('isTeacher', '==', true);
            var entity = [];
            var orderBy; //sortOrder;

            //if (!forceRemote) {
            //    entity = self._getAllLocal(entityName, orderBy);
            //    return self.$q.when(entity);
            //}

            return EntityQuery.from('Teachers')
                .select('id, firstName, lastName, email, userName, phoneNumber')
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                for (var i = entity.length; i--;) {
                    entity[i].isPartial = true;
                    entity[i].isTeacher = true;
                }

                self._areItemsLoaded(true);
                self.log('Retrieved [Teacher Account Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getStudentPatials(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy; //sortOrder;

            //if (!forceRemote) {
            //    entity = self._getAllLocal(entityName, orderBy);
            //    return self.$q.when(entity);
            //}

            return EntityQuery.from('Students')
                .select('id, firstName, lastName, email, userName, phoneNumber')
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                for (var i = entity.length; i--;) {
                    entity[i].isPartial = true;
                    entity[i].isStudent = true;
                }

                self._areItemsLoaded(true);
                self.log('Retrieved [Student Account Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getParentPatials(forceRemote) {
            var self = this;
            var predicate = Predicate.create('isParent', '==', true);
            var entity = [];
            var orderBy; //sortOrder;

            //if (!forceRemote) {
            //    entity = self._getAllLocal(entityName, orderBy);
            //    return self.$q.when(entity);
            //}

            return EntityQuery.from('Parents')
                .select('id, firstName, lastName, email, userName, phoneNumber')
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                for (var i = entity.length; i--;) {
                    entity[i].isPartial = true;
                    entity[i].isParent = true;
                }

                self._areItemsLoaded(true);
                self.log('Retrieved [Parents Account Partials] from remote data source', entity.length, true);
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
                self.log('Retrieved [Baisc Info Partials] from remote data source', entity.length, true);
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
                self.log('Retrieved [UserAccountTypes Info Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

    }
})();