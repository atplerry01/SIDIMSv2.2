(function () {
    'use strict';

    var serviceId = 'repository.lookup';

    angular
        .module('app')
        .factory(serviceId, RepositoryLookup);

    RepositoryLookup.$inject = ['model', 'repository.abstract'];

    function RepositoryLookup(model, AbstractRepository) {

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
        }

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

        function setLookups() {
            this.lookupCachedData = {
                flagTypes: this._getAllLocal(entityNames.flagType, 'name'),
                jobStatus: this._getAllLocal(entityNames.jobStatus, 'name'),
                serviceTypes: this._getAllLocal(entityNames.serviceType, 'name'),
                remarks: this._getAllLocal(entityNames.remark, 'name'),
                priority: this._getAllLocal(entityNames.priority, 'name'),
                vendors: this._getAllLocal(entityNames.vendor, 'name'),
                wasteErrorSources: this._getAllLocal(entityNames.wasteErrorSource, 'name'),
                wasteErrorSourceCodes: this._getAllLocal(entityNames.wasteErrorSourceCode, 'name'),

                clients: this._getAllLocal(entityNames.sidClient, 'name'),
                sectors: this._getAllLocal(entityNames.sidSector, 'name'),
                sidCardTypes: this._getAllLocal(entityNames.sidCardType, 'name'),
                sidChipTypes: this._getAllLocal(entityNames.sidChipTypes, 'name'),
                sidVariants: this._getAllLocal(entityNames.sidVariant, 'name'),
                sidProducts: this._getAllLocal(entityNames.sidProduct, 'name'),
                sidMachines: this._getAllLocal(entityNames.sidMachine, 'name'),
                departments: this._getAllLocal(entityNames.department, 'name'),
                deliveryProfiles: this._getAllLocal('DeliveryProfile', 'name'),
                roles: this._getAllLocal('IdentityRole', 'name'),
                dictionaryClientNames: this._getAllLocal('DictionaryClientName', 'clientCodeName'),
                dictionaryCardTypes: this._getAllLocal('DictionaryCardType', 'cardCodeName'),
                dictionaryServiceTypes: this._getAllLocal('DictionaryServiceType', 'serviceCodeName'),
                productServices: this._getAllLocal('ProductService', 'serviceType.name'),

                //ProductService
            };
        }

    }
})();