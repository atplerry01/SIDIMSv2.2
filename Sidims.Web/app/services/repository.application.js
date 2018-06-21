(function () {
    'use strict';

    var serviceId = 'repository.application';

    angular
        .module('app')
        .factory(serviceId, RepositoryApplication);

    RepositoryApplication.$inject = ['model', 'repository.abstract'];

    function RepositoryApplication(model, AbstractRepository) {

        var entityName = 'lookups';
        var entityNames = model.entityNames;
        var EntityQuery = breeze.EntityQuery;
        var Predicate = breeze.Predicate;

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            // Exposed data access functions
            this.getAll = getAll;
            this.setLookups = setLookups;
            this.getUserDetail = getUserDetail;
            this.getChartCategory = getChartCategory;
            this.getChartCategoryDetail = getChartCategoryDetail;
            this.getChartCategoryDetailWithPredicate = getChartCategoryDetailWithPredicate;

        }

        // Allow this repo to have access to the Abstract Repo's functions,
        // then put its own Ctor back on itself.
        //Ctor.prototype = new AbstractRepository(Ctor);
        //Ctor.prototype.constructor = Ctor;
        AbstractRepository.extend(Ctor);

        return Ctor;

        function getAll() {
            var self = this;
            return EntityQuery.from('Lookups')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                self.log('Retrieved [Lookups]', data, true);
                return true;
            }
        }

        // Formerly known as datacontext.setLookups()
        function setLookups() {
            this.lookupCachedData = {
                accountTypes: this._getAllLocal(entityNames.accountType, 'accountType'),
                departments: this._getAllLocal(entityNames.department, 'name'),
                roles: this._getAllLocal(entityNames.role, 'role'),
                payschedules: this._getAllLocal(entityNames.payschedule, 'lastDayOfWork'),
                accountcategorytypes: this._getAllLocal(entityNames.accountcategorytype, 'name'),
                accountcategorydetailtypes: this._getAllLocal(entityNames.accountcategorydetailtype, 'name'),
                salarydeductions: this._getAllLocal(entityNames.salarydeduction, 'type'),
            };
        }

        function getUserDetail(username, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('GetUser')
                .select('id')
                .withParameters({ username: username })
                .toType('ApplicationUser')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                return entity;
            }
        }

        function getChartCategory(forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('AccountCategoryTypes')
                .select('id, name')
                .toType('AccountCategoryType')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                self.log('Retrieved [AccountCategoryType Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getChartCategoryDetail(forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            if (self._areItemsLoaded() && !forceRemote) {
                entity = self._getAllLocal('AccountCategoryDetailType', orderBy);
                return self.$q.when(entity);
            }

            return EntityQuery.from('AccountCategoryDetailTypes')
                .select('id, name, accCategoryId')
                .toType('AccountCategoryDetailType')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                self.log('Retrieved [AccountCategoryDetailType Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getChartCategoryDetailWithPredicate(forceRemote, predicateValue) {
            var self = this;
            var entity;
            var orderBy;
            var predicate = Predicate.create('accCategoryId', '==', predicateValue);

            if (self._areItemsLoaded() && !forceRemote) {
                entity = self._getAllLocal('AccountCategoryDetailType', orderBy, predicate);
                return self.$q.when(entity);
            }

            return EntityQuery.from('AccountCategoryDetailTypes')
                .select('id, name, description, accCategoryId')
                .where(predicate)
                .toType('AccountCategoryDetailType')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                self.log('Retrieved [ChatOfAccountCatDetail Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

    }
})();