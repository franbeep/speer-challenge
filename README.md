## Speer Challenge App

<h1 align="center">
  Speer - Challenge
</h1>

<p align="center">
  🦆🦆🦆
</p>

<p align="center">
  A backend mock of a twitter-like app.
</p>

<p align="center">
  <a href="#">
    <img alt="CircleCI" src="https://img.shields.io/circleci/build/github/franbeep/speer-challenge/main">
  </a>
  <a href="https://sonarcloud.io/api/project_badges/measure?project=franbeep_speer-challenge&metric=coverage">
    <img alt="Sonar Coverage" src="https://img.shields.io/sonar/coverage/franbeep_speer-challenge?server=https%3A%2F%2Fsonarcloud.io">
  </a>
  <a href="https://sonarcloud.io/dashboard?id=franbeep_speer-challenge">
    <img alt="Quality Gate Status" src="https://sonarcloud.io/api/project_badges/measure?project=franbeep_speer-challenge&metric=alert_status">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

<h2>About</h2>

<p>
  Challenge provided my Speer Technologies for a Back End internship position. This is a demo on a twitter-esque clone API, with authentication and a few models.
</p>

<h2>Instructions</h2>

There are 2 ways of running this project: You can either install mongodb, start it and add its path/port/database to the environment file `.env`, or you can download `docker-compose` and just do a `docker-compose build`.

<h2>Considerations</h2>

Here I will list a few conclusions I have reached, and parts of the architectural choices that I used on this project.

- I felt that some middleware route/controller related should be in the controller folder, instead of the middlware folder, because the ones on the middlware folder would be (If I hade to write any) related to a global aspect of the application. Sadly there wasn't any that I could think of.
- I confess the error handling was a bit lacking. I can only think that the main motive was that I have opted to use JavaScript instead of a static typed language like TypeScript for ease of use and fast prototyping. With TypeScript I agree that error handling would make much more sense (with different kinds of exceptions) and would be more present.
- Even though you were free to choose the technologies, I opted for a stack more closer to what the position entailed. I have a strong background on SQL, so it was a bit awkaward sometimes.
- I opted for using JWT instead of OAuth2 that would attend more the needs of a twitteresque application because it was simply faster to implement, although testing its expiration use cases becomes much harder.
- As I said, I have a strong background on SQL, so I wouldn't know about performance on NoSQL databases. I tried to optimize the best I could the Mongoose queries.
- I first thought about using Redis and Websockets to solve the chat requirement. I ended up abandoning Redis and focusing only on WebSockets, since it wasn't explained that it should retain messages. Also, for tests, since it is not a http endpoint, I used a chrome extension to send/receive messages from the WebSocket endpoint.
- All endpoints were tested with jest and postman.
- Just a small detail that I didn't indexed Tweet by mistake, I should have had. I sincerely forgot to do, however I'd like to leave the code as it was before the submission due.

<h3>Thanks!</h3>
