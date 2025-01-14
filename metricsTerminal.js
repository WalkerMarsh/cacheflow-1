const readline = require('readline');
const fs = require('fs');

const globalMetricsData = fs.readFileSync('./globalMetrics.json', 'utf-8');
const jsonGMD = JSON.parse(globalMetricsData);

const localMetricsData = fs.readFileSync('./localMetricsStorage.json', 'utf-8');
const jsonLMD = JSON.parse(localMetricsData);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function terminalPrompt() {
  rl.question(
    '\nEnter your desired metrics:\n --> Global Metrics\n --> Name of Resolver\n\n=======================================================================================================\n\n',
    (answer) => {
      if (
        answer.toLowerCase() === 'global metrics' ||
        answer.toLowerCase() === 'global'
      ) {
        console.log(
          '\n======================================================================================================='
        );
        console.log(
          '\nTotal Number of Query Requests: ' +
            jsonGMD.totalNumberOfRequests +
            ' requests'
        );
        console.log('Total Time Saved: ' + jsonGMD.totalTimeSaved + ' ms');
        console.log(
          'Total Amount of Data Saved to Redis: ' +
            jsonGMD.sizeOfDataRedis +
            ' bytes'
        );
        console.log(
          'Total Amount of Data Saved Locally: ' +
            jsonGMD.sizeOfDataLocal +
            ' bytes'
        );
        console.log(
          '\n======================================================================================================='
        );
      } else {
        if (jsonLMD[answer]) {
          console.log(
            '\n=======================================================================================================',
            `\n\nData for "${answer}":`
          );
          console.log(
            '\nFirst Time Called: ',
            new Date(jsonLMD[answer].firstCall).toString()
          );
          console.log(
            'Last Time Called: ',
            new Date(
              jsonLMD[answer].allCalls[jsonLMD[answer].allCalls.length - 1]
            ).toString()
          );
          console.log('Number of Calls: ' + jsonLMD[answer].numberOfCalls);
          console.log(
            'Average Time Between calls: ',
            jsonLMD[answer].averageCallSpan === 'Insufficient Data'
              ? 'Insufficient Data'
              : jsonLMD[answer].averageCallSpan + ' ms'
          );
          console.log(
            'Time Saved by Caching: ' +
              (jsonLMD[answer].uncachedCallTime -
                jsonLMD[answer].cachedCallTime) +
              ' ms'
          );
          console.log(
            'Size of Cached Query: ' + jsonLMD[answer].dataSize + ' bytes'
          );
          console.log(
            'Location of Cached Data:',
            jsonLMD[answer].storedLocation
          );
          console.log(
            '\n======================================================================================================='
          );
        } else {
          console.log('\nNo Cached Data Found for', `"${answer}"`);
        }
      }
      terminalPrompt();
    }
  );
}

terminalPrompt();
