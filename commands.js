import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';

// Register player command
const REGISTER_COMMAND = {
  name: 'register',
  description: 'Register player for Quiet Year game',
  type: 1,
};

// Register player command
const REGISTER_MOD_COMMAND = {
  name: 'register-mod',
  description: 'Register mod for Quiet Year game',
  type: 1,
};

// New game command
const NEW_GAME_COMMAND = {
  name: 'new-game',
  description: 'Start a new game of The Quiet Year',
  type: 1,
};

// Get players command
const GET_PLAYERS_COMMAND = {
  name: 'get-players',
  description: 'List all active players',
  type: 1,
};

// Add scarcity command
const ADD_SCARCITY_COMMAND = {
  name: 'add-scarcity',
  description: 'Adds a scarcity to the game',
  options: [
    {
      type: 3,
      name: 'resource_name',
      description: 'The name of the resource to be added as a scarcity',
      required: true,
    },
  ],
  type: 1,
};

// Add abundance command
const ADD_ABUNDANCE_COMMAND = {
  name: 'add-abundance',
  description: 'Adds an abundance to the game',
  options: [
    {
      type: 3,
      name: 'resource_name',
      description: 'The name of the resource to be added as an abundance',
      required: true,
    },
  ],
  type: 1,
};

// Remove abundance command
const REMOVE_ABUNDANCE_COMMAND = {
  name: 'remove-abundance',
  description: 'Removes an abundance from the game',
  options: [
    {
      type: 3,
      name: 'resource_name',
      description: 'The name of the resource to be removed from abundances',
      required: true,
    },
  ],
  type: 1,
};

// Remove scarcity command
const REMOVE_SCARCITY_COMMAND = {
  name: 'remove-scarcity',
  description: 'Removes a scarcity from the game',
  options: [
    {
      type: 3,
      name: 'resource_name',
      description: 'The name of the resource to be removed from scarcities',
      required: true,
    },
  ],
  type: 1,
};

// List abundances command
const LIST_ABUNDANCES_COMMAND = {
  name: 'list-abundances',
  description: 'Lists all current abundances',
  type: 1,
};

// List scarcities command
const LIST_SCARCITIES_COMMAND = {
  name: 'list-scarcities',
  description: 'Lists all current scarcities',
  type: 1,
};

const START_GAME_COMMAND = {
  name: 'start-game',
  description: 'Start the game and set player order',
  type: 1,
};

const START_WEEK_COMMAND = {
  name: 'start-week',
  description: 'Start the current week for the active player',
  type: 1,
};

const END_WEEK_COMMAND = {
  name: 'end-week',
  description: 'End the current week and pass the turn to the next player',
  type: 1,
};

// Add project command
const ADD_PROJECT_COMMAND = {
  name: 'add-project',
  description: 'Adds a project to the game',
  options: [
    {
      type: 3,
      name: 'project_name',
      description: 'The name of the project',
      required: true,
    },
    {
      type: 4,
      name: 'weeks',
      description: 'The number of weeks the project will take to complete',
      required: true,
    },
  ],
  type: 1,
};

// List projects command
const LIST_PROJECTS_COMMAND = {
  name: 'list-projects',
  description: 'Lists all current projects',
  type: 1,
};

// Remove project command
const REMOVE_PROJECT_COMMAND = {
  name: 'remove-project',
  description: 'Remove a project from the game',
  options: [
    {
      type: 4,
      name: 'project_num',
      description: 'The project number from the /list-projects command',
      required: true,
    },
  ],
  type: 1,
};

// Finish project command
const FINISH_PROJECT_COMMAND = {
  name: 'finish-project',
  description: 'Mark a project as finished',
  options: [
    {
      type: 4,
      name: 'project_num',
      description: 'The project number from the /list-projects command',
      required: true,
    },
  ],
  type: 1,
};

// Fail project command
const FAIL_PROJECT_COMMAND = {
  name: 'fail-project',
  description: 'Mark a project as failed',
  options: [
    {
      type: 4,
      name: 'project_num',
      description: 'The project number from the /list-projects command',
      required: true,
    },
  ],
  type: 1,
};

const ACTIONS_COMMAND = {
  name: 'actions',
  description: 'List the actions available for the active player or other players',
  type: 1,
};

const TAKE_CONTEMPT_COMMAND = {
  name: 'take-contempt',
  description: 'Take a contempt token',
  type: 1,
};

const USE_CONTEMPT_COMMAND = {
  name: 'use-contempt',
  description: 'Use a contempt token',
  type: 1,
};

const COUNT_CONTEMPT_COMMAND = {
  name: 'count-contempt',
  description: 'Count your contempt tokens',
  type: 1,
};

const LOG_EVENT_COMMAND = {
  name: 'log-event',
  description: 'Log an event in the game',
  options: [
    {
      type: 3,
      name: 'event_details',
      description: 'Details of the event to be logged',
      required: true,
    },
  ],
  type: 1,
};

const SAVE_COMMAND = {
  name: 'save',
  description: 'Save the current game state',
  type: 1,
};

const LOAD_COMMAND = {
  name: 'load',
  description: 'Load a saved game state',
  type: 1,
};

const ALL_COMMANDS = [
  REGISTER_COMMAND,
  REGISTER_MOD_COMMAND,
  NEW_GAME_COMMAND,
  GET_PLAYERS_COMMAND,
  ADD_SCARCITY_COMMAND,
  ADD_ABUNDANCE_COMMAND,
  REMOVE_ABUNDANCE_COMMAND,
  REMOVE_SCARCITY_COMMAND,
  LIST_ABUNDANCES_COMMAND,
  LIST_SCARCITIES_COMMAND,
  START_GAME_COMMAND,
  START_WEEK_COMMAND,
  END_WEEK_COMMAND,
  ADD_PROJECT_COMMAND,
  LIST_PROJECTS_COMMAND,
  REMOVE_PROJECT_COMMAND,
  FINISH_PROJECT_COMMAND,
  FAIL_PROJECT_COMMAND,
  ACTIONS_COMMAND,
  TAKE_CONTEMPT_COMMAND,
  USE_CONTEMPT_COMMAND,
  COUNT_CONTEMPT_COMMAND,
  LOG_EVENT_COMMAND,
  SAVE_COMMAND,
  LOAD_COMMAND,
];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
