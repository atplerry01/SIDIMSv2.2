(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'model';

    // Define the factory on the module.
    // Inject the dependencies. 
    // Point to the factory definition function.
    angular.module('app').factory(serviceId, ['$routeParams', 'common', 'resourceService', model]);

    function model($routeParams, common, resourceService) {
        var nulloDate = new Date(1900, 0, 1);
        var $q = common.$q;

        // Define the functions and properties to reveal.
        var entityNames = {
            person: 'ApplicationUser',
            accountType: 'ApplicationAccountType',
            serverJobQueue: 'ServerJobQueue',

            job: 'Job',
            jobSplit: 'JobSplit',
            jobSplitCEAnalysis: 'JobSplitCEAnalysis',
            jobSplitPrintCEAnalysis: 'JobSplitPrintCEAnalysis',
            jobSplitQCAnalysis: 'JobSplitQCAnalysis',
            jobSplitPrintQCAnalysis: 'JobSplitPrintQCAnalysis',
            jobTracker: 'JobTracker',
            jobBatchTracker: 'JobBatchTracker',
            wasteErrorSource: 'WasteErrorSource',
            wasteErrorSourceCode : 'WasteErrorSourceCode',

            department: 'Department',
            sidSector: 'SidSector',
            sidCardType: 'SidCardType',
            sidChipTypes: 'SidChipType',
            SidFeature: 'SidFeature',
            sidClient: 'SidClient',
            sidVariant: 'SidVariant',
            sidProduct: 'SidProduct',
            sidMachine: 'SidMachine',
            sidPrintMachine: 'SidPrintMachine',
            vendor: 'Vendor',
            mailingMode: 'MailingMode',

            embedCardReceipt: 'EmbedCardReceipt',

            cardrequest: 'EmbedCardRequest',
            cardreceipt: 'EmbedCardReceipt',
            cardDelivery: 'CardDelivery',
            cardDeliveryLog: 'CardDeliveryLog',

            jobFlag: 'JobFlag',
            flagType: 'FlagType',
            jobStatus: 'JobStatus',
            serviceType: 'ServiceType',
            status: 'Status',
            remark: 'Remark',
            priority: 'Priority',

            cardIssuance: 'CardIssuance',
            cardIssuanceLog: 'CardIssuanceLog',
            cardWasteAnalysis: 'CardWasteAnalysis',
            printWasteAnalysis: 'PrintWasteAnalysis',
            deliveryNote: 'DeliveryNote',
            wasteDeliveryNote: 'WasteDeliveryNote',
            deliveryProfile: 'DeliveryProfile'
        };

        var resourceUri = {
            accounts: 'api/accounts',
            common: 'api/common',
            lookups: 'api/lookups',
            ce: 'api/ce',
            co: 'api/co',
            cs: 'api/customer-services',
            inventory: 'api/inventory',
            qac: 'api/qac',
            ma: 'api/mailing',
            dispatch: 'api/dispatch',
            printing: 'api/printing',
            materialaudit: 'api/material-audits',
            rm: 'api/relationship-manager',
            supervisor: 'api/supervisor',
            sadmin: 'api/sadmin',

            product: 'api/products'
        };

        var service = {
            configureMetadataStore: configureMetadataStore,
            createNullos: createNullos,
            entityNames: entityNames,
            resourceUri: resourceUri
        };

        return service;

        function configureMetadataStore(metadataStore) {
            registerPerson(metadataStore);
            registerServerJobQueue(metadataStore);
            registerJob(metadataStore);
            registerJobTracker(metadataStore);
            registerCardIssuanceLog(metadataStore);
            registerDeliveryNote(metadataStore);
            registerWasteDeliveryNote(metadataStore);
            registerClientStockReport(metadataStore);
        }

        function createNullos(manager) {
            var unchanged = breeze.EntityState.Unchanged;

            createNullo(entityNames.timeslot, { start: nulloDate, isSessionSlot: true });
            createNullo(entityNames.room);
            createNullo(entityNames.speaker, { firstName: ' [Select a person]' });
            createNullo(entityNames.track);

            function createNullo(entityName, values) {
                var initialValues = values || { name: ' [Select a ' + entityName.toLowerCase() + ']' };
                return manager.createEntity(entityName, initialValues, unchanged);
            }
        }

        //#region Internal Methods        
      
        function registerPerson(metadataStore) {
            metadataStore.registerEntityTypeCtor('ApplicationUser', ApplicationUser);

            function ApplicationUser() {
                this.isPartial = false;
                this.isStaff = false;
                this.isAccountType = null;

                this.isPartial = false;
                this.isAdmin = false;
                this.isManagement = false;
                this.isLibrarian = false;
                this.isAccountant = false;
                this.isTeacher = false;
                this.isStudent = false;
                this.isParent = false;

            }

            Object.defineProperty(ApplicationUser.prototype, 'fullName', {
                get: function () {
                    var fn = this.firstName;
                    var ln = this.lastName;
                    return ln ? fn + ' ' + ln : fn;
                }
            });

            Object.defineProperty(ApplicationUser.prototype, 'formattedDate', {
                get: function () {
                    var date = this.joinDate;
                    var value = moment.utc(date).format('llll'); //MMMM Do YYYY, h:mm:ss a
                    return value;
                }
            });

            Object.defineProperty(ApplicationUser.prototype, 'fullFormattedDate', {
                get: function () {
                    var date = this.createdOn;
                    var value = moment.utc(date).format('LLLL');
                    return value;
                }
            });

            // Todo
            Object.defineProperty(ApplicationUser.prototype, 'accountType', {
                get: function () {
                    var accountType = this.applicationUserAccountTypeList;
                    //console.log(accountType);
                    return accountType;
                }
            });

        }

        // ServerJobs
        function registerServerJobQueue(metadataStore) {
            metadataStore.registerEntityTypeCtor('ServerJobQueue', ServerJobQueue);

            function ServerJobQueue() { }

            Object.defineProperty(ServerJobQueue.prototype, 'formattedDate', {
                get: function () {
                    var date = this.createdOn;
                    var value = moment.utc(date).fromNow();
                    //.format('ddd h:mm a'); //MMMM Do YYYY, h:mm:ss a
                    //moment("20111031", "YYYYMMDD").fromNow();
                    return value;
                }
            });
        }

        //JobTracker
        function registerJobTracker(metadataStore) {
            metadataStore.registerEntityTypeCtor('JobTracker', JobTracker);

            function JobTracker() { }

            Object.defineProperty(JobTracker.prototype, 'formattedDate', {
                get: function () {
                    var date = this.createdOn;
                    var value = moment.utc(date).format('l h:mm a'); //ddd //MMMM Do YYYY, h:mm:ss a
                    return value;
                }
            });

            Object.defineProperty(JobTracker.prototype, 'modifiedFormattedDate', {
                get: function () {
                    var date = this.modifiedOn;
                    var value = moment.utc(date).format('l h:mm a'); //ddd //MMMM Do YYYY, h:mm:ss a
                    return value;
                }
            });

            Object.defineProperty(JobTracker.prototype, 'fullFormattedDate', {
                get: function () {
                    var date = this.createdOn;
                    var value = moment.utc(date).format('LLLL');
                    return value;
                }
            });
        }

        // Jobs
        function registerJob(metadataStore) {
            metadataStore.registerEntityTypeCtor('Job', Job);

            function Job() { }

            Object.defineProperty(Job.prototype, 'formattedDate', {
                get: function () {
                    var date = this.createdOn;
                    var value = moment.utc(date).format('l h:mm a'); //MMMM Do YYYY, h:mm:ss a
                    return value;
                }
            });

            Object.defineProperty(Job.prototype, 'fullFormattedDate', {
                get: function () {
                    var date = this.createdOn;
                    var value = moment.utc(date).format('LLLL');
                    return value;
                }
            });
        }

        //DeliveryNote
        function registerDeliveryNote(metadataStore) {
            metadataStore.registerEntityTypeCtor('DeliveryNote', DeliveryNote);

            function DeliveryNote() { }

            Object.defineProperty(DeliveryNote.prototype, 'formattedDate', {

                get: function () {
                    var date = this.transactionDate;
                    var value = moment.utc(date).format('L'); //MMMM Do YYYY, h:mm:ss a
                    return value;
                }
            });

            Object.defineProperty(DeliveryNote.prototype, 'fullFormattedDate', {
                get: function () {
                    var date = this.createdOn;
                    var value = moment.utc(date).format('LLLL');
                    return value;
                }
            });
        }

        //DeliveryNote
        function registerWasteDeliveryNote(metadataStore) {
            metadataStore.registerEntityTypeCtor('WasteDeliveryNote', WasteDeliveryNote);

            function WasteDeliveryNote() { }

            Object.defineProperty(WasteDeliveryNote.prototype, 'formattedDate', {

                get: function () {
                    var date = this.transactionDate;
                    var value = moment.utc(date).format('L'); //MMMM Do YYYY, h:mm:ss a
                    return value;
                }
            });

            Object.defineProperty(WasteDeliveryNote.prototype, 'fullFormattedDate', {
                get: function () {
                    var date = this.createdOn;
                    var value = moment.utc(date).format('LLLL');
                    return value;
                }
            });
        }

        // Issuance
        function registerCardIssuanceLog(metadataStore) {
            metadataStore.registerEntityTypeCtor('CardIssuanceLog', CardIssuanceLog);

            function CardIssuanceLog() {
                this.isPartial = false;
            }

            Object.defineProperty(CardIssuanceLog.prototype, 'formattedDate', {
                get: function () {
                    var date = this.issuedDate;
                    var value = moment.utc(date).format('llll'); //MMMM Do YYYY, h:mm:ss a
                    return value;
                }
            });

            Object.defineProperty(CardIssuanceLog.prototype, 'fullFormattedDate', {
                get: function () {
                    var date = this.createdOn;
                    var value = moment.utc(date).format('LLLL');
                    return value;
                }
            });

        }

        //ClientStockReport
        function registerClientStockReport(metadataStore) {
            metadataStore.registerEntityTypeCtor('ClientStockReport', ClientStockReport);

            function ClientStockReport() {
                this.isPartial = false;
            }

            Object.defineProperty(ClientStockReport.prototype, 'formattedDate', {
                get: function () {
                    var date = this.issuedDate;
                    var value = moment.utc(date).format('ll'); //MMMM Do YYYY, h:mm:ss a
                    return value;
                }
            });

        }

    }
})();