# The Quiet Year: Discord Bot
Built with node.js using the default Discord example bot structure, this application facilitates the gameplay of the tabletop RPG "The Quiet Year". The original game is available on [buriedwithoutceremony.com](https://buriedwithoutceremony.com/the-quiet-year). 

Please note: this bot does not take into account the drawing aspect of the game, as it's intended to be used with a third-party, online collaborative drawing space such as Bluescape.

## Install Process
Please follow the install process outlined [here](https://github.com/discord/discord-example-app)

## Commands
### /register
Registers the user as a player in the active game

### /register-mod
Registers the user as a player with mod privileges in the active game

### /new-game
Starts a new game of The Quiet Year

### /get-players
Lists all active players

### /add-scarcity [resource_name]
Adds a scarcity to the game with the specified resource name

### /add-abundance [resource_name]
Adds an abundance to the game with the specified resource name

### /remove-abundance [resource_name]
Removes an abundance from the game with the specified resource name

### /remove-scarcity [resource_name]
Removes a scarcity from the game with the specified resource name

### /list-abundances
Lists all current abundances

### /list-scarcities
Lists all current scarcities

### /start-game
Starts the game and sets player order

### /start-week
Starts the current week for the active player

### /end-week
Ends the current week and passes the turn to the next player

### /add-project [projectName] [weeks]
Adds a new project with the specified name and duration (in weeks)

### /list-projects
Lists all projects, grouped by their status (active, completed, or failed)

### /remove-project [projectNum]
Removes a project with the specified project number from the list

### /finish-project [projectNum]
Marks a project with the specified project number as completed

### /fail-project [projectNum]
Marks a project with the specified project number as failed

### /actions
Displays available actions depending on whether the user is the active player or not

### /take-contempt
Allows a player to take a contempt token

### /use-contempt
Allows a player to use a contempt token, if they have one

### /count-contempt
Displays the current number of contempt tokens a player has

### /log-event [event details]
Logs an event with the specified details to the game's event log

### /save
Saves the current game state

### /load
Loads a saved game state, if available

## Additional Information
The bot is designed to be a user-friendly interface for playing The Quiet Year on Discord. It keeps track of game states, players, projects, abundances, scarcities, contempt tokens, and events. It also provides an intuitive way for users to interact with the game through a set of simple commands.
