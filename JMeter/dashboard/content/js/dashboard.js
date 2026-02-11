/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "HTTP Request (Eliminar Paciente por id)"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request (Actualizar Medicamento por id)"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request (Actualizar Paciente por id)"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request (Eliminar Especialidad por id)"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request (Crear Pacientes)"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request (Actualizar Especialidad por id)"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request (Crear Doctor)"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request (Obtener Pacientes)"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request (Obtener Doctor)"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request (Obtener Medicamento)"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request (Crear Medicamento)"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request (Crear Especialidad)"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request (Actualizar doctor por id)"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request (Eliminar doctor por id)"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request (Eliminar Medicamento por id)"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request (Obtener Especialidad)"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3200, 0, 0.0, 4.479374999999997, 0, 144, 2.0, 4.0, 8.0, 71.98999999999978, 323.0365435089845, 190.46419152533818, 84.43982813446395], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request (Eliminar Paciente por id)", 200, 0, 0.0, 2.2199999999999993, 0, 43, 1.0, 2.0, 3.0, 38.99000000000001, 20.688941760628943, 12.282442846798386, 4.2024412951277546], "isController": false}, {"data": ["HTTP Request (Actualizar Medicamento por id)", 200, 0, 0.0, 4.894999999999997, 1, 72, 2.0, 3.0, 23.94999999999999, 71.0, 20.920502092050206, 13.116174163179915, 8.723685930962343], "isController": false}, {"data": ["HTTP Request (Actualizar Paciente por id)", 200, 0, 0.0, 4.034999999999997, 1, 72, 2.0, 3.0, 5.0, 69.97000000000003, 20.55076037813399, 12.200408446362516, 7.464100390464448], "isController": false}, {"data": ["HTTP Request (Eliminar Especialidad por id)", 200, 0, 0.0, 2.4899999999999993, 0, 45, 1.0, 2.0, 3.9499999999999886, 43.960000000000036, 20.805159679600543, 10.310338213877042, 4.327635753666909], "isController": false}, {"data": ["HTTP Request (Crear Pacientes)", 200, 0, 0.0, 5.045000000000006, 1, 120, 3.0, 4.0, 5.949999999999989, 116.49000000000046, 20.1999798000202, 11.834347540652459, 6.606813705686294], "isController": false}, {"data": ["HTTP Request (Actualizar Especialidad por id)", 200, 0, 0.0, 4.589999999999999, 1, 75, 2.0, 4.0, 6.899999999999977, 70.96000000000004, 20.669698222405952, 10.24320806634973, 5.156524519429516], "isController": false}, {"data": ["HTTP Request (Crear Doctor)", 200, 0, 0.0, 7.765, 2, 144, 3.0, 4.0, 23.64999999999992, 143.0, 20.41649652919559, 12.62991590955492, 7.426101852797061], "isController": false}, {"data": ["HTTP Request (Obtener Pacientes)", 200, 0, 0.0, 3.155000000000002, 0, 57, 2.0, 3.0, 4.0, 46.8900000000001, 20.51071684955389, 12.46717083504256, 3.224829504666188], "isController": false}, {"data": ["HTTP Request (Obtener Doctor)", 200, 0, 0.0, 3.5349999999999993, 0, 83, 1.0, 3.0, 18.799999999999955, 52.960000000000036, 20.73613271124935, 14.000939606013478, 3.2400207361327116], "isController": false}, {"data": ["HTTP Request (Obtener Medicamento)", 200, 0, 0.0, 3.9099999999999997, 1, 82, 2.0, 2.0, 25.849999999999966, 55.960000000000036, 20.870291140561413, 13.948956648492121, 3.3425075654805383], "isController": false}, {"data": ["HTTP Request (Crear Medicamento)", 200, 0, 0.0, 7.269999999999995, 2, 130, 3.0, 3.0, 29.499999999999886, 117.0, 20.54442732408834, 12.338694144838213, 7.443342321520288], "isController": false}, {"data": ["HTTP Request (Crear Especialidad)", 200, 0, 0.0, 7.080000000000001, 2, 141, 3.0, 5.0, 20.29999999999984, 138.98000000000002, 20.30663011473246, 9.964130241648899, 4.391705376180322], "isController": false}, {"data": ["HTTP Request (Actualizar doctor por id)", 200, 0, 0.0, 7.029999999999989, 1, 124, 3.0, 5.0, 24.199999999999818, 100.97000000000003, 20.80299563137092, 12.97058651445808, 8.907501430205949], "isController": false}, {"data": ["HTTP Request (Eliminar doctor por id)", 200, 0, 0.0, 2.5749999999999984, 0, 31, 2.0, 3.0, 7.7999999999999545, 29.980000000000018, 21.021652301870926, 13.10691809438722, 4.249494166491487], "isController": false}, {"data": ["HTTP Request (Eliminar Medicamento por id)", 200, 0, 0.0, 2.6400000000000015, 0, 43, 1.0, 2.0, 14.799999999999955, 41.930000000000064, 21.05484787872408, 13.20040267396568, 4.338450100010527], "isController": false}, {"data": ["HTTP Request (Obtener Especialidad)", 200, 0, 0.0, 3.435000000000003, 0, 57, 2.0, 3.9000000000000057, 11.64999999999992, 52.79000000000019, 20.620682544592228, 10.458351054232395, 3.342805959377255], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3200, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
