(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());


    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', 'ASSETS', routeConfigurator]);
    function routeConfigurator($routeProvider, routes, ASSETS) {

        routes.forEach(function (r) {
            //$routeProvider.when(r.url, r.config);
            setRoute(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });

        function setRoute(url, definition) {
            // Sets resolvers for all of the routes
            // by extending any existing resolvers (or creating a new one).
            definition.resolve = angular.extend(definition.resolve || {}, {
                prime: prime
            });
            $routeProvider.when(url, definition);
            return $routeProvider;
        }
    }

    prime.$inject = ['datacontext'];
    function prime(dc) { return dc.prime(); }

    getRoutes.$inject = ['$ocLazyLoad', 'ASSETS'];
    // Define the routes 
    function getRoutes($ocLazyLoad, ASSETS) {

        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    controller: 'dashboard',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    },
                    resolve: {
                        resources: function ($ocLazyLoad, ASSETS) {
                            return $ocLazyLoad.load([
                                ASSETS.charts.dxGlobalize,
                            ]);
                        },
                        dxCharts: function ($ocLazyLoad, ASSETS) {
                            return $ocLazyLoad.load([
                                ASSETS.charts.dxCharts,
                            ]);
                        },
                    }
                }
            }, {
                url: '/job-status',
                config: {
                    title: 'Job',
                    templateUrl: 'app/dashboard/jobstatus.html',
                    controller: 'JobStatus',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/flagged-jobs',
                config: {
                    title: 'Job',
                    templateUrl: 'app/dashboard/flaggedjob.html',
                    controller: 'FlaggedJob',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/flagged-resolved',
                config: {
                    title: 'Job',
                    templateUrl: 'app/dashboard/resolvedflagjob.html',
                    controller: 'ResolvedJob',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/job/audit-trail/:trackerId',
                config: {
                    title: 'Job',
                    templateUrl: 'app/dashboard/jobstatusdetail.html',
                    controller: 'JobStatusDetail',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/job-flag/:trackerId',
                config: {
                    title: 'Job',
                    templateUrl: 'app/dashboard/jobflag.html',
                    controller: 'JobFlag',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { /// Supvervisor
                url: '/sup/co/incoming-jobs',
                config: {
                    title: 'Job',
                    templateUrl: 'app/supervisor/co/co-job.sv.html',
                    controller: 'JobCOSupv',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/sup/co/job-setup/:id',
                config: {
                    title: 'Job',
                    templateUrl: 'app/supervisor/co/co-jobsetup.sv.html',
                    controller: 'JobSetupCOSupv',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/sup/flaggedjobs',
                config: {
                    title: 'Job',
                    templateUrl: 'app/supervisor/flaggedjob.sv.html',
                    controller: 'FlaggedJobSV',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/sup/resolvedissues',
                config: {
                    title: 'Job',
                    templateUrl: 'app/supervisor/resolvedjob.sv.html',
                    controller: 'ResolvedJobSV',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/sup/pending-jobs',
                config: {
                    title: 'Job',
                    templateUrl: 'app/supervisor/jobstatusreport/pending.sv.html',
                    controller: 'PendingSv',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/sup/pending/recent-jobs',
                config: {
                    title: 'Job',
                    templateUrl: 'app/supervisor/jobstatusreport/pendingjobs/recentpendingjobs.sv.html',
                    controller: 'RecentPendingJobSv',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/sup/pending/older-jobs',
                config: {
                    title: 'Job',
                    templateUrl: 'app/supervisor/jobstatusreport/pendingjobs/olderpendingjobs.sv.html',
                    controller: 'OlderPendingJobSv',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/sup/completed/recent-jobs',
                config: {
                    title: 'Job',
                    templateUrl: 'app/supervisor/jobstatusreport/completedjobs/recentcompletedjobs.sv.html',
                    controller: 'RecentCompletedJobSv',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/sup/completed/older-jobs',
                config: {
                    title: 'Job',
                    templateUrl: 'app/supervisor/jobstatusreport/completedjobs/oldercompletedjobs.sv.html',
                    controller: 'OlderCompletedJobSv',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/sup/older-jobs',
                config: {
                    title: 'Job',
                    templateUrl: 'app/supervisor/jobstatusreport/olderjob.sv.html',
                    controller: 'OlderJobSv',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/change-password',
                config: {
                    title: 'Job',
                    templateUrl: 'app/account/changepassword.html',
                    controller: 'ChangePassword',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/login',
                config: {
                    title: 'Account Login',
                    templateUrl: 'app/login/login.html',
                    controller: 'login',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    },
                    resolve: {
                        resources: function ($ocLazyLoad, ASSETS) {
                            return $ocLazyLoad.load([
                                ASSETS.forms.jQueryValidate,
                                ASSETS.extra.toastr,
                            ]);
                        },
                    }
                }
            }, { // Start of CardOps
                url: '/co/jobs',
                config: {
                    title: 'Job',
                    templateUrl: 'app/cardops/job/job.co.html',
                    controller: 'JobCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/job/:id',
                config: {
                    title: 'Job',
                    templateUrl: 'app/cardops/job/jobdetail.co.html',
                    controller: 'JobDetailCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/pending-jobs',
                config: {
                    title: 'Job',
                    templateUrl: 'app/cardops/job/pendingjob.co.html',
                    controller: 'PendingJobCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/deleted-jobs',
                config: {
                    title: 'Job',
                    templateUrl: 'app/cardops/job/deletedjob.co.html',
                    controller: 'DeletedJobCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/reverted-jobs',
                config: {
                    title: 'Job',
                    templateUrl: 'app/cardops/job/reverted-job.co.html',
                    controller: 'DeletedJobCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/nonperso-jobs',
                config: {
                    title: 'Job',
                    templateUrl: 'app/cardops/job/nonpersojob.co.html',
                    controller: 'NonPersoJobCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/nonperso-job/:id',
                config: {
                    title: 'Job',
                    templateUrl: 'app/cardops/job/nonpersojobsetup.co.html',
                    controller: 'NonPersoJobSetupCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/job-lists',
                config: {
                    title: 'Job Lists',
                    templateUrl: 'app/cardops/job/co-joblist.html',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { // Todo
                url: '/co/job-setups',
                config: {
                    title: 'Job Setups',
                    templateUrl: 'app/cardops/job/jobsetup.co.html',
                    controller: 'JobSetupCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { // Todo
                url: '/co/job-setup/:id',
                config: {
                    title: 'Job Setups',
                    templateUrl: 'app/cardops/job/jobsetup.co.html',
                    controller: 'JobSetupCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/job-setup-update/:id',
                config: {
                    title: 'Job Setups',
                    templateUrl: 'app/cardops/job/jobsetupupdate.co.html',
                    controller: 'JobSetupUpdateCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/job-service-update/:id',
                config: {
                    title: 'Job Setups',
                    templateUrl: 'app/cardops/job/jobserviceupdate.co.html',
                    controller: 'JobServiceUpdateCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/lookups/card-variants',
                config: {
                    title: 'Card Variant',
                    templateUrl: 'app/cardops/lookup/co-cardvariant.html',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/lookups/clients',
                config: {
                    title: 'Card Type',
                    templateUrl: 'app/cardops/lookup/client.co.html',
                    controller: 'ClientCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/lookups/client/:id',
                config: {
                    title: 'Card Type',
                    templateUrl: 'app/cardops/lookup/client.co.html',
                    controller: 'ClientCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/lookups/card-types',
                config: {
                    title: 'Card Type',
                    templateUrl: 'app/cardops/lookup/cardtypedetail.co.html',
                    controller: 'CardTypeDetailCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/lookups/card-type/:id',
                config: {
                    title: 'Card Type Details',
                    templateUrl: 'app/cardops/lookup/cardtypedetail.co.html',
                    controller: 'CardTypeDetailCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/lookups/remarks',
                config: {
                    title: 'Card Type',
                    templateUrl: 'app/cardops/lookup/remark.co.html',
                    controller: 'RemarkCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/lookups/remark/:id',
                config: {
                    title: 'Card Type',
                    templateUrl: 'app/cardops/lookup/remark.co.html',
                    controller: 'RemarkCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/lookups/card-variants',
                config: {
                    title: 'Card Variant',
                    templateUrl: 'app/cardops/lookup/cardvariant.co.html',
                    controller: 'CardVariantCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/lookups/card-variant/:id',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardops/lookup/cardvariant.co.html',
                    controller: 'CardVariantCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/lookups/dictionary',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardops/lookup/dictionary.co.html',
                    controller: 'DictionaryCO',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/job-archives',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/cardops/job/jobarchive.co.html', //Todo
                    controller: 'JobArchiveIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/joblists',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/cardops/job/joblist.co.html', //Todo
                    controller: 'JobListIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/co/flagged-jobs',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/cardops/flagjob/unitflaggedjob.co.html', //Todo
                    controller: 'UnitFlaggedJob',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { // Start of Inventory Management Page
                url: '/in/incoming-jobs',
                config: {
                    title: 'Incoming Jobs',
                    templateUrl: 'app/inventory/job/incoming-job.in.html',
                    controller: 'IncomingJobIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/card-setup/:trackerId',
                config: {
                    title: 'Incoming Jobs',
                    templateUrl: 'app/inventory/job/card-setupdetail.in.html',
                    controller: 'CardSetupDetailIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/card-product/:trackerId',
                config: {
                    title: 'Incoming Jobs',
                    templateUrl: 'app/inventory/job/card-productdetail.in.html',
                    controller: 'CardProductSetupDetailIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/partial-jobs',
                config: {
                    title: 'Partial Jobs',
                    templateUrl: 'app/inventory/job/partial-job.in.html',
                    controller: 'PartialJobIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/partial-issuance/:cardIssuanceId',
                config: {
                    title: 'Partial Jobs',
                    templateUrl: 'app/inventory/job/card-partial-issuancedetail.in.html',
                    controller: 'CardPartialIssuanceDetailInventIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/joblists',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/inventory/job/joblist.in.html',
                    controller: 'JobListIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/waste-jobs',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/inventory/job/waste-job.in.html',
                    controller: 'WasteJobIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/print-waste-jobs',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/inventory/job/print-waste-job.in.html',
                    controller: 'PrintWasteJobIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/waste-issuance/:wasteAnalysisId',
                config: {
                    title: 'Waste Issuance',
                    templateUrl: 'app/inventory/job/card-waste-issuancedetail.in.html',
                    controller: 'CardWasteIssuanceDetailInventIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/print-waste-issuance/:wasteAnalysisId',
                config: {
                    title: 'Waste Issuance',
                    templateUrl: 'app/inventory/job/print-waste-issuancedetail.in.html',
                    controller: 'PrintWasteIssuanceDetailInventIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/waste-job-log/:id',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/inventory/job/waste-joblog.in.html',
                    controller: 'WasteJobLogIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/incoming-heldcards',
                config: {
                    title: 'held cards',
                    templateUrl: 'app/inventory/job/incomingheldcards.in.html',
                    controller: 'IncomingHeldCardIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/incoming-heldprints',
                config: {
                    title: 'held cards',
                    templateUrl: 'app/inventory/job/incomingheldprints.in.html',
                    controller: 'IncomingHeldPrintIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/held-card/:id',
                config: {
                    title: 'held cards',
                    templateUrl: 'app/inventory/job/held-carddetail.in.html',
                    controller: 'HeldCardDetailIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/partial-card-issuance/:id',
                config: {
                    title: 'Partial Card Issuance',
                    templateUrl: 'app/inventory/job/card-issuance-partialdetail.in.html',
                    controller: 'CardIssuancePartialDetailInventIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/card-issuance/:trackerId',
                config: {
                    title: 'Incoming Jobs',
                    templateUrl: 'app/inventory/job/card-issuancedetail.in.html',
                    controller: 'CardIssuanceDetailInventIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/card-issuance-logs',
                config: {
                    title: 'Card Issuance',
                    templateUrl: 'app/inventory/job/card-issuance-log.in.html',
                    controller: 'CardIssuanceLogInventIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/card-issuance-log/:id',
                config: {
                    title: 'Card Issuance',
                    templateUrl: 'app/inventory/job/card-issuance-logdetail.in.html',
                    controller: 'CardIssuanceLogDetailInventIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/black-cards',
                config: {
                    title: 'Blank Card Issuance',
                    templateUrl: 'app/inventory/job/nonpersojob.in.html',
                    controller: 'NonPersoJobIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { // Stock Mgt
                url: '/in/card/item-logs',
                config: {
                    title: 'CardItemLog',
                    templateUrl: 'app/inventory/stockmgt/card-item-logs.in.html',
                    controller: 'CardItemLogIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/card/low-stocks',
                config: {
                    title: 'CardLowStock',
                    templateUrl: 'app/inventory/stockmgt/card-low-stock.in.html',
                    controller: 'CardLowStockIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/card/card-history',
                config: {
                    title: 'CardHistory',
                    templateUrl: 'app/inventory/stockmgt/card-history.in.html',
                    controller: 'CardHistoryIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/stationary/item-logs',
                config: {
                    title: 'StationaryItemLog',
                    templateUrl: 'app/inventory/stockmgt/stationary-item-logs.in.html',
                    controller: 'StationaryItemLogIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/stationary/low-stocks',
                config: {
                    title: 'StationaryLowStock',
                    templateUrl: 'app/inventory/stockmgt/stationary-item-logs.in.html',
                    controller: 'StationaryLowStockIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/stationary/stationary-history',
                config: {
                    title: 'StationaryHistory',
                    templateUrl: 'app/inventory/stockmgt/stationary-history.in.html',
                    controller: 'StationaryHistoryIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { // Start of Waste Mgt
                url: '/in/waste/card-requests',
                config: {
                    title: 'WasteCardRequest',
                    templateUrl: 'app/inventory/wastemgt/card-request.in.html',
                    controller: 'WasteCardRequestIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/waste/card-history',
                config: {
                    title: 'WasteCardHistory',
                    templateUrl: 'app/inventory/wastemgt/card-history.in.html',
                    controller: 'WasteCardHistoryIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/waste/stationary-requests',
                config: {
                    title: 'WasteStationaryRequest',
                    templateUrl: 'app/inventory/wastemgt/stationary-request.in.html',
                    controller: 'WasteStationaryRequestIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/waste/stationary-history',
                config: {
                    title: 'WasteStationaryHistory',
                    templateUrl: 'app/inventory/wastemgt/stationary-history.in.html',
                    controller: 'WasteStationaryHistoryIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { // Start of Inventory
                url: '/in/inventory/vault-products',
                config: {
                    title: 'InventCardRequest',
                    templateUrl: 'app/inventory/stock/stock-product-lists.in.html',
                    controller: 'StockCardProductListIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/inventory/vault-product/:id',
                config: {
                    title: 'InventCardRequest',
                    templateUrl: 'app/inventory/stock/stock-productdetail.in.html',
                    controller: 'StockCardProductDetailIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/inventory/vault-product/:id/MISReport',
                config: {
                    title: 'InventCardRequest',
                    templateUrl: 'app/inventory/stock/stock-product-mis.in.html',
                    controller: 'StockCardProductMISIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/inventory/vault-product/:id/request/:requestId',
                config: {
                    title: 'InventCardRequest',
                    templateUrl: 'app/inventory/stock/stock-productrequest.in.html',
                    controller: 'StockCardProductRequestIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/inventory/vault-product/:id/request/:requestId/receipt',
                config: {
                    title: 'InventCardRequest',
                    templateUrl: 'app/inventory/stock/stock-productreceipt.in.html',
                    controller: 'StockCardProductReceiptIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/inventory/vault-product/:id/receipt',//
                config: {
                    title: 'InventCardRequest',
                    templateUrl: 'app/inventory/stock/stock-receipt.in.html',
                    controller: 'StockReceiptIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/inventory/vault-product/:id/receipt/:requestId',
                config: {
                    title: 'InventCardRequest',
                    templateUrl: 'app/inventory/stock/stock-receiptdetail.in.html',
                    controller: 'StockReceiptDetailIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/inventory/card-requests',
                config: {
                    title: 'InventCardRequest',
                    templateUrl: 'app/inventory/inventory/card-request.in.html',
                    controller: 'InventoryCardRequestIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/inventory/card-request/:id',
                config: {
                    title: 'InventCardRequest',
                    templateUrl: 'app/inventory/inventory/card-requestdetail.in.html',
                    controller: 'InventoryCardRequestDetailIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/inventory/card-request/:id/receiptlogs',
                config: {
                    title: 'InventCardReceiptlog',
                    templateUrl: 'app/inventory/inventory/card-receiptlog.in.html',
                    controller: 'InventCardReceiptLogIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/inventory/card-request/:id/receiptlog/:rid',
                config: {
                    title: 'InventCardReceiptlog',
                    templateUrl: 'app/inventory/inventory/card-receiptlogdetail.in.html',
                    controller: 'InventCardReceiptLogDetailIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/inventory/card-receipt/:id',
                config: {
                    title: 'InventCardReceipt',
                    templateUrl: 'app/inventory/inventory/card-receiptdetail.in.html',
                    controller: 'InventCardReceiptDetailIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/inventory/stationary-requests',
                config: {
                    title: 'InventStationaryRequest',
                    templateUrl: 'app/inventory/inventory/stationary-request.in.html',
                    controller: 'InventStationaryRequestIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/inventory/stationary-receipts',
                config: {
                    title: 'InventStationaryReceipt',
                    templateUrl: 'app/inventory/inventory/stationary-receipt.in.html',
                    controller: 'InventStationaryReceiptIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { // Start of MIS
                url: '/in/mis/card/product/:clientId/create',
                config: {
                    title: 'MISReportsIN',
                    templateUrl: 'app/inventory/mis/cards/createproduct.in.html',
                    controller: 'MISCreateProductIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/product/:productId/update',
                config: {
                    title: 'MISReportsIN',
                    templateUrl: 'app/inventory/mis/cards/updateproduct.in.html',
                    controller: 'MISUpdateProductIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/product/:productId/image/update',
                config: {
                    title: 'MISReportsIN',
                    templateUrl: 'app/inventory/mis/cards/updateproductimage.in.html',
                    controller: 'MISUpdateProductImageIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/product/:productId/service-type',
                config: {
                    title: 'MISReportsIN',
                    templateUrl: 'app/inventory/mis/cards/createservicetype.in.html',
                    controller: 'MISCreateProductServiceIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { 
                url: '/in/mis/card/mis-reports',
                config: {
                    title: 'MISReportsIN',
                    templateUrl: 'app/inventory/mis/cards/misreports.in.html',
                    controller: 'MISReportsIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/mis-stockreport/:productId',
                config: {
                    title: 'MISReportsIN',
                    templateUrl: 'app/inventory/mis/cards/misstockreports.in.html',
                    controller: 'MISStockReportsIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/vault-update/:productId',
                config: {
                    title: 'MISReportsIN',
                    templateUrl: 'app/inventory/mis/cards/vaultupdate.in.html',
                    controller: 'VaultUpdateIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/mis-reportdetail/:productId',
                config: {
                    title: 'MISReportsIN',
                    templateUrl: 'app/inventory/mis/cards/misreportdetail.in.html',
                    controller: 'MISReportDetailIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/mis-clients',
                config: {
                    title: 'MISCardClientListIN',
                    templateUrl: 'app/inventory/mis/cards/misclients.in.html',
                    controller: 'MISIssuanceReportsIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/mis-client/:clientId',
                config: {
                    title: 'MISCardClientListIN',
                    templateUrl: 'app/inventory/mis/cards/misreports.in.html',
                    controller: 'MISIssuanceReportsIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/mis-client/:clientId/cardtypes',
                config: {
                    title: 'MISCardClientListIN',
                    templateUrl: 'app/inventory/mis/cards/misreports.in.html',
                    controller: 'MISIssuanceReportsIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/mis-client/:clientId/cardtype/:id',
                config: {
                    title: 'MISCardClientListIN',
                    templateUrl: 'app/inventory/mis/cards/misreports.in.html',
                    controller: 'MISIssuanceReportsIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/issuance-reports',
                config: {
                    title: 'MISCardClientListIN',
                    templateUrl: 'app/inventory/mis/cards/issuancereports.in.html',
                    controller: 'MISIssuanceReportsIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/waste-reports',
                config: {
                    title: 'MISCardClientListIN',
                    templateUrl: 'app/inventory/mis/cards/wastereports.in.html',
                    controller: 'MISWasteReportsIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/heldcard-reports',
                config: {
                    title: 'MISCardClientListIN',
                    templateUrl: 'app/inventory/mis/cards/clientlists.in.html',
                    controller: 'MISCardClientListIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/dispatch-reports',
                config: {
                    title: 'MISCardClientListIN',
                    templateUrl: 'app/inventory/mis/cards/dispatchreports.in.html',
                    controller: 'MISDispatchReportsIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/deliverynote-reports',
                config: {
                    title: 'MISCardClientListIN',
                    templateUrl: 'app/inventory/mis/cards/deliverynotereports.in.html',
                    controller: 'MISDeliveryNoteReportsIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/vault-reports',
                config: {
                    title: 'MISCardClientListIN',
                    templateUrl: 'app/inventory/mis/cards/vaultreports.in.html',
                    controller: 'MISVaultReportsIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/receiptlog-reports',
                config: {
                    title: 'MISCardClientListIN',
                    templateUrl: 'app/inventory/mis/cards/receiptlogreports.in.html',
                    controller: 'MISReceiptLogReportsIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/client/:id',
                config: {
                    title: 'MISCardClientListIN',
                    templateUrl: 'app/inventory/mis/cards/update-client.in.html',
                    controller: 'UpdateClientIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/clients',
                config: {
                    title: 'MISCardClientListIN',
                    templateUrl: 'app/inventory/mis/cards/clientlists.in.html',
                    controller: 'MISCardClientListIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/client/:clientId/products',
                config: {
                    title: 'MISCardStockMonitor',
                    templateUrl: 'app/inventory/mis/cards/productlists.in.html',
                    controller: 'MISCardProductListIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/client/:clientId/product/:productId/joblists',
                config: {
                    title: 'MISCardStockMonitor',
                    templateUrl: 'app/inventory/mis/cards/productdetail.in.html',
                    controller: 'MISCardProductDetailIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/client/:clientId/jobs',
                config: {
                    title: 'MISCardStockMonitor',
                    templateUrl: 'app/inventory/mis/card-stock-monitor.in.html',
                    controller: 'MISCardStockMonitorIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { // Start of MIS
                url: '/in/mis/card/stock-monitors',
                config: {
                    title: 'MISCardStockMonitor',
                    templateUrl: 'app/inventory/mis/card-stock-monitor.in.html',
                    controller: 'MISCardStockMonitorIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/client-lists',
                config: {
                    title: 'MISCardStockMonitor',
                    templateUrl: 'app/inventory/mis/card-client-lists.in.html',
                    controller: 'MISCardClientListIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/usage',
                config: {
                    title: 'MISCardUsage',
                    templateUrl: 'app/inventory/mis/card-usage.in.html',
                    controller: 'MISCardUsageIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/card/summary',
                config: {
                    title: 'MISCardSummary',
                    templateUrl: 'app/inventory/mis/card-summary.in.html',
                    controller: 'MISCardSummaryIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/stationary/stock-monitors',
                config: {
                    title: 'MISStationaryStockMonitorIN',
                    templateUrl: 'app/inventory/mis/stationary-stock-monitor.in.html',
                    controller: 'MISStationaryStockMonitorIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/stationary/usuage',
                config: {
                    title: 'MISStationaryUsage',
                    templateUrl: 'app/inventory/mis/card-stock-monitor.in.html',
                    controller: 'MISStationaryUsageIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/mis/stationary/summary',
                config: {
                    title: 'MISStationarySummary',
                    templateUrl: 'app/inventory/mis/stationary-summary.in.html',
                    controller: 'MISStationarySummaryIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { // Lookups
                url: '/in/lookups/products',
                config: {
                    title: 'Card Variant',
                    templateUrl: 'app/inventory/lookup/cardvariant.in.html',
                    controller: 'CardVariantIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/lookups/card-variants',
                config: {
                    title: 'Card Variant',
                    templateUrl: 'app/inventory/lookup/cardvariant.in.html',
                    controller: 'CardVariantIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/lookups/clients',
                config: {
                    title: 'Card Type',
                    templateUrl: 'app/inventory/lookup/sidclient.in.html',
                    controller: 'SidClientIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/lookups/client/:id',
                config: {
                    title: 'Card Type',
                    templateUrl: 'app/inventory/lookup/sidclient.in.html',
                    controller: 'SidClientIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/lookups/card-types',
                config: {
                    title: 'Card Type',
                    templateUrl: 'app/inventory/lookup/cardtypedetail.in.html',
                    controller: 'CardTypeDetailIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/lookups/card-type/:id',
                config: {
                    title: 'Card Type Details',
                    templateUrl: 'app/inventory/lookup/cardtypedetail.in.html',
                    controller: 'CardTypeDetailIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/lookups/remarks',
                config: {
                    title: 'Card Type',
                    templateUrl: 'app/inventory/lookup/remark.in.html',
                    controller: 'RemarkIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/lookups/remark/:id',
                config: {
                    title: 'Card Type',
                    templateUrl: 'app/inventory/lookup/remark.in.html',
                    controller: 'RemarkIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/lookups/card-variants',
                config: {
                    title: 'Card Variant',
                    templateUrl: 'app/inventory/lookup/cardvariant.in.html',
                    controller: 'CardVariantIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/lookups/card-variant/:id',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/inventory/lookup/cardvariant.in.html',
                    controller: 'CardVariantIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/dispatch/incoming-jobs',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/inventory/dispatch/incoming-job.dp.html',
                    controller: 'IncomingDeliveryIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/dispatch/client-jobs/:clientId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/inventory/dispatch/client-job.dp.html',
                    controller: 'ClientJobDP',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/dispatch/client-wastes/:clientId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/inventory/dispatch/client-waste.dp.html',
                    controller: 'ClientWasteDP',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/dispatch/receive-job/:id',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/inventory/dispatch/confirm-receipt.dp.html',
                    controller: 'ConfirmReceiptDPIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/dispatch/delivery-notes',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/inventory/dispatch/delivery-note.dp.html',
                    controller: 'DeliveryNoteIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/dispatch/delivery-reports',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/inventory/dispatch/delivery-report.dp.html',
                    controller: 'DeliveryReportIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/dispatch/delivery-report/:id',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/inventory/dispatch/delivery-reportdetail.dp.html',
                    controller: 'DeliveryReportDetailIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/dispatch/waste-reports',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/inventory/dispatch/waste-report.dp.html',
                    controller: 'WasteReportIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/dispatch/waste-report/:id',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/inventory/dispatch/waste-reportdetail.dp.html',
                    controller: 'WasteReportDetailIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/in/flagged-jobs',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/inventory/flagjob/unitflaggedjob.in.html', //Todo
                    controller: 'UnitFlaggedJobIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/au/incoming-jobs',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/materialaudit/incoming-job.au.html',
                    controller: 'IncomingJobMAU',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/au/driver-assignment/:reportId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/materialaudit/driverassignment.au.html',
                    controller: 'DriverAssignmentAU',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/au/flag-jobs',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/inventory/dispatch/delivery-reportdetail.dp.html',
                    controller: 'DeliveryReportDetailIN',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/cs/incoming-jobs',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/CS/incoming-job.cs.html',
                    controller: 'IncomingJobCS',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/cs/jobdetail/:deliveyNoteId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/CS/jobdetail.cs.html',
                    controller: 'JobDetailCS',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/cs/flagged-jobs',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/cs/flagjob/unitflaggedjob.cs.html', //Todo
                    controller: 'UnitFlaggedJobCS',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { // Printing
                url: '/pr/incoming-print',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/printing/incoming-print.pr.html',
                    controller: 'IncomingPrintPR',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/pr/print-job/:trackerId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/printing/printdetail.pr.html',
                    controller: 'PrintDetailPR',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/pr/print-analysis',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/printing/printanalysis.pr.html',
                    controller: 'PrintAnalysisPR',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/pr/print-analysis/:trackerId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/printing/printanalysisdetail.pr.html',
                    controller: 'PrintAnalysisDetailPR',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/pr/print-deliverables',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/printing/printdeliverable.pr.html',
                    controller: 'PrintDeliverablePR',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/pr/flagged-jobs',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/printing/flagjob/unitflaggedjob.pr.html', //Todo
                    controller: 'UnitFlaggedJobPR',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/pr/print-mis',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/printing/print-misreport.pr.html',
                    controller: 'PrintMISReportPR',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/pr/card-delivery-reports',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/printing/carddeliveryreport.pr.html',
                    controller: 'CardDeliveryReportPR',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { // Card Engr
                url: '/ce/incoming-perso',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardengr/incoming-perso.ce.html',
                    controller: 'IncomingPersoCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ce/resumable/new-perso',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardengr/resumable-newperso.ce.html',
                    controller: 'ResumableNewPersoCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ce/resumable/new-perso/:id',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardengr/resumable-newpersodetail.ce.html',
                    controller: 'ResumableNewPersoDetailCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ce/resumable/pending-perso',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardengr/resumable-pendingperso.ce.html',
                    controller: 'ResumablePendingPersoCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ce/resumable/pending-perso/:id',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardengr/resumable-pendingpersodetail.ce.html',
                    controller: 'ResumablePendingPersoDetailCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ce/resumable/partial-perso',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardengr/resumable-partialperso.ce.html',
                    controller: 'ResumablePartialPersoCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ce/first-card/:trackerId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardengr/firstcarddeatil.ce.html',
                    controller: 'FirstCardPersoCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ce/incoming-prints',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardengr/incoming-print.ce.html',
                    controller: 'IncomingPrintCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ce/batch/:batchId/issuance-confirmation/:id', //(IssuanceLogId)
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardengr/issuance-confirmation.ce.html',
                    controller: 'IssuanceConfirmationCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ce/job-archives',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardengr/report/jobarchive.ce.html',
                    controller: 'JobArchiveCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ce/card-misreports',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardengr/report/cardmisreport.ce.html',
                    controller: 'CardMISReportCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ce/card-deivery-reports',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardengr/report/carddeliveryreport.ce.html',
                    controller: 'CardDeliveryReportCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ce/card-deliveryreports',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardengr/report/carddeliveryreport.ce.html',
                    controller: 'CardDeliveryReportCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ce/job-issuancereports',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardengr/report/issuancereport.ce.html',
                    controller: 'IssuanceReportCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ce/job-persoreports',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardengr/report/jobpersoreport.ce.html',
                    controller: 'JobPersoReportCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ce/job-deliveryreports',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/cardengr/report/jobdeliveryreport.ce.html',
                    controller: 'JobDeliveryReportCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ce/flagged-jobs',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/cardengr/flagjob/unitflaggedjob.co.html', //Todo
                    controller: 'UnitFlaggedJobCE',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { // QAC Resources
                url: '/qa/incoming-persos',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/incoming-perso.qa.html',
                    controller: 'IncomingPersoQA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { // QAC Resources
                url: '/qa/incoming-prints',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/incoming-print.qa.html',
                    controller: 'IncomingPrintQA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qa/perso-jobsplit-lists/:trackerId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/perso-jobsplit-list.qa.html',
                    controller: 'PersoJobSplitListQA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qa/print-jobsplit-lists/:trackerId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/print-jobsplit-list.qa.html',
                    controller: 'PrintJobSplitListQA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qa/job-check/:splitId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/job-check.qa.html',
                    controller: 'JobCheckQA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qa/perso-waste-requests',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/perso-waste-request.qa.html',
                    controller: 'WasteRequestQA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qa/perso-waste-analysis/:analysisId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/waste-analysis.qa.html',
                    controller: 'WasteRequestQA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qa/print-waste-requests',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/print-waste-request.qa.html',
                    controller: 'PrintWasteRequestQA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qa/pending-wastes',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/waste-pending.qa.html',
                    controller: 'WastePendingQA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qa/approved-wastes',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/waste-approved.qa.html',
                    controller: 'WasteApprovedQA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qa/flagged-jobs',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/qac/flagjob/unitflaggedjob.qa.html',
                    controller: 'UnitFlaggedJobQA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qc/incoming-persos',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/incoming-perso.qc.html',
                    controller: 'IncomingPersoQC',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qc/pending-persos',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/pending-perso.qc.html',
                    controller: 'PendingPersoQC',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qc/card-pending-delivery',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/carddelivery.qc.html',
                    controller: 'CardDeliveryQC',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qc/card-pending-delivery/:trackerId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/carddeliverydetail.qc.html',
                    controller: 'CardDeliveryDetailQC',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qc/card-completed-delivery',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/cardcompleteddelivery.qc.html',
                    controller: 'IncomingPersoQC',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qc/card-completed-delivery/:trackerId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/cardcompleteddeliverydetail.qc.html',
                    controller: 'IncomingPersoQC',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qc/incoming-printings',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/incoming-print.qc.html',
                    controller: 'IncomingPrintQC',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qc/print-pending-delivery',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/printdeliverable.qc.html', //app/qac/printdelivery.qc.html
                    controller: 'PrintDeliverableQC', //IncomingPrintQC
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qc/print-pending-delivery/:trackerId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/printdeliverydetail.qc.html',
                    controller: 'PrintDeliveryDetailQC',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qc/print-completed-delivery',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/printcompleteddelivery.qc.html',
                    controller: 'IncomingPrintQC',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qc/print-completed-delivery/:id',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/printcompleteddeliverydetail.qc.html',
                    controller: 'IncomingPrintQC',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qc/run-job/:trackerId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/job-run.qc.html',
                    controller: 'JobRunQC',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qc/run-job-print/:trackerId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/qac/job-run-print.qc.html',
                    controller: 'JobRunPrintQC',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/qc/flagged-jobs',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/qac/flagjob/unitflaggedjob.qc.html',
                    controller: 'UnitFlaggedJobQC',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { /// Mailing Resources
                url: '/ma/incoming-jobs',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/mailing/incoming-job.ma.html',
                    controller: 'IncomingJobMA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ma/start-job/:trackerId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/mailing/job-run.ma.html',
                    controller: 'JobRunMA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ma/job-delivery',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/mailing/job-delivery.ma.html',
                    controller: 'JobDeliveryMA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ma/job-delivery/:trackerId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/mailing/job-deliverydetail.ma.html',
                    controller: 'JobDeliveryDetailMA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ma/flagged-jobs',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/cardops/flagjob/unitflaggedjob.co.html', //Todo
                    controller: 'UnitFlaggedJobMA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ma/misreports',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/mailing/reports/cardmisreport.ma.html',
                    controller: 'CardMISReportMA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/ma/card-delivery-reports',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/mailing/reports/carddeliveryreport.ma.html',
                    controller: 'CardDeliveryReportMA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, { // RM
                url: '/rm/perso-jobs',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/mailing/job-deliverydetail.ma.html',
                    controller: 'JobDeliveryDetailMA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/rm/perso-job/:trackerId',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/mailing/job-deliverydetail.ma.html',
                    controller: 'JobDeliveryDetailMA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/rm/nonperso-jobs',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/rm/nonpersojob.rm.html',
                    controller: 'NonPersoJobRM',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/rm/clients',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/rm/clients.rm.html',
                    controller: 'ClientListRM',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/rm/client/:id/productlists',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/rm/clientproducts.rm.html',
                    controller: 'CardProductListRM',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/rm/client/:id/product/:productId/create',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/rm/nonpersojobdetail.rm.html',
                    controller: 'NonPersoDetailRM',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/rm/nonperso-job/:id',
                config: {
                    title: 'Card Variant Details',
                    templateUrl: 'app/rm/nonpersojobdetail.rm.html',
                    controller: 'NonPersoDetailRM',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/rm/flagged-jobs',
                config: {
                    title: 'Waste Jobs',
                    templateUrl: 'app/cardops/flagjob/unitflaggedjob.co.html', //Todo
                    controller: 'UnitFlaggedJob',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/sa/client-list', //clientuserlist
                config: {
                    title: 'Account',
                    templateUrl: 'app/sadmin/clientaccount/clientlist.sa.html',
                    controller: 'ClientListSA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/sa/client/:clientId/userlist',
                config: {
                    title: 'Account',
                    templateUrl: 'app/sadmin/clientaccount/clientuserlist.sa.html',
                    controller: 'ClientUserListSA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/sa/client/:clientId/create/new',
                config: {
                    title: 'Account',
                    templateUrl: 'app/sadmin/clientaccount/createclientuser.sa.html',
                    controller: 'CreateClientUserSA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/sa/user-account-list',
                config: {
                    title: 'Account',
                    templateUrl: 'app/sadmin/useraccount/useraccount.sa.html',
                    controller: 'UserAccountSA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/sa/create-user/:id',
                config: {
                    title: 'Account',
                    templateUrl: 'app/sadmin/useraccount/createuser.sa.html',
                    controller: 'CreateUserSA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/sa/accountdetail/:id',
                config: {
                    title: 'Account',
                    templateUrl: 'app/sadmin/useraccount/accountdetail.sa.html',
                    controller: 'AccountDetailSA',
                    controllerAs: 'vm',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/report',
                config: {
                    title: 'signup',
                    templateUrl: 'app/report/report.html',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }
        ];
    }




})();