// game.js
import Player from './player.js';
import Project from './project.js';
import fs from 'fs';


class Game {
  constructor() {
    this.players = [];
    this.abundances = [];
    this.scarcities = [];
    this.names = [];
    this.projects = [];
    this.year = this.loadAndRandomizeWeeks();
    this.currentPlayerIndex = 0;
    this.seasonsOrder = ['spring', 'summer', 'autumn', 'winter'];
    this.gameOver = false;
    this.logs = [];
  }

  loadAndRandomizeWeeks() {
    const weeksDataRaw = fs.readFileSync('./weeks.json');
    const weeksData = JSON.parse(weeksDataRaw);

    const randomizedYear = {};

    for (const season in weeksData) {
      randomizedYear[season] = this.shuffleArray(weeksData[season]);
    }

    return randomizedYear;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  addPlayer(playerName) {
    const existingPlayer = this.players.find(player => player.name === playerName);

    if (!existingPlayer) {
      const newPlayer = new Player(playerName);
      this.players.push(newPlayer);
      return true;
    }

    return false;
  }

  getPlayerByName(name) {
    const player = this.players.find((player) => player.name === name);
    return player ? player : null;
  }

  addMod(playerName) {
    let modPlayer = this.players.find(player => player.name === playerName);

    if (!modPlayer) {
      modPlayer = new Player(playerName, true);
      this.players.push(modPlayer);
    } else {
      modPlayer.is_mod = true;
    }

    return true;
  }

  addAbundance(resourceName) {
    const existingAbundance = this.abundances.find(abundance => abundance === resourceName);

    if (!existingAbundance) {
        this.abundances.push(resourceName)
    }

    this.removeScarcity(resourceName)
    
    return this.abundances
  }

  addScarcity(resourceName) {
    const existingScarcity = this.scarcities.find(scarcity => scarcity === resourceName);

    if (!existingScarcity) {
        this.scarcities.push(resourceName)
    }

    this.removeAbundance(resourceName)

    return this.scarcities
  }

  removeAbundance(resourceName) {
    this.abundances = this.abundances.filter(abundance => abundance !== resourceName)
  }

  removeScarcity(resourceName) {
    this.scarcities = this.scarcities.filter(scarcity => scarcity !== resourceName)
  }

  startGame() {
    this.players = this.shuffleArray(this.players);
    this.currentPlayerIndex = 0;
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  nextPlayer() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  getCurrentSeason() {
    for (const season of this.seasonsOrder) {
      if (this.year[season].length > 0) {
        return season;
      }
    }
    return null; // The game is over
  }

  getCurrentWeek(season) {
    const currentWeek = this.year[season][0];
    this.year[season].shift();
    return currentWeek;
  }

  addProject(name, weeks) {
    const newProject = new Project(name, weeks);
    this.projects.push(newProject);
  }

  getProjects() {
    return this.projects;
  }

  getProjectsUpdate() {
    const updates = [];

    this.projects.forEach(project => {
        let update = project.pass_time()

        if (update) {
            updates.push(`Project "${project.name}" complete!`)
        }
    });
  
    return updates;
  }

  setGameOver() {
    this.gameOver = true;
  }

  removeProject(index) {
    if (index >= 0 && index < this.projects.length) {
      this.projects.splice(index, 1);
      return true;
    }
    return false;
  }
  
  finishProject(index) {
    if (index >= 0 && index < this.projects.length) {
      this.projects[index].finish();
      return true;
    }
    return false;
  }
  
  failProject(index) {
    if (index >= 0 && index < this.projects.length) {
      this.projects[index].fail();
      return true;
    }
    return false;
  }
  
  logEvent(event) {
    this.logs.push(event);
  }

  save() {
    const serializedData = JSON.stringify(this);
    fs.writeFileSync('game_save.json', serializedData);
  }

  load() {
    try {
      const serializedData = fs.readFileSync('game_save.json', 'utf-8');
      const loadedGameData = JSON.parse(serializedData);

      // Re-initialize game variables with the serialized data
      this.players = loadedGameData.players.map(playerData => Object.assign(new Player(), playerData));
      this.projects = loadedGameData.projects.map(projectData => Object.assign(new Project(), projectData));
      this.currentPlayerIndex = loadedGameData.currentPlayerIndex;
      this.abundances = loadedGameData.abundances;
      this.scarcities = loadedGameData.scarcities;
      this.logs = loadedGameData.logs;
      this.year = loadedGameData.year;
      this.gameOver = loadedGameData.gameOver;

      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File not found
        return false;
      } else {
        throw error;
      }
    }
  }
}

export default Game;
