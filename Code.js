/**
 * Custom menu to use tool from Sheet UI
 */
function onOpen() {
  
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('Smart Device Tool')
    .addItem('Smart Device Tool', 'showSidebar')
    .addSeparator()
    .addItem('Log thermostat data','logThermostatDataAllDevices')
    .addToUi();
  
}

/**
 * Make request to all APIs and log to spreadsheet
 */
function logThermostatDataAllDevices() {
  
  const d = new Date();

  const nestDataArray = retrieveNestData();
  //console.log(nestDataArray);

  //const weatherDataArray = retrieveWeather(WEATHER_STATION);
  const weatherDataArray = retrieveOpenWeather(ZIP);
  //console.log(weatherDataArray);

  const particleDataArray = retrieveParticleTemperature();
  //console.log(particleDataArray);
  
  let dataArray = [];
  dataArray.push([d].concat(nestDataArray,weatherDataArray,particleDataArray));

  // get the Sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME); // Make sure you have a sheet with this name!

  // output the data
  sheet.getRange(sheet.getLastRow()+1,1,dataArray.length,dataArray[0].length).setValues(dataArray);

  // 
  const nestTemp = nestDataArray[5];
  const outsideTemp = weatherDataArray[1];
  const particleTemp = particleDataArray[0];
  notifyIFTTT(outsideTemp, nestTemp, particleTemp);

}




