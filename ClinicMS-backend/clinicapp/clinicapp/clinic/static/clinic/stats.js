// // Hàm lấy dữ liệu thống kê
// function getStatsData(statsType) {
//     var url = statsDataURL;  // Use the defined URL variable
//     var data = {
//         type: statsType,
//     };
//
//     return $.ajax({
//         url: url,
//         type: "GET",
//         data: data,
//         dataType: "json",
//     });
// }
//
// // Hàm tạo line chart
// function createLineChart(ctx, labels, data, chartId) {
//     var chart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: 'Số lượng bệnh nhân',
//                 data: data,
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                 borderColor: 'rgba(75, 192, 192, 1)',
//             }]
//         },
//         options: {
//             // Tùy chỉnh chart
//             scales: {
//                 yAxes: [{
//                     ticks: {
//                         beginAtZero: true
//                     }
//                 }]
//             }
//         }
//     });
//
//     return chart;
// }
//
// // Lấy dữ liệu và tạo chart khi DOM ready
// $(document).ready(function () {
//     var urlParams = new URLSearchParams(window.location.search);
//     var statsType = urlParams.get('type')
//     console.log(statsType);
//
//     // Array of chart types to loop through
//     var chartTypes = ['month', 'quarter', 'year'];
//
//     chartTypes.forEach(function (type) {
//         if (statsType === type || statsType === 'all') {
//             getStatsData(type).then(function (response) {
//                 var labels = response.labels;
//                 var data = response.data;
//
//                 var ctx = document.getElementById('chart-' + type + '-patients').getContext('2d');
//                 var chart = createLineChart(ctx, labels, data, 'chart-' + type + '-patients');
//             });
//         }
//     });
// });
