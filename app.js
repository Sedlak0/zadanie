import http from 'http';
import * as convert from 'xml-js';
import axios  from 'axios';
var port = 9876;
const response = await axios.get('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml');
//console.log(response);
var xml = response.data;
//console.log(xml);
var o = {};
//var xml = '<gesmes:Envelope xmlns:gesmes="http://www.gesmes.org/xml/2002-08-01" xmlns="http://www.ecb.int/vocabulary/2002-08-01/eurofxref"><gesmes:subject>Reference rates</gesmes:subject><gesmes:Sender><gesmes:name>European Central Bank</gesmes:name></gesmes:Sender><Cube><Cube time="2025-01-31"><Cube currency="USD" rate="1.0393"/><Cube currency="JPY" rate="160.99"/><Cube currency="BGN" rate="1.9558"/><Cube currency="CZK" rate="25.166"/><Cube currency="DKK" rate="7.4618"/><Cube currency="GBP" rate="0.83608"/><Cube currency="HUF" rate="407.95"/><Cube currency="PLN" rate="4.2130"/><Cube currency="RON" rate="4.9767"/><Cube currency="SEK" rate="11.4740"/><Cube currency="CHF" rate="0.9449"/><Cube currency="ISK" rate="146.70"/><Cube currency="NOK" rate="11.7373"/><Cube currency="TRY" rate="37.2655"/><Cube currency="AUD" rate="1.6702"/><Cube currency="BRL" rate="6.0677"/><Cube currency="CAD" rate="1.5035"/><Cube currency="CNY" rate="7.5363"/><Cube currency="HKD" rate="8.0990"/><Cube currency="IDR" rate="16941.21"/><Cube currency="ILS" rate="3.7199"/><Cube currency="INR" rate="89.9945"/><Cube currency="KRW" rate="1506.62"/><Cube currency="MXN" rate="21.4769"/><Cube currency="MYR" rate="4.6301"/><Cube currency="NZD" rate="1.8391"/><Cube currency="PHP" rate="60.682"/><Cube currency="SGD" rate="1.4091"/><Cube currency="THB" rate="34.915"/><Cube currency="ZAR" rate="19.3588"/></Cube></Cube></gesmes:Envelope>';

var server = http.createServer(function (req, res) {
    res.write(JSON.stringify(o));
    res.end();
});

server.listen(port, function (error) {
    if (error) {
        console.log('Error', error);
    }
    else {
        console.log('Listening on Port ' + port)
        var result = convert.xml2js(xml);
        var unparsed = JSON.stringify(result, null, 2);
        var cube = result.elements[0].elements[2].elements[0];
        //console.log(unparsed);
        //console.log(cube.attributes.time);
        
        o.date = cube.attributes.time;
        o.rate = {};
        o.rates = [];
        for (let i = 0; i < cube.elements.length; i++) {
            o.rate[cube.elements[i].attributes.currency] = parseFloat(cube.elements[i].attributes.rate);
            o.rates.push({
                "name": cube.elements[i].attributes.currency,
                "rate": parseFloat(cube.elements[i].attributes.rate)
            });
        }
        //console.log(JSON.stringify(o));
    }
});