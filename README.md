# Programme TV Calendar

Got a question? Join us on stackoverflow at fduriez

---
# Introduction 

What's the TV program tonight? Is there a good movie to watch? That's the question we try to answer with this app.

The way used here is simple, you launch the app and it will create an event in your Google Calendar for each good movie found for the next 7 days.
(Here "good movie" means movie being rated at least 4 stars by the spectators on http://www.allocine.fr/)

---
# Prerequisites 

* Node.js installed
* The npm package management tool (comes with Node.js)
* Access to the internet and a web browser
* A Google account with Google Calendar enabled

---
# How to use it

First of all, you have to follow the Step 1 here : https://developers.google.com/google-apps/calendar/quickstart/nodejs

Next, open a command prompt and go to the root directory of the app with `cd chemin/de/votre/app`

Then, to install all the dependencies contained in the package.json enter `npm install -a`

Finally, to launch the app, go to the src directory `cd src` and type the command below
`node app.js`

---
# Result 
![Result On CommandLine](Result/commandLine.png?raw=true "Optional Title")
![Result On Calendar](Result/Calendar.png?raw=true "Optional Title")