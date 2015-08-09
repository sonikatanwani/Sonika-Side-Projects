function DisplayData() {
    $("#display").empty();
    $("#curve_chart").empty();
    $("#displayError").empty();

    var symbol = $('#symbol').val();
    if (symbol) {
        var query = ConstructQuery(symbol);
        RetreiveData(query, ConstructChart, DisplayError);
    }
    else {
        $("#displayError").append('<span class="showError"> Enter valid value for Symbol. It cannot be null or empty. </span>');
    }
}


function ConstructQuery(symbol) {
    var url = 'http://query.yahooapis.com/v1/public/yql';
    var startDate = '2015-01-01';
    var endDate = '2015-07-01';
    var querystr = encodeURIComponent('select * from yahoo.finance.historicaldata where symbol in ("' + symbol + '") and startDate = "' + startDate + '" and endDate = "' + endDate + '"');
    var fullURL = url + '?q=' + querystr + "&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json";
    return fullURL;
}


function ConstructChart(dataObj) {
    var result = dataObj.query.results;

    if (result !== null) {
        var dataToShow = result.quote;
        var chart = '<table><tr><th>Adj_Close</th><th>Close</th><th>Date</th><th>High</th><th>Low</th><th>Open</th><th>Symbol</th><th>Volume</th></tr>';
        var lineChartData = new Array();

        lineChartData.push(['Date', 'Close'])
        for (var i = 0; i < dataToShow.length; i++) {
            chart += '<tr><td>' + dataToShow[i]["Adj_Close"] + '</td>' +
                '<td>' + dataToShow[i]["Close"] + '</td>' +
                '<td>' + dataToShow[i]["Date"] + '</td>' +
                '<td>' + dataToShow[i]["High"] + '</td>' +
                '<td>' + dataToShow[i]["Low"] + '</td>' +
                '<td>' + dataToShow[i]["Open"] + '</td>' +
                '<td>' + dataToShow[i]["Symbol"] + '</td>' +
                '<td>' + dataToShow[i]["Volume"] + '</tr>';

            var arrayObj = new Array();
            arrayObj[0] = dataToShow[i]["Date"];
            arrayObj[1] = parseInt(dataToShow[i]["Close"]);

            lineChartData.push(arrayObj);
        }
        chart += '</table>';
        console.log(lineChartData);
        $("#display").append(chart);


    } else {
        $("#displayError").append('<span class="showError"> No data was retreived. May be you entered an invalid symbol. Please enter a correct sybmol </span>');
        $("#curve_chart").append('There is no data to display');
        $("#display").append('There is no data to display');

    }
    drawChart(lineChartData);
}

function DisplayError() {
    alert("Some Error occured; Cannot display data");
}

function drawChart(lineChartData) {
    var data = google.visualization.arrayToDataTable(lineChartData);

    var options = {
        title: 'Stock Close Value Graph',
        curveType: 'function',
        legend: {position: 'bottom'},
        width: '1900px'

    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}

$(document).ready(function () {
    function close_accordion_section() {
        $('.accordion .accordion-section-title').removeClass('active');
        $('.accordion .accordion-section-content').slideUp(300).removeClass('open');
    }

    $('.accordion-section-title').click(function (e) {
        // Grab current anchor value
        var currentAttrValue = $(this).attr('href');

        if ($(e.target).is('.active')) {
            close_accordion_section();
        } else {
            close_accordion_section();

            // Add active class to section title
            $(this).addClass('active');
            // Open up the hidden content panel
            $('.accordion ' + currentAttrValue).slideDown(300).addClass('open');
        }

        e.preventDefault();
    });
});