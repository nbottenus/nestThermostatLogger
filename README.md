# Nest Thermostat Logger

Project to log data from Google Nest thermostats into a Google Sheet, using the Smart Device Management (SDM) API and Apps Script. It also uses the weather.gov API to add local weather data.

The SDM API was launched in September 2020 ([read more](https://developers.googleblog.com/2020/09/google-nest-device-access-console.html)).

# Setup

Follow the steps in this [Get Started](https://developers.google.com/nest/device-access/get-started) guide from Google to access your device(s).

**Note:** there is a one-time, non-refundable $5 charge to access the API.

The project must be created in the same Google account as the Nest home devices are connected to.

You will need to create a project in your [Google Cloud console](https://console.cloud.google.com/), where you can get OAuth ID and secret.

This project uses the [OAuth2 Apps Script library](https://github.com/googleworkspace/apps-script-oauth2).

# Useful API Documentation

[Get Device list](https://developers.google.com/nest/device-access/reference/rest/v1/enterprises.devices/list)

[Get Device data](https://developers.google.com/nest/device-access/reference/rest/v1/enterprises.devices/get)

And yes, it's possible to set your thermostat temperature from your Google Sheet, at this [endpoint](https://developers.google.com/nest/device-access/traits/device/thermostat-temperature-setpoint)

# More Info

Tutorial: [Control Your Nest Thermostat And Build A Temperature Logger In Google Sheets Using Apps Script](https://www.benlcollins.com/apps-script/nest-thermostat/)

I followed the above tutorial with the clarification:

* At step 15, run the function showSidebar() from oauth2.gs, and find the sidebar back in the google sheet. This provides the necessary authentication link to make the rest of the API calls work.

# Additional services

I have switched the weather service to [OpenWeatherMap](https://openweathermap.org/) due to the weather.gov data returning blank temperatures frequently. It is free to create an account and obtain an API key for current weather.

I am using an additional indoor temperature sensor, created with a [Particle Photon](https://docs.particle.io/photon/) wifi-equipped microcontroller and DS18B20 temperature sensor. The temperature variable and update function are exposed to the cloud and accessible by a personal [access token](https://docs.particle.io/reference/device-cloud/api/) (created on the command line interface)

I am using [IFTTT](https://ifttt.com/home), with the app installed on an Android phone, to enable push notifications based on relative temperature inside and outside.
