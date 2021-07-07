#include <DS18B20.h>
#define dsData D6

String temperature;
DS18B20  ds18b20(dsData, true); 

void setup() {
    Particle.variable("temperature", temperature);
    Particle.function("updateTemp", updateTemp);
    updateTemp("");
    RGB.control(true);
    RGB.color(0,0,20);
}

void loop() {
}

const int MAXRETRY = 4;
int updateTemp(String s){
  float _temp;
  int i = 0;

  do {
    _temp = ds18b20.getTemperature();
  } while (!ds18b20.crcCheck() && MAXRETRY > i++);

  if (i < MAXRETRY) {
    temperature = String(ds18b20.convertToFahrenheit(_temp));
    return 0;
  }
  else {
    temperature = "";
    return -1;
  }
}

