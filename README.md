# E-Commerce Mobile Application
An e-commerce mobile application developed using Ionic Framework with Cordova / Phonegap integrating with Prestashop E-Commerce webservice.

![Alt text](/documentation/project-intro.jpg "Overview")

# Overview
This relase of the project was a first initial sprint developed in Aug 2015. It was developed using [Ionic Framework version 1.1.0](https://ionicframework.com/docs/v1/) and [AngularJS version 1.4.3](https://angularjs.org/). The main purpose of the project is to have a mobile app intergrating with an existing prestashop website. 

<img align="right" src="/documentation/app-demo225x400.gif">

# Demo
### E-Commerce Mobile Application
There are two ways to view the demo of this app.
For a better debugging experience, the first way is to view the demo through a **web browser**. 
For a better mobile app experience, the second way is to download the **phonegap developer app** and view the demo on your mobile device.

Please use the link or the server address below: 
1. **Web Browser** - http://159.89.103.218:8100/
2. [**PhoneGap Developer app**](http://docs.phonegap.com/getting-started/2-install-mobile-app/) - 159.89.103.218:3000

### E-Commerce Website
This demo is intergrated with an online e-commerce store powered by Prestashop. Please visit the link below to view the online store website:
- **Front office** - http://159.89.103.218/prestashop
    - username: test@test.com
    - password: testtest
- **Back office** - http://159.89.103.218/prestashop/admin1618 
    - username: demo@demo.com 
    - password: demodemo

# Getting started
Follow these steps if you are planning to setup this project in your development environment. Be sure that you have installed [NodeJS](https://nodejs.org/) and [NPM](https://www.npmjs.com/) on your environment.
If you are new to Ionic, Angular, Cordova or Phonegap, please refer to their documentation.

Step 1: Install Ionic
```
npm install -g cordova ionic
```
Step 2: Start a project
```
$ ionic start myshop --type ionic1
```
Step 3: Clone this repository or download the project and save it to myshop/www folder.

Step 4: Run the App
```
$ cd myshop
ionic serve
```
