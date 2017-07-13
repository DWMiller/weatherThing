require('dotenv').config({ path: 'variables.env' });

const fetch = require('node-fetch');

//Remember to add variables.env file containing api key
const key = process.env.WEATHER_KEY;

const cities = [
  'zmw:00000.52.71297', //Hamilton
  'zmw:00000.176.71508', // Toronto
  'Canada/Calgary',
  'Pakistan/Karachi',
  'zmw:00000.1.40582', // Kuwait City
];

const data = [];

function parse(location, todaysForcast) {
  const city = location.city;

  const { low, high } = todaysForcast;

  return {
    time: new Date(),
    city,
    low: low.celsius,
    high: high.celsius,
  };
}

function print({ time, city, low, high }) {
  console.log(`Time: ${time}, City: ${city}, Low: ${low}, High: ${high}`);
}

async function run(cities) {
  const forecasts = await Promise.all(
    cities.map(city => {
      const url = `http://api.wunderground.com/api/${key}/geolookup/forecast/q/${city}.json`;
      return fetch(url)
        .then(function(res) {
          return res.json();
        })
        .then(data => {
          return parse(
            data.location,
            data.forecast.simpleforecast.forecastday[0]
          );
        });
    })
  );

  forecasts.forEach(print);
}

run(cities);
