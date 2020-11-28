/*
 Template Name: Admiria - Bootstrap 4 Admin Dashboard
 Author: Themesbrand
 File: Dashboard Init
*/


// Combine chart
var combineChartData = JSON.parse(document.getElementById('combineChartData').value)
var anonymousRevenue = combineChartData.anonymous
var userRevenue = combineChartData.user
var restockCost = combineChartData.restock
// Sales analytics
var analyticsData = JSON.parse(document.getElementById('analyticsData').value)
var processingPercent = (analyticsData.processing) ? analyticsData.processing.percentData : 0
var packingPercent = (analyticsData.packing) ? analyticsData.packing.percentData : 0
var deliveringPercent = (analyticsData.delivering) ? analyticsData.delivering.percentData : 0
var donePercent = (analyticsData.done) ? analyticsData.done.percentData : 0
var cancelledPercent = (analyticsData.cancelled) ? analyticsData.cancelled.percentData : 0

!function($) {
    "use strict";
    
    var Dashboard = function() {};

    Dashboard.prototype.init = function () {

        // Peity line
        $('.peity-line').each(function() {
            $(this).peity("line", $(this).data());
        });

        //Knob chart
        $(".knob").knob();

        //C3 combined chart
        c3.generate({
            bindto: '#combine-chart',
            data: {
                columns: [
                    // ['SonyVaio', 30, 20, 50, 40, 60, 50],
                    ['Anonymous', ...anonymousRevenue],
                    ['User', ...userRevenue],
                    // ['Tablets', 300, 200, 160, 400, 250, 250],
                    // ['iPhones', 200, 130, 90, 240, 130, 220],
                    ['Restock', ...restockCost]
                ],
                types: {
                    Anonymous: 'bar',
                    User: 'bar',
                    // Tablets: 'spline',
                    // iPhones: 'line',
                    Restock: 'line'
                },
                colors: {
                    Anonymous: '#5468da',
                    User: '#4ac18e',
                    // Tablets: '#ffbb44',
                    // iPhones: '#ea553d',
                    Restock: '#6d60b0'
                },
                groups: [
                    ['Anonymous','User']
                ]
            },
            axis: {
                x: {
                    type: 'categorized'
                }
            }
        });

        //C3 Donut Chart
        c3.generate({
            bindto: '#donut-chart',
            data: {
                columns: [
                    ['Processing', processingPercent],
                    ['Packing', packingPercent],
                    ['Delivering', deliveringPercent],
                    ['Done', donePercent],
                    ['Cancelled', cancelledPercent]
                ],
                type : 'donut'
            },
            donut: {
                title: "Sales Analytics",
                width: 30,
                label: {
                    show:false
                }
            },
            color: {
                pattern: ["#67a8e4", "#6d60b0","#f06292","#28a745","#fb8c00"]
            }
        });

    },
        $.Dashboard = new Dashboard, $.Dashboard.Constructor = Dashboard

}(window.jQuery),

//initializing
    function($) {
        "use strict";
        $.Dashboard.init()
    }(window.jQuery);