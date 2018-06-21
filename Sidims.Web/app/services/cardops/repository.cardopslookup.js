(function () {
    'use strict';
    var serviceId = 'repository.cardopslookup';

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
            this.getCardTypeById = getCardTypeById;
            this.getClientById = getClientById;
            this.getProducts = getProducts;
            this.getVariantById = getVariantById;
            this.getRemarkById = getRemarkById;

            this.getCardTypes = getCardTypes;
            this.getClients = getClients;
            this.getVariants = getVariants;
            this.getRemarks = getRemarks;

            this.getProductWithPredicate = getProductWithPredicate;

            this.getDictionaryClientNames = getDictionaryClientNames;
            this.getDictionaryServiceTypes = getDictionaryServiceTypes;

        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function getCardTypeById(id, forceRemote) {
            return this._getById(entityNames.sidCardType, id, forceRemote);
        }

        function getClientById(id, forceRemote) {
            return this._getById(entityNames.sidClient, id, forceRemote);
        }

        function getVariantById(id, forceRemote) {
            return this._getById(entityNames.sidVariant, id, forceRemote);
        }

        function getRemarkById(id, forceRemote) {
            return this._getById(entityNames.remark, id, forceRemote);
        }



        function getCardTypes(forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('SidCardTypes')
                .select('id, name')
                .orderBy(orderBy)
                .toType('SidCardType')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = self._setIsPartialTrue(data.results);
                self._areItemsLoaded(true);
                self.log('Retrieved [CardTypes Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getClients(forceRemote, page, size, nameFilter) {
            var self = this;
            var entity;
            var orderBy;
            var predicate = null;

            if (nameFilter) {
                predicate = _clientPredicate(nameFilter);
            }

            var take = 20; //size || 20;
            var skip = page ? (page - 1) * size : 0;

            return EntityQuery.from('SidClients')
                .select('id, sectorId, name, shortCode')
                .orderBy(orderBy)
                .toType('SidClient')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = self._setIsPartialTrue(data.results);
                self._areItemsLoaded(true);
                self.log('Retrieved [Client Partials] from remote data source', entity.length, true);
                return getByPage(); //entity;
            }

            function getByPage() {
                var predicate = null;

                if (nameFilter) {
                    predicate = _clientPredicate(nameFilter);
                }

                var newEntities = EntityQuery.from('SidClient')
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

                return newEntities;
            }

        }

        function _clientPredicate(filterValue) {
            return breeze.Predicate
                .create('name', 'contains', filterValue)
                .or('sector.name', '==', filterValue);
        }

        function getProducts(forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('SidProducts')
                .select('id, sidClientId, sidCardTypeId, name, shortCode')
                .orderBy(orderBy)
                .toType('SidProduct')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = self._setIsPartialTrue(data.results);
                self._areItemsLoaded(true);
                self.log('Retrieved [SidProducts Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        //getProductWithPredicate
        function getProductWithPredicate(forceRemote, nameFilter) {
            var self = this;
            var entity;
            var orderBy;
            var predicate = null;

            if (nameFilter) {
                predicate = _productWithPredicate(nameFilter);
            }


            return EntityQuery.from('SidProducts')
                .select('id, sidClientId, sidCardTypeId, name, shortCode')
                .orderBy(orderBy)
                .where(predicate)
                .toType('SidProduct')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = self._setIsPartialTrue(data.results);
                self._areItemsLoaded(true);
                self.log('Retrieved [SidProducts Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function _productWithPredicate(filterValue) {
            return breeze.Predicate
                .create('sidClient.name', 'contains', filterValue);
        }


        function getVariants(forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('SidVariants')
                .select('id, sidClientId, sidCardTypeId, variantName, shortCode')
                .orderBy(orderBy)
                .toType('SidVariant')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = self._setIsPartialTrue(data.results);
                self._areItemsLoaded(true);
                self.log('Retrieved [Variant Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getRemarks(forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('Remarks')
                .select('id, name, sidClientId')
                .orderBy(orderBy)
                .toType('Remark')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = self._setIsPartialTrue(data.results);
                self._areItemsLoaded(true);
                self.log('Retrieved [Remarks Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


        function getDictionaryClientNames(clientId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('DictionaryClientNames')
                .select('id, sidClientId, clientCodeName')
                .withParameters({ clientId: clientId })
                .orderBy(orderBy)
                .toType('DictionaryClientName')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [DictionaryClientName Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getDictionaryServiceTypes(clientId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('DictionaryServiceTypes')
                .select('id, sidClientId, sidCardTypeId, serviceTypeId, serviceCodeName')
                .withParameters({ clientId: clientId })
                .orderBy(orderBy)
                .toType('DictionaryServiceType')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //self.log('Retrieved [DictionaryClientName Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


    }
})();