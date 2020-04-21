# Paaspop Quiz
An quiz filled with knowledge- and entertainment-based question about the artists and acts at Paaspop, to entertain and maintain the audience at a given stage.

__This game runs on the [Paaspop server](https://git.fhict.nl/delta-projecten/paaspop/paaspop-server.git). More information on the it's setup, usage, structure, and connections can be found in the Paaspop server wiki.__


## Setup
Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/).

To clone and run this repository you'll need [Git](https://git-scm.com). From your command line:

```bash
# Clone this repository
git clone https://git.fhict.nl/I412182/paaspopquiz.git
# Go into the repository
cd paaspopquiz
```

To install the used dependencies and to build the production code you'll need [Node.js](https://nodejs.org/en/download/). From your command line:

```bash
# Install the used dependencies
npm install
# Build the stylesheet
npm run build-style
```


## Development
Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/).

After successfully completing the [setup](#setup), the following steps can be followed to assist with further development on the product. From your command line:

```bash
# Watch updated styling and automatically build the new stylesheet
npm run watch-style
```


## Documentation
All quiz related code contains detailed comments, and all functions are documented in the [docs](/docs/index.html).


## Resources
- [Paaspop Minigames Compontents](https://git.fhict.nl/I368165/paaspop-minigames-components.git) - All universal components used throughout the Paaspop Minigames.