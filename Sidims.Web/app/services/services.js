(function () {
    'use strict';

    var app = angular.module('app');

    app.service('$menuItems', function (authService, localStorageService) {
        this.menuItems = [];
        

        var $menuItemsRef = this;

        var menuItemObj = {
            parent: null,

            title: '',
            link: '', // starting with "./" will refer to parent link concatenation
            state: '', // will be generated from link automatically where "/" (forward slashes) are replaced with "."
            icon: '',

            isActive: false,
            label: null,

            menuItems: [],

            setLabel: function (label, color, hideWhenCollapsed) {
                if (typeof hideWhenCollapsed == 'undefined')
                    hideWhenCollapsed = true;

                this.label = {
                    text: label,
                    classname: color,
                    collapsedHide: hideWhenCollapsed
                };

                return this;
            },

            addItem: function (title, link, icon) {
                var parent = this,
					item = angular.extend(angular.copy(menuItemObj), {
					    parent: parent,

					    title: title,
					    link: link,
					    icon: icon
					});

                if (item.link) {
                    if (item.link.match(/^\./))
                        item.link = parent.link + item.link.substring(1, link.length);

                    if (item.link.match(/^-/))
                        item.link = parent.link + '-' + item.link.substring(2, link.length);

                    item.state = $menuItemsRef.toStatePath(item.link);
                }

                this.menuItems.push(item);

                return item;
            }
        };

        this.addItem = function (title, link, icon) {
            var item = angular.extend(angular.copy(menuItemObj), {
                title: title,
                link: link,
                state: this.toStatePath(link),
                icon: icon
            });

            this.menuItems.push(item);

            return item;
        };

        this.getAll = function () {
            return this.menuItems;
        };

        this.createSuperAdminMenu = function () {

            var dashboard = this.addItem('Dashboard', '/sa/dashboard', 'linecons-cog');
            var account = this.addItem('Accounts', '/sa/accounts/user-profiles', 'linecons-cog');

            account.addItem('User Account List', '/sa/user-account-list', 'fa-angle-right');
            account.addItem('Client Account List', '/sa/client-list', 'fa-angle-right');
        }

        this.createCardOpsMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var jobs = this.addItem('Jobs Management', '/co/jobs', 'fa fa-tasks fa-fw');
            var lookups = this.addItem('Lookups', '/co/lookups', 'fa fa-sort-alpha-asc fa-fw');

            var flags = this.addItem('Flagged Jobs', '/pr/flags', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/co/flagged-jobs', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Accounts
            jobs.addItem('Pending Jobs', '/co/pending-jobs', 'fa-angle-right');
            jobs.addItem('Non Perso JobLists', '/co/nonperso-jobs', 'fa-angle-right');
            jobs.addItem('WIP JobLists', '/co/jobs', 'fa-angle-right');
            
            // Subitems of Lookups
            lookups.addItem('Remarks', '/co/lookups/remarks', 'fa-angle-right');
            lookups.addItem('Dictionary', '/co/lookups/dictionary', 'fa-angle-right');
        }

        this.createCardOpsSupervisorMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var jobs = this.addItem('Jobs Management', '/co/jobs', 'fa fa-tasks fa-fw');
            //var lookups = this.addItem('Lookups', '/co/lookups', 'fa fa-sort-alpha-asc fa-fw');

            var flags = this.addItem('Flagged Jobs', '/pr/flags', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/co/flagged-jobs', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Accounts
            jobs.addItem('Pending Jobs', '/co/pending-jobs', 'fa-angle-right');
            jobs.addItem('Reverted Jobs', '/co/reverted-jobs', 'fa-angle-right');
            jobs.addItem('Delete Jobs', '/co/deleted-jobs', 'fa-angle-right');
            jobs.addItem('Non Perso JobLists', '/co/nonperso-jobs', 'fa-angle-right');
            
            // Special Task
            var special = this.addItem('Special Task', '/in/job-management', 'fa fa-tasks fa-fw');

            //var cardTask = special.addItem('Job Management', '/in/MIS/cards');
            var jobStatusTask = special.addItem('Job Status Task', '/in/MIS/cards');
            var LookupsTask = special.addItem('Lookups', '/in/MIS/stationary');

            var PendingJobs = jobStatusTask.addItem('Pending Jobs', '/in/MIS/cards');
            var CompletedJobs = jobStatusTask.addItem('Completed Jobs', '/in/MIS/cards');

            PendingJobs.addItem('Recent Jobs', '/sup/pending/recent-jobs', 'fa-angle-right');
            PendingJobs.addItem('Older Jobs', '/sup/pending/older-jobs', 'fa-angle-right');

            CompletedJobs.addItem('Recent Jobs', '/sup/completed/recent-jobs', 'fa-angle-right');
            CompletedJobs.addItem('Older Jobs', '/sup/completed/older-jobs', 'fa-angle-right');

            // Subitems of Lookups
            LookupsTask.addItem('Remarks', '/co/lookups/remarks', 'fa-angle-right');
            LookupsTask.addItem('Dictionary', '/co/lookups/dictionary', 'fa-angle-right');
            //cardTask.addItem('Incoming Jobs', '/sup/co/incoming-jobs', 'fa-angle-right');
            //stationaryTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');

        }

        this.createInventoryMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var jobs = this.addItem('Jobs Queue', '/in/job-management', 'fa fa-tasks fa-fw');
            var dispatch = this.addItem('Dispatch', '/in/dispatch', 'fa fa-check-circle-o fa-fw');

            var mis = this.addItem('MIS Report', '/in/MIS-Report', 'fa fa-tasks fa-fw');
            var lookups = this.addItem('Lookups', '/in/lookups', 'fa fa-sort-alpha-asc fa-fw');

            var flags = this.addItem('Flagged Jobs', '/in/flagged-jobs', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/in/flagged-jobs', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Jobs
            jobs.addItem('Incoming Jobs', '/in/incoming-jobs', 'fa-angle-right');
            jobs.addItem('Partial Jobs Queue', '/in/partial-jobs', 'fa-angle-right');
            jobs.addItem('Card Waste Queue', '/in/waste-jobs', 'fa-angle-right');
            jobs.addItem('Card Held Queue', '/in/incoming-heldcards', 'fa-angle-right');
            jobs.addItem('Print Waste Queue', '/in/print-waste-jobs', 'fa-angle-right');
            jobs.addItem('Print Held Queue', '/in/incoming-heldprints', 'fa-angle-right');
            jobs.addItem('Black Card Issuance', '/in/black-cards', 'fa-angle-right');
            jobs.addItem('Reverted Job Queue', '/in/black-cards', 'fa-angle-right');

            var achives = this.addItem('Jobs Archive', '/in/job-management', 'fa fa-tasks fa-fw');
            achives.addItem('Job Audit Trail', '/in/incoming-jobs', 'fa-angle-right');
            achives.addItem('Card Issuance Logs', '/in/partial-jobs', 'fa-angle-right');
            achives.addItem('Stationary Issuance Logs', '/in/partial-jobs', 'fa-angle-right');

            // Dispatch
            dispatch.addItem('Incoming Jobs', '/in/dispatch/incoming-jobs', 'fa-angle-right');
            dispatch.addItem('Delivery Reports', '/in/dispatch/delivery-reports', 'fa-angle-right');
            dispatch.addItem('Waste Reports', '/in/dispatch/waste-reports', 'fa-angle-right');

            // MIS Report
            var miscard = mis.addItem('Embedded Cards', '/in/MIS/cards');
            var misstationary = mis.addItem('Stationaries', '/in/MIS/stationary');

            miscard.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');
            miscard.addItem('Issuance Reports', '/in/mis/card/issuance-reports', 'fa-angle-right');
            miscard.addItem('Waste Reports', '/in/mis/card/waste-reports', 'fa-angle-right');
            miscard.addItem('Dispatch Reports', '/in/mis/card/dispatch-reports', 'fa-angle-right');
            miscard.addItem('DeliveryNote Reports', '/in/mis/card/deliverynote-reports', 'fa-angle-right');
            miscard.addItem('Vault Reports', '/in/mis/card/vault-reports', 'fa-angle-right');
            miscard.addItem('Card Receipt Reports', '/in/mis/card/receiptlog-reports', 'fa-angle-right');

            // Subitems of Lookups
            //lookups.addItem('Create New Product', '/in/lookups/card-variants', 'fa-angle-right');
            lookups.addItem('Client Management', '/in/mis/card/clients', 'fa-angle-right');
        }

        this.createInventorySupervisorMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var jobs = this.addItem('Jobs Queue', '/in/job-management', 'fa fa-tasks fa-fw');
            var dispatch = this.addItem('Dispatch', '/in/dispatch', 'fa fa-check-circle-o fa-fw');

            var mis = this.addItem('MIS Report', '/in/MIS-Report', 'fa fa-tasks fa-fw');
            var lookups = this.addItem('Lookups', '/in/lookups', 'fa fa-sort-alpha-asc fa-fw');
            var flags = this.addItem('Flagged Jobs', '/in/flagged-jobs', 'fa fa-flag fa-fw');
            var achives = this.addItem('Jobs Archive', '/in/job-management', 'fa fa-tasks fa-fw');

            
            flags.addItem('Unit Issues', '/in/flagged-jobs', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Jobs
            jobs.addItem('Incoming Jobs', '/in/incoming-jobs', 'fa-angle-right');
            jobs.addItem('Partial Jobs Queue', '/in/partial-jobs', 'fa-angle-right');
            jobs.addItem('Card Waste Queue', '/in/waste-jobs', 'fa-angle-right');
            jobs.addItem('Card Held Queue', '/in/incoming-heldcards', 'fa-angle-right');
            jobs.addItem('Print Waste Queue', '/in/print-waste-jobs', 'fa-angle-right');
            jobs.addItem('Print Held Queue', '/in/incoming-heldprints', 'fa-angle-right');
            jobs.addItem('Black Card Issuance', '/in/black-cards', 'fa-angle-right');

            achives.addItem('Job Audit Trail', '/in/incoming-jobs', 'fa-angle-right');
            achives.addItem('Card Issuance Logs', '/in/partial-jobs', 'fa-angle-right');
            achives.addItem('Stationary Issuance Logs', '/in/partial-jobs', 'fa-angle-right');

            // Dispatch
            dispatch.addItem('Incoming Jobs', '/in/dispatch/incoming-jobs', 'fa-angle-right');
            dispatch.addItem('Delivery Reports', '/in/dispatch/delivery-reports', 'fa-angle-right');
            dispatch.addItem('Waste Reports', '/in/dispatch/waste-reports', 'fa-angle-right');

            // MIS Report
            var miscard = mis.addItem('Embedded Cards', '/in/MIS/cards');
            var misstationary = mis.addItem('Stationaries', '/in/MIS/stationary');

            miscard.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');
            miscard.addItem('Issuance Reports', '/in/mis/card/issuance-reports', 'fa-angle-right');
            miscard.addItem('Waste Reports', '/in/mis/card/waste-reports', 'fa-angle-right');
            miscard.addItem('Dispatch Reports', '/in/mis/card/dispatch-reports', 'fa-angle-right');
            miscard.addItem('DeliveryNote Reports', '/in/mis/card/deliverynote-reports', 'fa-angle-right');
            miscard.addItem('Vault Reports', '/in/mis/card/vault-reports', 'fa-angle-right');
            miscard.addItem('Card Receipt Reports', '/in/mis/card/receiptlog-reports', 'fa-angle-right');

            // Subitems of Lookups
            //lookups.addItem('Create New Product', '/in/lookups/card-variants', 'fa-angle-right');
            lookups.addItem('Client Management', '/in/mis/card/clients', 'fa-angle-right');

            // Special Task
            var special = this.addItem('Special Task', '/in/job-management', 'fa fa-tasks fa-fw');

            var cardTask = special.addItem('Embedded Cards', '/in/MIS/cards');
            var stationaryTask = special.addItem('Stationaries', '/in/MIS/stationary');

            cardTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');
            stationaryTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');

        }

        this.createCardEngrMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var jobs = this.addItem('Jobs Management', '/ce/job-management', 'fa fa-tasks fa-fw');
            var achives = this.addItem('Jobs Archive', '/ce/job-archives', 'fa fa-tasks fa-fw');

            // MIS Report
            var incoming = jobs.addItem('Incoming Jobs', '/ce/incoming-jobs');
            var resumable = jobs.addItem('Resumable Jobs', '/ce/resumable-jobs');

            var flags = this.addItem('Flagged Jobs', '/pr/flags', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/student/assessments/subjects', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            incoming.addItem('Card Jobs', '/ce/incoming-perso', 'fa-angle-right');

            resumable.addItem('New Card Jobs', '/ce/resumable/new-perso', 'fa-angle-right');
            resumable.addItem('Pending Card Jobs', '/ce/resumable/pending-perso', 'fa-angle-right');
            resumable.addItem('Partial Card Jobs', '/ce/resumable/partial-perso', 'fa-angle-right');

            // Archives
            achives.addItem('Card MIS Report', '/ce/card-misreports', 'fa-angle-right');
            //achives.addItem('Card Delivery Report', '/ce/card-deivery-reports', 'fa-angle-right');
            achives.addItem('Jobs Archives', '/ce/job-archives', 'fa-angle-right');
            achives.addItem('Card Issuance Reports', '/ce/job-issuancereports', 'fa-angle-right');
            achives.addItem('Job Perso Reports', '/ce/job-persoreports', 'fa-angle-right');
            achives.addItem('Job Delivery Reports', '/ce/job-deliveryreports', 'fa-angle-right');

        }

        this.createCardEngrSupervisorMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var jobs = this.addItem('Jobs Management', '/ce/job-management', 'fa fa-tasks fa-fw');
            var achives = this.addItem('Jobs Archive', '/ce/job-archives', 'fa fa-tasks fa-fw');

            // MIS Report
            var incoming = jobs.addItem('Incoming Jobs', '/ce/incoming-jobs');
            var resumable = jobs.addItem('Resumable Jobs', '/ce/resumable-jobs');

            var flags = this.addItem('Flagged Jobs', '/pr/flags', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/student/assessments/subjects', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');


            incoming.addItem('Card Jobs', '/ce/incoming-perso', 'fa-angle-right');
            //incoming.addItem('Print Jobs', '/ce/incoming-prints', 'fa-angle-right');

            resumable.addItem('New Card Jobs', '/ce/resumable/new-perso', 'fa-angle-right');
            resumable.addItem('Partial Card Jobs', '/ce/resumable/partial-perso', 'fa-angle-right');

            // Archives
            achives.addItem('Card MIS Report', '/ce/card-misreports', 'fa-angle-right');
            //achives.addItem('Card Delivery Report', '/ce/card-deivery-reports', 'fa-angle-right');
            achives.addItem('Jobs Archives', '/ce/job-archives', 'fa-angle-right');
            achives.addItem('Card Issuance Reports', '/ce/job-issuancereports', 'fa-angle-right');
            achives.addItem('Job Perso Reports', '/ce/job-persoreports', 'fa-angle-right');
            achives.addItem('Job Delivery Reports', '/ce/job-deliveryreports', 'fa-angle-right');

            // Special Task
            var special = this.addItem('Special Task', '/in/job-management', 'fa fa-tasks fa-fw');

            var cardTask = special.addItem('Embedded Cards', '/in/MIS/cards');
            var stationaryTask = special.addItem('Stationaries', '/in/MIS/stationary');

            cardTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');
            stationaryTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');

        }

        this.createPrintingMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var jobs = this.addItem('Jobs Management', '/pr/job-management', 'fa fa-tasks fa-fw');

            var flags = this.addItem('Flagged Jobs', '/pr/flags', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/pr/flagged-jobs', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Jobs
            jobs.addItem('Incoming Printing', '/pr/incoming-print', 'fa-angle-right');
            jobs.addItem('Print Analysis', '/pr/print-analysis', 'fa-angle-right');

            // Archives
            var achives = this.addItem('Jobs Archive', '/pr/job-management', 'fa fa-tasks fa-fw');
            achives.addItem('Print MIS Report', '/pr/print-mis', 'fa-angle-right');
            achives.addItem('Card Delivery Report', '/pr/card-delivery-reports', 'fa-angle-right');

        }

        this.createPrintingSupervisorMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var jobs = this.addItem('Jobs Management', '/pr/job-management', 'fa fa-tasks fa-fw');

            var flags = this.addItem('Flagged Jobs', '/pr/flags', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/pr/flagged-jobs', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Jobs
            jobs.addItem('Incoming Printing', '/pr/incoming-print', 'fa-angle-right');
            jobs.addItem('Print Analysis', '/pr/print-analysis', 'fa-angle-right');

            // Archives
            var achives = this.addItem('Jobs Archive', '/pr/job-management', 'fa fa-tasks fa-fw');
            achives.addItem('Print MIS Report', '/pr/print-mis', 'fa-angle-right');
            achives.addItem('Card Delivery Report', '/pr/card-delivery-reports', 'fa-angle-right');

            // Special Task
            var special = this.addItem('Special Task', '/in/job-management', 'fa fa-tasks fa-fw');

            var cardTask = special.addItem('Embedded Cards', '/in/MIS/cards');
            var stationaryTask = special.addItem('Stationaries', '/in/MIS/stationary');

            cardTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');
            stationaryTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');

        }

        this.createQAMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var qa = this.addItem('Quality Assurance', '/qa/incoming-persos', 'fa fa-tasks fa-fw');
            var waste = this.addItem('Waste Request', '/qa/waste-request', 'fa fa-tasks fa-fw');

            var flags = this.addItem('Flagged Jobs', '/flagged-jobs', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/qa/flagged-jobs', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Jobs
            qa.addItem('Incoming Perso Jobs', '/qa/incoming-persos', 'fa-angle-right');
            qa.addItem('Incoming Print Jobs', '/qa/incoming-prints', 'fa-angle-right');
        
            // Archives
            var achives = this.addItem('Jobs Archive', '/in/job-management', 'fa fa-tasks fa-fw');
            achives.addItem('Job Audit Trail', '/in/incoming-jobs', 'fa-angle-right');

            //// Subitems of Waste
            waste.addItem('Perso Waste Request', '/qa/perso-waste-requests', 'fa-angle-right');
            waste.addItem('Print Waste Request', '/qa/print-waste-requests', 'fa-angle-right');

            waste.addItem('Approved Request', '/qa/approved-wastes', 'fa-angle-right');


        }

        this.createQASupervisorMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var qa = this.addItem('Quality Assurance', '/qa/incoming-persos', 'fa fa-tasks fa-fw');
            var waste = this.addItem('Waste Request', '/qa/waste-request', 'fa fa-tasks fa-fw');

            var flags = this.addItem('Flagged Jobs', '/flagged-jobs', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/qa/flagged-jobs', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Jobs
            qa.addItem('Incoming Perso Jobs', '/qa/incoming-persos', 'fa-angle-right');
            qa.addItem('Incoming Print Jobs', '/qa/incoming-prints', 'fa-angle-right');

            // Archives
            var achives = this.addItem('Jobs Archive', '/in/job-management', 'fa fa-tasks fa-fw');
            achives.addItem('Job Audit Trail', '/in/incoming-jobs', 'fa-angle-right');

            //// Subitems of Waste
            waste.addItem('Perso Waste Request', '/qa/perso-waste-requests', 'fa-angle-right');
            waste.addItem('Print Waste Request', '/qa/print-waste-requests', 'fa-angle-right');

            waste.addItem('Approved Request', '/qa/approved-wastes', 'fa-angle-right');

            // Special Task
            var special = this.addItem('Special Task', '/in/job-management', 'fa fa-tasks fa-fw');

            var cardTask = special.addItem('Embedded Cards', '/in/MIS/cards');
            var stationaryTask = special.addItem('Stationaries', '/in/MIS/stationary');

            cardTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');
            stationaryTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');

        }

        this.createMailingMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var mailing = this.addItem('Mailing', '/ma/incoming-jobs', 'fa fa-tasks fa-fw');
            var delivery = this.addItem('Job Delivery', '/ma/job-delivery', 'fa fa-tasks fa-fw');
           
            var flags = this.addItem('Flagged Jobs', '/flagged-jobs', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/ma/flagged-jobs', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Jobs
            mailing.addItem('Incoming Jobs', '/ma/incoming-jobs', 'fa-angle-right');
            mailing.addItem('Partial Jobs', '/ma/partial-jobs', 'fa-angle-right');
           
            delivery.addItem('Pending Delivery', '/ma/job-delivery', 'fa-angle-right');
            delivery.addItem('Completed Delivery', '/ma/completed-jobs', 'fa-angle-right');

            // Archives
            var achives = this.addItem('Jobs Archive', '/ma/job-management', 'fa fa-tasks fa-fw');
            achives.addItem('MA MIS Report', '/ma/misreports', 'fa-angle-right');
            achives.addItem('Card Delivery Reports', '/ma/card-delivery-reports', 'fa-angle-right');

        }

        this.createMailingSupervisorMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var mailing = this.addItem('Mailing', '/ma/incoming-jobs', 'fa fa-tasks fa-fw');
            var delivery = this.addItem('Job Delivery', '/ma/job-delivery', 'fa fa-tasks fa-fw');

            var flags = this.addItem('Flagged Jobs', '/flagged-jobs', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/ma/flagged-jobs', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Jobs
            mailing.addItem('Incoming Jobs', '/ma/incoming-jobs', 'fa-angle-right');
            mailing.addItem('Partial Jobs', '/ma/partial-jobs', 'fa-angle-right');

            delivery.addItem('Pending Delivery', '/ma/job-delivery', 'fa-angle-right');
            delivery.addItem('Completed Delivery', '/ma/completed-jobs', 'fa-angle-right');

            // Archives
            var achives = this.addItem('Jobs Archive', '/ma/job-management', 'fa fa-tasks fa-fw');
            achives.addItem('MA MIS Report', '/ma/misreports', 'fa-angle-right');
            achives.addItem('Card Delivery Reports', '/ma/card-delivery-reports', 'fa-angle-right');

            // Special Task
            var special = this.addItem('Special Task', '/in/job-management', 'fa fa-tasks fa-fw');

            var cardTask = special.addItem('Embedded Cards', '/in/MIS/cards');
            var stationaryTask = special.addItem('Stationaries', '/in/MIS/stationary');

            cardTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');
            stationaryTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');

        }

        this.createMAudMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var maudits = this.addItem('Job Process', '/au/incoming-jobs', 'fa fa-tasks fa-fw');
            
            var flags = this.addItem('Flagged Jobs', '/pr/flags', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/student/assessments/subjects', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Jobs
            maudits.addItem('Incoming Jobs', '/au/incoming-jobs', 'fa-angle-right');
            maudits.addItem('Pending', '/student/accounts/students', 'fa-angle-right');
            maudits.addItem('Verified', '/student/accounts/students', 'fa-angle-right');

        }

        this.createCSMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var maudits = this.addItem('Job Process', '/cs/incoming-jobs', 'fa fa-tasks fa-fw');
            
            var flags = this.addItem('Flagged Jobs', '/flagged-jobs', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/cs/flagged-jobs', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Jobs
            maudits.addItem('Incoming Jobs', '/cs/incoming-jobs', 'fa-angle-right');
          
        }

        this.createCSSupervisorMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var maudits = this.addItem('Job Process', '/cs/incoming-jobs', 'fa fa-tasks fa-fw');

            var flags = this.addItem('Flagged Jobs', '/flagged-jobs', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/cs/flagged-jobs', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Jobs
            maudits.addItem('Incoming Jobs', '/cs/incoming-jobs', 'fa-angle-right');
            maudits.addItem('Pending', '/student/accounts/students', 'fa-angle-right');
            maudits.addItem('Verified', '/student/accounts/students', 'fa-angle-right');

            // Special Task
            var special = this.addItem('Special Task', '/in/job-management', 'fa fa-tasks fa-fw');

            var cardTask = special.addItem('Embedded Cards', '/in/MIS/cards');
            var stationaryTask = special.addItem('Stationaries', '/in/MIS/stationary');

            cardTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');
            stationaryTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');

        }

        this.createRMMenu = function () {
            var dashboard = this.addItem('Dashboard', '/student/dashboard', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/student/assessments', 'fa fa-check-circle-o fa-fw');
            var jobs = this.addItem('Job Management', '/rm/job-managements', 'fa fa-tasks fa-fw');
            
            var flags = this.addItem('Flagged Jobs', '/pr/flags', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/student/assessments/subjects', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Jobs
            jobs.addItem('Non Perso Jobs', '/rm/nonperso-jobs', 'fa-angle-right');
        }

        this.createRMSupervisorMenu = function () {
            var dashboard = this.addItem('Dashboard', '/student/dashboard', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/student/assessments', 'fa fa-check-circle-o fa-fw');
            var jobs = this.addItem('Job Management', '/rm/job-managements', 'fa fa-tasks fa-fw');

            var flags = this.addItem('Flagged Jobs', '/pr/flags', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/student/assessments/subjects', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Jobs
            jobs.addItem('Non Perso Jobs', '/rm/nonperso-jobs', 'fa-angle-right');

            // Special Task
            var special = this.addItem('Special Task', '/in/job-management', 'fa fa-tasks fa-fw');

            var cardTask = special.addItem('Embedded Cards', '/in/MIS/cards');
            var stationaryTask = special.addItem('Stationaries', '/in/MIS/stationary');

            cardTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');
            stationaryTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');

        }

        this.createQCMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var qc = this.addItem('Quality Control', '/', 'fa fa-tasks fa-fw');
            var delivery = this.addItem('Job Delivery', '/', 'fa fa-tasks fa-fw');
            
            var flags = this.addItem('Flagged Jobs', '/flagged-jobs', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/qc/flagged-jobs', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            qc.addItem('Incoming Persos', '/qc/incoming-persos', 'fa-angle-right');
            qc.addItem('Pending Persos', '/qc/pending-persos', 'fa-angle-right');

            qc.addItem('Incoming Printings', '/qc/incoming-printings', 'fa-angle-right');
            qc.addItem('Pending Printings', '/qc/pending-printings', 'fa-angle-right');
         
            var carddelivery = delivery.addItem('Card Delivery', '/qc/card-pending-delivery', 'fa-angle-right');
            var printdelivery = delivery.addItem('Print Delivery', '/qc/completed-delivery', 'fa-angle-right');

            carddelivery.addItem('Pending Delivery', '/qc/card-pending-delivery', 'fa-angle-right');
            carddelivery.addItem('Completed Delivery', '/qc/card-completed-delivery', 'fa-angle-right');

            printdelivery.addItem('Pending Delivery', '/qc/print-pending-delivery', 'fa-angle-right');
            printdelivery.addItem('Completed Delivery', '/qc/print-completed-delivery', 'fa-angle-right');


        }

        this.createQCSupervisorMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var qc = this.addItem('Quality Control', '/', 'fa fa-tasks fa-fw');
            var delivery = this.addItem('Job Delivery', '/', 'fa fa-tasks fa-fw');

            var flags = this.addItem('Flagged Jobs', '/flagged-jobs', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/qc/flagged-jobs', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            qc.addItem('Incoming Persos', '/qc/incoming-persos', 'fa-angle-right');
            qc.addItem('Incoming Printings', '/qc/incoming-printings', 'fa-angle-right');

            var carddelivery = delivery.addItem('Card Delivery', '/qc/card-pending-delivery', 'fa-angle-right');
            var printdelivery = delivery.addItem('Print Delivery', '/qc/completed-delivery', 'fa-angle-right');

            carddelivery.addItem('Pending Delivery', '/qc/card-pending-delivery', 'fa-angle-right');
            carddelivery.addItem('Completed Delivery', '/qc/card-completed-delivery', 'fa-angle-right');

            printdelivery.addItem('Pending Delivery', '/qc/print-pending-delivery', 'fa-angle-right');
            printdelivery.addItem('Completed Delivery', '/qc/print-completed-delivery', 'fa-angle-right');

            // Special Task
            var special = this.addItem('Special Task', '/in/job-management', 'fa fa-tasks fa-fw');

            var cardTask = special.addItem('Embedded Cards', '/in/MIS/cards');
            var stationaryTask = special.addItem('Stationaries', '/in/MIS/stationary');

            cardTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');
            stationaryTask.addItem('MIS Reports', '/in/mis/card/mis-reports', 'fa-angle-right');


        }

        this.createFinanceMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var jobs = this.addItem('Jobs Management', '/pr/job-management', 'fa fa-tasks fa-fw');
           
            var flags = this.addItem('Flagged Jobs', '/pr/flags', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/student/assessments/subjects', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Jobs
            jobs.addItem('Job Lists', '/student/accounts/students', 'fa-angle-right');
            jobs.addItem('Incoming Printing', '/pr/incoming-print', 'fa-angle-right');

            // Archives
            var achives = this.addItem('Jobs Archive', '/in/job-management', 'fa fa-tasks fa-fw');
            achives.addItem('Job Audit Trail', '/in/incoming-jobs', 'fa-angle-right');
        }

        this.createManagementMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var jobstatus = this.addItem('Jobs Status', '/job-status', 'fa fa-check-circle-o fa-fw');
            var jobs = this.addItem('Jobs Management', '/pr/job-management', 'fa fa-tasks fa-fw');
            
            var flags = this.addItem('Flagged Jobs', '/pr/flags', 'fa fa-flag fa-fw');
            flags.addItem('Unit Issues', '/student/assessments/subjects', 'fa-angle-right');
            flags.addItem('Pending Issues', '/flagged-jobs', 'fa-angle-right');
            flags.addItem('Resolved Issues', '/flagged-resolved', 'fa-angle-right');

            //// Subitems of Jobs
            jobs.addItem('Job Lists', '/student/accounts/students', 'fa-angle-right');
            jobs.addItem('Incoming Printing', '/pr/incoming-print', 'fa-angle-right');

            // Archives
            var achives = this.addItem('Jobs Archive', '/in/job-management', 'fa fa-tasks fa-fw');
            achives.addItem('Job Audit Trail', '/in/incoming-jobs', 'fa-angle-right');

        }

        this.createClientMenu = function () {
            var dashboard = this.addItem('Dashboard', '/', 'fa fa-dashboard');
            var products = this.addItem('Products', '/', 'fa fa-check-circle-o fa-fw');
            var inventory = this.addItem('Inventory', '/pr/job-management', 'fa fa-tasks fa-fw');

            //// Subitems of Jobs
            products.addItem('Product Lists', '/', 'fa-angle-right');
            inventory.addItem('Inventory', '/inventory', 'fa-angle-right');

            //// Archives
            //var achives = this.addItem('Jobs Archive', '/in/job-management', 'fa fa-tasks fa-fw');
            //achives.addItem('Job Audit Trail', '/in/incoming-jobs', 'fa-angle-right');

        }


        this.prepareSidebarMenu = function () {

            var auth = authService.authentication;
            var pageView = auth.page;

            if (pageView === 'Admin' ) {
                this.createSuperAdminMenu();
            } else if (pageView === 'SuperAdmin') {
                this.createSuperAdminMenu();
            } else if (pageView === 'CardOps') { //CardOps Supervisor
                this.createCardOpsMenu();
            } else if (pageView === 'CardOps Supervisor') {
                this.createCardOpsSupervisorMenu();
            } else if (pageView === 'Inventory') {
                this.createInventoryMenu();
            } else if (pageView === 'Inventory Supervisor') {
                this.createInventorySupervisorMenu();
            } else if (pageView === 'CardEngr') {
                this.createCardEngrMenu();
            } else if (pageView === 'CardEngr Supervisor') {
                this.createCardEngrSupervisorMenu();
            } else if (pageView === 'Printing') {
                this.createPrintingMenu();
            } else if (pageView === 'Printing Supervisor') {
                this.createPrintingSupervisorMenu();
            } else if (pageView === 'QA') {
                this.createQAMenu();
            } else if (pageView === 'QA Supervisor') {
                this.createQASupervisorMenu();
            } else if (pageView === 'QC') {
                this.createQCMenu();
            } else if (pageView === 'QC Supervisor') {
                this.createQCSupervisorMenu();
            } else if (pageView === 'Mailing') {
                this.createMailingMenu();
            } else if (pageView === 'Mailing Supervisor') {
                this.createMailingSupervisorMenu();
            } else if (pageView === 'RM') {
                this.createRMMenu();
            } else if (pageView === 'RM Supervisor') {
                this.createRMSupervisorMenu();
            } else if (pageView === 'Finance') {
                this.createFinanceMenu();
            } else if (pageView === 'Management') {
                this.createManagementMenu();
            } else if (pageView === 'MaterialAudit') {
                this.createMAudMenu();
            } else if (pageView === 'CS') {
                this.createCSMenu();
            } else if (pageView === 'CS Supervisor') {
                this.createCSSupervisorMenu();
            }

            return this;
        };

        this.prepareHorizontalMenu = function () {
            var dashboard = this.addItem('Dashboard', '/app/dashboard', 'linecons-cog');
            var layouts = this.addItem('Layout', '/app/layout-and-skins', 'linecons-desktop');
            var ui_elements = this.addItem('UI Elements', '/app/ui', 'linecons-note');
            var forms = this.addItem('Forms', '/app/forms', 'linecons-params');
            var other = this.addItem('Other', '/app/extra', 'linecons-beaker');

            // Subitems of Dashboard
            dashboard.addItem('Dashboard 1', '-/variant-1'); // "-/" will append parents link
            dashboard.addItem('Dashboard 2', '-/variant-2');
            dashboard.addItem('Dashboard 3', '-/variant-3');
            dashboard.addItem('Dashboard 4', '-/variant-4');

            // Subitems of UI Elements
            ui_elements.addItem('Panels', '-/panels');
            ui_elements.addItem('Buttons', '-/buttons');
            ui_elements.addItem('Tabs & Accordions', '-/tabs-accordions');
            ui_elements.addItem('Modals', '-/modals');
            ui_elements.addItem('Breadcrumbs', '-/breadcrumbs');
            ui_elements.addItem('Blockquotes', '-/blockquotes');
            ui_elements.addItem('Progress Bars', '-/progress-bars');
            ui_elements.addItem('Navbars', '-/navbars');
            ui_elements.addItem('Alerts', '-/alerts');
            ui_elements.addItem('Pagination', '-/pagination');
            ui_elements.addItem('Typography', '-/typography');
            ui_elements.addItem('Other Elements', '-/other-elements');


            // Subitems of Forms
            forms.addItem('Native Elements', '-/native');
            forms.addItem('Advanced Plugins', '-/advanced');
            forms.addItem('Form Wizard', '-/wizard');
            forms.addItem('Form Validation', '-/validation');
            forms.addItem('Input Masks', '-/input-masks');
            forms.addItem('File Upload', '-/file-upload');
            forms.addItem('Editors', '-/wysiwyg');
            forms.addItem('Sliders', '-/sliders');


            // Subitems of Others
            var widgets = other.addItem('Widgets', '/app/widgets', 'linecons-star');
            var mailbox = other.addItem('Mailbox', '/app/mailbox', 'linecons-mail').setLabel('5', 'secondary', false);
            var tables = other.addItem('Tables', '/app/tables', 'linecons-database');
            var extra = other.addItem('Extra', '/app/extra', 'linecons-beaker').setLabel('New Items', 'purple');
            var charts = other.addItem('Charts', '/app/charts', 'linecons-globe');
            var menu_lvls = other.addItem('Menu Levels', '', 'linecons-cloud');


            // Subitems of Mailbox
            mailbox.addItem('Inbox', '-/inbox');
            mailbox.addItem('Compose Message', '-/compose');
            mailbox.addItem('View Message', '-/message');


            // Subitems of Tables
            tables.addItem('Basic Tables', '-/basic');
            tables.addItem('Responsive Tables', '-/responsive');
            tables.addItem('Data Tables', '-/datatables');


            // Subitems of Extra
            var extra_icons = extra.addItem('Icons', '-/icons').setLabel(4, 'warning');
            var extra_maps = extra.addItem('Maps', '-/maps');
            extra.addItem('Gallery', '-/gallery');
            extra.addItem('Calendar', '-/calendar');
            extra.addItem('Profile', '-/profile');
            extra.addItem('Login', '/login');
            extra.addItem('Lockscreen', '/lockscreen');
            extra.addItem('Login Light', '/login-light');
            extra.addItem('Timeline', '-/timeline');
            extra.addItem('Timeline Centered', '-/timeline-centered');
            extra.addItem('Notes', '-/notes');
            extra.addItem('Image Crop', '-/image-crop');
            extra.addItem('Portlets', '-/portlets');
            extra.addItem('Blank Page', '-/blank-page');
            extra.addItem('Search', '-/search');
            extra.addItem('Invoice', '-/invoice');
            extra.addItem('404 Page', '-/page-404');
            extra.addItem('Tocify', '-/tocify');
            extra.addItem('Loading Progress', '-/loading-progress');
            //extra.addItem('Page Loading Overlay', 		'-/page-loading-overlay'); NOT SUPPORTED IN ANGULAR
            extra.addItem('Notifications', '-/notifications');
            extra.addItem('Nestable Lists', '-/nestable-lists');
            extra.addItem('Scrollable', '-/scrollable');

            // Submenu of Extra/Icons
            extra_icons.addItem('Font Awesome', '-/font-awesome');
            extra_icons.addItem('Linecons', '-/linecons');
            extra_icons.addItem('Elusive', '-/elusive');
            extra_icons.addItem('Meteocons', '-/meteocons');

            // Submenu of Extra/Maps
            extra_maps.addItem('Google Maps', '-/google');
            extra_maps.addItem('Advanced Map', '-/advanced');
            extra_maps.addItem('Vector Map', '-/vector');


            // Subitems of Charts
            charts.addItem('Chart Variants', '-/variants');
            charts.addItem('Range Selector', '-/range-selector');
            charts.addItem('Sparklines', '-/sparklines');
            charts.addItem('Map Charts', '-/map-charts');
            charts.addItem('Circular Gauges', '-/gauges');
            charts.addItem('Bar Gauges', '-/bar-gauges');



            // Subitems of Menu Levels
            var menu_lvl1 = menu_lvls.addItem('Menu Item 1.1');  // has to be referenced to add sub menu elements
            menu_lvls.addItem('Menu Item 1.2');
            menu_lvls.addItem('Menu Item 1.3');

            // Sub Level 2
            menu_lvl1.addItem('Menu Item 2.1');
            var menu_lvl2 = menu_lvl1.addItem('Menu Item 2.2'); // has to be referenced to add sub menu elements
            menu_lvl1.addItem('Menu Item 2.3');

            // Sub Level 3
            menu_lvl2.addItem('Menu Item 3.1');
            menu_lvl2.addItem('Menu Item 3.2');

            return this;
        }

        this.instantiate = function () {
            return angular.copy(this);
        }

        this.toStatePath = function (path) {
            return path.replace(/\//g, '.').replace(/^\./, '');
        };

        this.setActive = function (path) {
            this.iterateCheck(this.menuItems, this.toStatePath(path));
        };

        this.setActiveParent = function (item) {
            item.isActive = true;
            item.isOpen = true;

            if (item.parent)
                this.setActiveParent(item.parent);
        };

        this.iterateCheck = function (menuItems, currentState) {
            angular.forEach(menuItems, function (item) {
                if (item.state == currentState) {
                    item.isActive = true;

                    if (item.parent != null)
                        $menuItemsRef.setActiveParent(item.parent);
                }
                else {
                    item.isActive = false;
                    item.isOpen = false;

                    if (item.menuItems.length) {
                        $menuItemsRef.iterateCheck(item.menuItems, currentState);
                    }
                }
            });
        }

    });

})();