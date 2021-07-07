/**
 * Send a push notification
 */
function notifyIFTTT(outsideTemp, nestTemp, particleTemp) {
  outsideTemp = parseFloat(outsideTemp);
  nestTemp = parseFloat(nestTemp);
  particleTemp = parseFloat(particleTemp);

  var minTemp = Math.min(nestTemp,particleTemp);

  var scriptProperties = PropertiesService.getScriptProperties();
  var storedData = scriptProperties.getProperties();
  if (!('morningNotified' in storedData)) { // Need to initialize
    reset_notifications();
  }
  var d = new Date();
  console.log(storedData);

  const morning_thresh = 3;
  const evening_thresh = 1;

  //Morning check
  if(d.getHours() <= 9) {
    storedData['eveningNotified']='false'; // Reset for evening
    storedData['eveningReady'] = 'false';
    if(storedData['morningNotified']=='true') { // Already notified this morning
    }
    else if(outsideTemp >= minTemp-morning_thresh && storedData['morningReady']=='true') { // Notify about temperature
      var str = (nestTemp<particleTemp ? "main level" : "upstairs");
      ifttt_notify("Consider closing windows: The "+str+" is "+minTemp.toFixed(1)+" and outside is "+outsideTemp.toFixed(1));
      storedData['morningNotified']='true';
    }
    else if(outsideTemp < minTemp-morning_thresh) { // At least one observation below threshold
      storedData['morningReady']='true';
    }
    scriptProperties.setProperties(storedData);
  }

  // If it is in the evening, check when to open windows (getting cooler outside)
  else if(d.getHours() >= 16) {
    storedData['morningNotified']='false'; // Reset for morning
    storedData['morningReady'] = 'false';
    if(storedData['eveningNotified']=='true') { // Already notified this evening
    }
    else if(outsideTemp <= minTemp-evening_thresh && storedData['eveningReady']=='true') { // Notify about temperature
      var str = (nestTemp<particleTemp ? "main level" : "upstairs");
      ifttt_notify("Consider opening windows: The "+str+" is "+minTemp.toFixed(1)+" and outside is "+outsideTemp.toFixed(1));
      storedData['eveningNotified']='true';
    }
    else if(outsideTemp > minTemp-evening_thresh) { // At least one observation above threshold
      storedData['eveningReady']='true';
    }
  }

  scriptProperties.setProperties(storedData);
}

// Reset the stored variables for notifications to re-enable
// Note that all variables in scriptProperties have to be Strings
function reset_notifications() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.deleteAllProperties();
  var storedData = {};
  storedData['morningNotified'] = 'false';
  storedData['eveningNotified'] = 'false';
  storedData['morningReady'] = 'false';
  storedData['eveningReady'] = 'false';
  console.log('Initialized stored variables');
  console.log(storedData);
  scriptProperties.setProperties(storedData);
}

// Send the chosen text to IFTTT to send as a push notification
function ifttt_notify(text) {
  url = 'https://maker.ifttt.com/trigger/'+IFTTT_NAME+'/with/key/'+IFTTT_KEY
  var data = {
    "value1": text
  };
  var payload = JSON.stringify(data);

  var headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Basic _authcode_"
  };

  var options = {
    "method": "POST",
    "contentType": "application/json",
    "headers": headers,
    "payload": payload
  };
  var response = UrlFetchApp.fetch(url, options);

  console.log("Notified: "+text);
}