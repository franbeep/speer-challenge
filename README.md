## SERN App
Created with [Create React App](https://github.com/facebook/create-react-app) and the [SERN template](https://github.com/julian-hecker/cra-template-sern).

Makes it easy to connect the frontend to the backend out-of-the-box.

## Available Scripts

### `yarn start`
Runs the server for production

### `yarn dev`
Runs the frontend and backend servers simultaneously in development mode.

### `yarn start-react`
Starts only the react development server (no backend)

### `yarn build`
Creates a production build

### `yarn test`
Runs tests (not implemented by default)

### `yarn eject`
Ejects react app (won't be able to receive CRA updates)


## Output

```bash
project-root
├───public/ # static files for react app
│   ├───favicon.ico # icon displayed in browser tab
│   ├───index.html # includes all js
│   ├───logo192.png 
│   ├───logo512.png
│   ├───manifest.json # used in PWAs
│   └───robots.txt # specifies web crawler rules
├───server/ # backend
│   ├───bin/ # server executable
│   ├───config/ # database config
│   ├───controllers/ # functions 
│   ├───models/ # database models
│   ├───routes/ # api routes
│   ├───utils/ # shared functions
│   └───index.js # main server file
├───src/ # react source files
│   ├───components/ # reusable components
│   │   ├───Footer/ 
│   │   └───Navbar/
│   ├───routes/ # Router and pages go here
│   └───index.js # Main Entry Point
├───.env # store environment variables
├───.env.example # share env keys without exposing values
├───.gitignore
├───.prettierrc.json # prettier plugin configuration
├───package-lock.json
├───package.json # dependencies, scripts
└───README.md # guide
```


## Generate Favicons
Very useful site to create the required favicons [https://favicon.io/favicon-converter/]
