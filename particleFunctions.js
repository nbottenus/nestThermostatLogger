/**
 * Ask Particle Photon for current temperature data
 * 
 * Photon should be running a script with a published variable named "temperature" and an update function "updateTemp"
 */
function retrieveParticleTemperature () {
  const tempArray = [];

  const url1 = 'https://api.particle.io/v1/devices/'+PARTICLE_DEVICE+'/updateTemp?access_token='+PARTICLE_ACCESS_TOKEN;
  const url2 = 'https://api.particle.io/v1/devices/'+PARTICLE_DEVICE+'/temperature?access_token='+PARTICLE_ACCESS_TOKEN;

  try {
    const response1 = UrlFetchApp.fetch(url1,{"method":"POST"});
    console.log(JSON.parse(response1.getContentText()));
    const response2 = UrlFetchApp.fetch(url2);
    const mydata = JSON.parse(response2.getContentText());

    console.log(mydata);

    // parse the data
    const temperature = mydata['result'];
    tempArray.push(
      temperature
    );
  }
  catch (e) {
    console.log('Error: ' + e);
  }

  console.log(tempArray);
  return tempArray;
}
