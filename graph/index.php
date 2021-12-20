<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="css/style.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="js/funnel.js"></script>


    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js"></script>



    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/data.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>

    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js"></script>
    <title>Document</title>
</head>

<body>
    <style>
        #hight_container {
            width: 100%;
            height: 100%;
        }
    </style>



    <div class="hight_container" id="hight_container"></div>


    <script>
        let b = <?php echo $_GET['b']; ?>

        let k = <?php echo $_GET['k']; ?>

        let diag = {
            chart: {
                type: 'spline'
            },
            title: {
                text: ''
            },

            legend: {
                accessibility: {
                    enabled: false
                }
            },
            subtitle: {
                text: ''
            },
            xAxis: {},
            yAxis: {
                title: {
                    text: 'Вероятность, %'
                },
                min: 0
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '<strong>Вероятность: </strong> {point.y} <br><strong>Наценка: </strong> {point.х} '
            },

            plotOptions: {
                series: {
                    marker: {
                        enabled: true
                    }
                }
            },

            colors: ['forestgreen', 'red', ],


            series: [{

                name: "Регрессия",
                data: [
                    [0, b],
                    [-b / k, 0]
                ]

            }, {

                name: "Регрессия2",
                data: [
                    [0, b],
                    [100, k*100+b]
                ]
            }],

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        plotOptions: {
                            series: {
                                marker: {
                                    radius: 2.5
                                }
                            }
                        }
                    }
                }]
            }
        }

        //debugger

        let chart = Highcharts.chart('hight_container', diag);

        //debugger
        //  chart.setSize(200, 150)
    </script>

</body>

</html>