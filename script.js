const fileInput = document.getElementById('fileInput');
const dataTable = document.getElementById('dataTable');
const chartsContainer = document.getElementById('chartsContainer');
const createReportButton = document.querySelector('.generate-report button');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const chartTypeSelect = document.getElementById('chart-type');

let csvData = [];

fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        fileNameDisplay.textContent = file.name;
        Papa.parse(file, {
            header: true,
            complete: function(results) {
                csvData = results.data;
                displayCSVData(csvData);
            }
        });
    }
});

createReportButton.addEventListener('click', function() {
    if (csvData.length > 0) {
        generateCharts(csvData);
    } else {
        alert('Please upload a CSV file first.');
    }
});

function displayCSVData(data) {
    dataTable.innerHTML = ''; // Clear existing table
    const headers = Object.keys(data[0]);
    const tableHeader = dataTable.insertRow();
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tableHeader.appendChild(th);
    });

    data.forEach(row => {
        const tableRow = dataTable.insertRow();
        headers.forEach(header => {
            const cell = tableRow.insertCell();
            cell.textContent = row[header];
        });
    });
}

function generateCharts(data) {
    chartsContainer.innerHTML = ''; // Clear existing charts

    if (data.length === 0) return;

    const columns = Object.keys(data[0]);
    const colors = ['#32ac4a', '#317c3d', '#26522d', '#1e3f23', '#152d18'];
    const chartType = chartTypeSelect.value;

    columns.forEach(column => {
        const chartContainer = document.createElement('div');
        chartsContainer.appendChild(chartContainer);

        const seriesData = data.map(row => parseFloat(row[column]) || 0);
        const categories = data.map(row => row[columns[0]] || `Row ${data.indexOf(row) + 1}`);

        Highcharts.chart(chartContainer, {
            chart: {
                type: chartType,
                events: {
                    load: function() {
                        const chart = this;
                        setTimeout(function() {
                            const rightPosition = chart.chartWidth - 150;
                            const logoWidth = 140; // Adjust this as per your logo size
                            const logoHeight = 60; // Adjust this as per your logo size
                            chart.renderer.image('images/logo.png', rightPosition, 10, logoWidth, logoHeight)
                                .add();
                        }, 0);
                    }
                }
            },
            title: {
                text: `${column} (CO<sub>2</sub>)`,
                useHTML: true
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                title: {
                    text: column
                }
            },
            series: [{
                name: column,
                data: seriesData,
                color: colors[0]
            }],
            plotOptions: {
                column: {
                    colorByPoint: true,
                    colors: colors
                },
                bar: {
                    colorByPoint: true,
                    colors: colors
                },
                area: {
                    color: colors[0]
                },
                scatter: {
                    color: colors[0]
                },
                bubble: {
                    color: colors[0]
                },
                heatmap: {
                    colsize: 1
                },
                pie: {
                    innerSize: '50%',
                    dataLabels: {
                        format: '{point.name}: {point.y:.1f}%'
                    }
                },
                polar: {
                    markers: {
                        enabled: true
                    }
                },
                waterfall: {
                    colorByPoint: true
                }
            },
            credits: {
                enabled: false
            },
            tooltip: {
                formatter: function() {
                    return `<b>${this.x}</b><br>${this.series.name}: ${this.y}`;
                }
            }
        });
    });
}

const companyInput = document.getElementById('company');
const closeBtnCompany = document.getElementById('close-btn-company');

closeBtnCompany.addEventListener('click', function() {
    companyInput.value = '';
    companyInput.focus();
});

const deliveryServicesInput = document.getElementById('delivery-services-Provider');
const closeBtnDeliveryServices = document.getElementById('close-btn-delivery-services');

closeBtnDeliveryServices.addEventListener('click', function() {
    deliveryServicesInput.value = '';
    deliveryServicesInput.focus();
});