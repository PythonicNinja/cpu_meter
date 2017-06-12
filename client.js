var interval;
var websocket;

var websocketEchoServerUri = "ws://127.0.0.1:5678/";
var chartData = []; //will be updated by our simulated server
var startButton = document.getElementById('start-demo');
var endButton = document.getElementById('end-demo');
var chart = AmCharts.makeChart("chartdiv", {
    "type": "serial",
    "theme": "light",
    "valueAxes": [{
        "id": "v1",
        "position": "left"
    }],
    "graphs": [
        {
            "title": "user",
            "valueField": "user",
            "bullet": "round",
            "bulletSize": 10,
            "bulletBorderColor": "#ffffff",
            "bulletBorderAlpha": 1,
            "bulletBorderThickness": 2
        },
        {
            "title": "system",
            "valueField": "sys",
            "bullet": "round",
            "bulletSize": 10,
            "bulletBorderColor": "#ffffff",
            "bulletBorderAlpha": 1,
            "bulletBorderThickness": 2
        },
        {
            "title": "idle",
            "valueField": "idle",
            "bullet": "round",
            "bulletSize": 10,
            "bulletBorderColor": "#ffffff",
            "bulletBorderAlpha": 1,
            "bulletBorderThickness": 2
        }
    ],
    "categoryField": "date",
    "categoryAxis": {
        "parseDates": true,
        "equalSpacing": true,
        "dashLength": 1,
        "minorGridEnabled": true
    },
    "dataProvider": chartData,
    "legend": {}
});

startButton.addEventListener('click', startDemo);
endButton.addEventListener('click', endDemo);

function startDemo() {
    startButton.disabled = "disabled";
    endButton.disabled = "";
    websocket = initWebSocket(websocketEchoServerUri);
}

function endDemo() {
    startButton.disabled = "";
    endButton.disabled = "disabled";
    websocket.close();
}

function initWebSocket(wsUri) {
    var ws = new WebSocket(wsUri);
    ws.onopen = onConnect;
    ws.onclose = onClose;
    ws.onerror = onError;
    ws.onmessage = updateChart;
    return ws;
}


function updateChart(wsEvent) {
    var newData = JSON.parse(wsEvent.data);

    chartData.push.apply(chartData, [
        {
            "date": newData.ts,
            "user": newData.data.user,
            "sys": newData.data.sys,
            "idle": newData.data.idle
        }
    ]);
    // keep only 50 datapoints on screen for the demo
    if (chartData.length > 50) {
        chartData.splice(0, chartData.length - 50);
    }
    writeToScreen("Received: " + wsEvent.data);
    chart.validateData();
}

function onConnect(wsEvent) {
    writeToScreen("Server connection successful. Listening for data now.");
}

function onError(wsEvent) {
    writeToScreen("<span style='color: red'>ERROR:" + wsEvent + "</span>");
}

function onClose(wsEvent) {
    writeToScreen("Server connection closed");
    clearInterval(interval);
}

//For debug messaging
function writeToScreen(message) {
    console.log(message);
}
