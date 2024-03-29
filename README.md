# TV Show DOM Project

A starting point for CYF's TV show DOM project

The requirements for the project are here:

https://syllabus.codeyourfuture.io/js-core-3/tv-show-dom-project/readme

## Solution

The solution to this project will be given to you after you have completed it. You will be able to find the solution here

https://github.com/CodeYourFuture/tv-show-dom-project-solution

## Jack's Project Plan

|  Task    |Est. Start|  Est.End |Act. Start|Act. End  | Status  | Remarks  |
|----------|----------|----------|----------|----------|---------|----------|
|  Setup   |2022-02-20|2022-02-26|2022-02-20|TBC       | Started |          |
|  Lvl 100 |2022-02-20|2022-02-26|2022-02-20|2022-02-26| Done    |          |
|  Lvl 200 |2022-02-20|2022-02-26|2022-02-20|2022-02-26| Done    |          |
|  Lvl 300 |2022-02-27|2022-03-05|2022-02-27|2022-02-27| Done    |          |
|  Lvl 350 |2022-02-27|2022-03-05|2022-02-27|2022-02-27| Done    |          |
|  Lvl 400 |2022-03-04|2022-03-11|2022-03-05|2022-03-05| Done    |          |
|  Lvl 500 |2022-03-04|2022-03-11|2022-03-05|2022-03-05| Done    |          |

## Project Structure

This is a NPM project designed to edited by VSCode IDE.

### Project Initilisation
```npm install```
## Unit and End-to-End (e2e) Testing

This project adopts [Cypress](https://cypress.io) testing framework for all testings.

1. Start the index.html by using the Live Server extension's Go Live function.

2. Open Terminal, start interactive Cypress test by running
```./node_modules/cypress/bin/cypress open```

3. (Optional) If the Cypress test cannot connect to the hosted index.html. Edit `/cypress/integration/lvl_100_spec.js` and change the port number (e.g. 5502) to the port used by Live Server.

4. Run automated Cypress test 
`./node_modules/cypress/bin/cypress run --reporter json`.
Watch recorded screenshots and video at `./cypress/screenshots` and `./cypress/videos` directory


