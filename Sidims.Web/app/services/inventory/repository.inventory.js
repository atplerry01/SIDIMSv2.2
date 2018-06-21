(function () {
    'use strict';
    var serviceId = 'repository.inventory';

    angular.module('app').factory(serviceId,
        ['$routeParams', 'common', 'authService', 'model', 'repository.abstract', RepositoryInventoryResource]);

    function RepositoryInventoryResource($routeParams, common, authService, model, AbstractRepository) {
        var entityNames = model.entityNames;
        var EntityQuery = breeze.EntityQuery;
        var filterValue = authService.authentication.userName;
        var Predicate = breeze.Predicate;
        var $q = common.$q;
        
        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.manager = mgr;
            // Exposed data access functions
            this.getById = getById;
            this.getClientById = getClientById;
            this.getProductById = getProductById;
            this.getJobs = getJobs;
            this.getSCMCardRequestById = getSCMCardRequestById;
            this.getCardReceiptById = getCardReceiptById;

            //this.getEmbedCardRequests = getEmbedCardRequests;
            this.getEmbedCardRequestByProducts = getEmbedCardRequestByProducts;
            this.getEmbedCardReceipts = getEmbedCardReceipts;

            this.getClients = getClients;

            this.getClientProducts = getClientProducts;
          
            this.getAllClientProducts = getAllClientProducts;

            this.getClientVaultReports = getClientVaultReports;
            this.getClientVaultReportByTrackerId = getClientVaultReportByTrackerId;

            this.getClientStockReports = getClientStockReports;
            this.getClientStockReportByTrackerId = getClientStockReportByTrackerId;
            this.getReceiptLogByRequestId = getReceiptLogByRequestId;

            this.getAllStockReports = getAllStockReports;
            this.getAllIssuanceReports = getAllIssuanceReports;
            this.getAllCardWasteReports = getAllCardWasteReports;
            this.AllDeliveryNotes = AllDeliveryNotes;
            this.AllClientVaultReports = AllClientVaultReports;
            this.AllCardReceiptReports = AllCardReceiptReports;

            this.getAllCardIssuances = getAllCardIssuances;
            this.getClientStockLogByStockReportId = getClientStockLogByStockReportId;
            this.getClientReturnLogs = getClientReturnLogs;

            this.getClientUsers = getClientUsers;
            this.getSelectedClientUsers = getSelectedClientUsers;

            this.getCardIssuanceByStockLog = getCardIssuanceByStockLog;
            this.getJobByCardIssuanceId = getJobByCardIssuanceId;
            this.getProductImage = getProductImage;

        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function getProductById(id, forceRemote) {
            return this._getById('SidProduct', id, forceRemote);
        }

        function getClientById(id, forceRemote) {
            return this._getById('SidClient', id, forceRemote);
        }
        //

        function getSCMCardRequestById(id, forceRemote) {
            return this._getById(entityNames.cardrequest, id, forceRemote);
        }

        function getCardReceiptById(id, forceRemote) {
            return this._getById(entityNames.cardreceipt, id, forceRemote);
        }

        function getJobs(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('InventoryJobs')
                .select('id, jobName, sidSectorId, sidClientId, serviceTypeId, remark, quantity')
                .toType('Job')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [Job Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getEmbedCardRequestByProducts(sidProductId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('EmbedCardRequestByProducts')
                .select('id, orderNumber, sidProductId, totalBatchQty, totalDelivered, createdById')
                .withParameters({ sidProductId: sidProductId })
                .toType(entityNames.cardrequest)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [EmbedCardRequests Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getProductImage(sidProductId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('SidProductImage')
                .select('id, sidProductId, imageName')
                .withParameters({ productId: sidProductId })
                .toType('SidProductImage')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [EmbedCardRequests Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getEmbedCardReceipts(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('EmbedCardReceipts')
                .select('id, embedCardRequestId, lotNumber, quantity, timeOfReceipt, supplierName, sIDReceiverId, remark')
                .toType(entityNames.cardreceipt)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [EmbedCardReceipt Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getInwardGoods(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('InventoryIncomingJobs')
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

        function getStockReports(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('InventoryIncomingJobs')
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

        


        //
        function getClients(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('SidClients')
                .select('id, sectorId, name, shortCode')
                .toType('SidClient')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [Client Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getClientUsers(clientId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('ClientUsers')
                .select('id, sidClientId, userId, createdOn, modifiedOn')
                .withParameters({ sidClientId: clientId })
                .toType('ClientUser')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                //console.log(data);
                entity = data.results;
                //self.log('Retrieved [Client Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getSelectedClientUsers(clientId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('CurrentClientUsers')
                .select('id, userName, firstName, lastName, email, phoneNumber')
                .withParameters({ sidClientId: clientId })
                .toType('ApplicationUser')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [Client Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getClientProducts(clientId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;
            
            //console.log(clientId);

            return EntityQuery.from('ClientProducts')
                .select('id, sidClientId, sidCardTypeId, variant, name, hasImage')
                .withParameters({ clientId: clientId })
                .toType('SidProduct')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                //console.log(entity);
                //self.log('Retrieved [Product Partials] from remote data source', data.results.length, true);
                return entity;
            }
        }

        function getAllClientProducts(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('AllClientProducts')
                .select('id, sidClientId, sidCardTypeId, name')
                .toType('SidProduct')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [Product Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getClientVaultReports(sidProductId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('ClientVaultReports')
                .select('id, sidProductId, openingStock, closingStock, modifiedOn')
                .withParameters({ sidProductId: sidProductId })
                .toType('ClientVaultReport')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [Product Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getClientVaultReportByTrackerId(trackerId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('ClientVaultReportByTrackerId')
                .select('id, sidProductId, openingStock, closingStock, modifiedOn')
                .withParameters({ trackerId: trackerId })
                .toType('ClientVaultReport')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [Product Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getClientStockReports(sidProductId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('ClientStockReports')
                .select('id, sidProductId, qtyIssued, wasteQty, returnQty, openingStock, closingStock, createdOn, clientVaultReportId, fileName')
                .withParameters({ sidProductId: sidProductId })
                .toType('ClientStockReport')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [StockReport Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getClientStockLogByStockReportId(stockReportId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('ClientStockLogByStockReportId')
                .select('id, clientStockReportId, cardIssuanceId, issuanceQty, openingStock, closingStock')
                .withParameters({ stockReportId: stockReportId })
                .toType('ClientStockLog')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [ClientStockLog Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


        function getClientReturnLogs(sidProductId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('ClientReturnLogByProductId')
                .select('id, clientStockReportId, issuanceQty, openingStock, closingStock')
                .withParameters({ sidProductId: sidProductId })
                .toType('ClientReturnLog')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [ClientReturnLog Partials] from remote data source', entity.length, true);
                return entity;
            }
        }


        function getClientStockReportByTrackerId(trackerId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('ClientStockReportByTrackerId')
                .select('id, sidProductId')
                .withParameters({ trackerId: trackerId })
                .toType('ClientStockReport')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [StockReport Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function _fullNamePredicate(filterValue) {
            return Predicate
                .create('name', 'contains', filterValue)
                .or('name', 'contains', filterValue);
        }

        // By ID
        function getReceiptLogByRequestId(requestId, forceRemote) {
            var self = this;
            var entity;
            var orderBy;

            return EntityQuery.from('EmbedCardReceiptLogs')
                .select('id, embedCardRequestId, lotNumber, quantity, sIDReceiverId, supplierName, timeOfReceipt, vendorId')
                .withParameters({ requestId: requestId })
                .orderBy(orderBy)
                .toType(entityNames.embedCardReceipt)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                //console.log(data);
                entity = self._setIsPartialTrue(data.results);
                self._areItemsLoaded(true);
                //self.log('Retrieved [EmbedCardReceiptLogs Partials] from remote data source', entity.length, true);
                return entity;
            }
        }



        // MIS Reports
        function getAllCardIssuances(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('AllCardIssuances')
                .select('id, jobId, totalQuantity, totalQuantityIssued, totalQuantityRemain, totalWaste, totalHeld')
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

        function getCardIssuanceByStockLog(stockReportId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('CardIssuanceByStockLog')
                .select('id, jobId, totalQuantity, totalQuantityIssued, totalQuantityRemain, totalWaste, totalHeld')
                .withParameters({ stockReportId: stockReportId })
                .toType('CardIssuance')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                return entity;
            }
        }

        function getJobByCardIssuanceId(stockReportId, forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('JobByCardIssuanceId')
                .select('id, jobName, createdOn')
                .withParameters({ stockReportId: stockReportId })
                .toType('Job')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                return entity;
            }
        }


        function getAllStockReports(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('StockReports')
                .select('id, sidProductId, clientVaultReportId, fileName, qtyIssued, wasteQty, returnQty, openingStock, closingStock, createdOn')
                .toType('ClientStockReport')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [StockReport Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getAllIssuanceReports(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('AllCardIssuances')
                .select('id, jobId, jobTrackerId, totalQuantity, totalQuantityIssued, totalQuantityRemain, totalWaste, totalHeld, issuanceId, collectorId')
                .toType('CardIssuance')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [StockReport Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function getAllCardWasteReports(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('AllCardWasteAnalysis')
                .select('id, jobTrackerId, jobSplitId, jobSplitCEAnalysisId, quantityBad, wasteErrorSourceId, wasteByUnitId, isCardCollected, createdById, createdOn')
                .toType('CardWasteAnalysis')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [CardWasteAnalysis Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function AllDeliveryNotes(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('AllDeliveryNotes')
                .select('id, sidClientId, deliveryProfileId, description, createdById, transactionDate, auditStatus, customerServiceStatus')
                .toType('DeliveryNote')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [DeliveryNote Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function AllClientVaultReports(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('AllClientVaultReports')
                .select('id, sidProductId, openingStock, closingStock, modifiedOn')
                .toType('ClientVaultReport')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [ClientVaultReport Partials] from remote data source', entity.length, true);
                return entity;
            }
        }

        function AllCardReceiptReports(forceRemote) {
            var self = this;
            var entity = [];
            var orderBy;

            return EntityQuery.from('AllCardReceiptReports')
                .select('id, sidProductId, embedCardRequestId, clientVaultReportId, vendorId, sIDReceiverId, supplierName, lotNumber, quantity, timeOfReceipt')
                .toType('EmbedCardReceipt')
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                entity = data.results;
                self._areItemsLoaded(true);
                //self.log('Retrieved [ClientVaultReport Partials] from remote data source', entity.length, true);
                return entity;
            }
        }
        



    }
})();