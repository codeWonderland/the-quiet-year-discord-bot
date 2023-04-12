import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from './utils.js';
import Game from './game.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
var activeGame = new Game();

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data, member } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "new-game" command
    if (name === 'new-game') {
      
      activeGame = new Game();
      const messageContent = `New Game of The Quiet Year initialized, all data reset`

      activeGame.logEvent(messageContent)

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: messageContent,
        },
      });
    }

    // "register" command
    if (name === 'register') {
      const username = member.user.username;
      const result = activeGame.addPlayer(username);
      var messageContent = `Registered user: ${username}`;

      if (result !== true) {
        messageContent = `${username} is already registered!`
      }

      activeGame.logEvent(messageContent)

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: messageContent,
        },
      });
    }

    // "register-mod" command
    if (name === 'register-mod') {
      const username = member.user.username;
      const result = activeGame.addMod(username);
      var messageContent = `Registered mod: ${username}`;

      activeGame.logEvent(messageContent)

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: messageContent,
        },
      });
    }

    if (name === 'start-game') {
      const currentPlayer = activeGame.getCurrentPlayer();
      if (currentPlayer.is_mod) {
        activeGame.startGame();

        const playerOrder = activeGame.players.map((player, index) => (index === 0 ? '➡️ ' : '') + player.name).join(', ');
        const messageContent = `Game started! Player order: ${playerOrder}
The active player can start the week with /start-week`;

        activeGame.logEvent(messageContent)
        
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: messageContent,
          },
        });
      }
    }

    if (name === 'start-week') {
      if (activeGame.getCurrentPlayer().name === member.user.username) {
        let messageContent = '';
    
        if (activeGame.gameOver) {
          messageContent = `The game has ended. Type /new-game to start a new game.`;
        } else {
          const currentSeason = activeGame.getCurrentSeason();
          const currentWeek = activeGame.getCurrentWeek(currentSeason);
          
          if (currentWeek[0].includes('The game is over')) {
            activeGame.setGameOver();
          }
    
          messageContent = `${currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} week event: ${currentWeek.join(' OR ')}`;
          
          const projectUpdates = activeGame.getProjectsUpdate();
          if (projectUpdates.length > 0) {
            messageContent += `\n\nProject updates:\n`;
            projectUpdates.forEach(update => {
              messageContent += `- ${update}\n`;
            });
          }
        }

        activeGame.logEvent(messageContent)

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: messageContent,
          },
        });
      }
    }
    
    if (name === 'end-week') {
      const currentPlayer = activeGame.getCurrentPlayer();
      const user = activeGame.getPlayerByName(member.user.username);
    
      const messageContent = `Week ended. It's now ${activeGame.getCurrentPlayer().name}'s turn.
Type /start-week to get the next prompt.`
      activeGame.logEvent(messageContent)

      if (currentPlayer.name === member.user.username || (user && user.is_mod)) {
        activeGame.nextPlayer();
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: messageContent,
          },
        });
      }
    }

    // "get-players" command
    if (name === 'get-players') {
      
      var messageContent = "Active Players:";

      activeGame.players.forEach(player => {
        messageContent = `${messageContent} ${player.name},`
      });

      if (activeGame.players.length === 0) {
        messageContent = "No active players!";
      } else {
        messageContent = messageContent.substring(0, messageContent.length - 1)
      }
      
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: messageContent,
        },
      });
    }
    
    // "add-scarcity" command
    if (name === 'add-scarcity') {
      const resourceName = data.options.find(option => option.name === 'resource_name').value;

      if (resourceName.trim() !== '') {
        const scarcities = activeGame.addScarcity(resourceName);

        const messageContent = `Scarcity '${resourceName}' added. Current scarcities: ${scarcities.join(', ')}`;

        activeGame.logEvent(messageContent)
        
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: messageContent,
          },
        });
      } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Please provide a valid resource name.`,
          },
        });
      }
    }

    // "remove-scarcity" command
    if (name === 'remove-scarcity') {
      const resourceName = data.options.find(option => option.name === 'resource_name').value;
      activeGame.removeScarcity(resourceName);

      const messageContent = `Scarcity '${resourceName}' removed.`
      activeGame.logEvent(messageContent)

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: messageContent,
        },
      });
    }

    // "list-scarcities" command
    if (name == 'list-scarcities') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Current scarcities: ${activeGame.scarcities.join(', ')}`,
        },
      });
    }

    // "add-abundance" command
    if (name === 'add-abundance') {
      const resourceName = data.options.find(option => option.name === 'resource_name').value;
      const abundances = activeGame.addAbundance(resourceName);

      const messageContent = `Abundance '${resourceName}' added. Current abundances: ${abundances.join(', ')}`
      activeGame.logEvent(messageContent)

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: messageContent,
        },
      });
    }

    // "remove-abundance" command
    if (name === 'remove-abundance') {
      const resourceName = data.options.find(option => option.name === 'resource_name').value;
      activeGame.removeAbundance(resourceName);

      const messageContent = `Abundance '${resourceName}' removed.`
      activeGame.logEvent(messageContent)

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: messageContent,
        },
      });
    }

    // "list-abundances" command
    if (name == 'list-abundances') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Current abundances: ${activeGame.abundances.join(', ')}`,
        },
      });
    }

    if (name === 'add-project') {
      // Extract the project name and weeks from the command options
      const projectName = data.options.find(option => option.name === 'project_name').value;
      const weeks = data.options.find(option => option.name === 'weeks').value;
    
      // Check if the conditions are met
      if (projectName && Number.isInteger(weeks)) {
        // Create a new project and add it to the active projects list
        activeGame.addProject(projectName, weeks);
    
        const messageContent = `Project "${projectName}" has been created with a duration of ${weeks} weeks.`
        activeGame.logEvent(messageContent)

        // Send a confirmation message
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: messageContent,
          },
        });
      } else {
        // Send an error message
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Invalid command usage. Please provide a project name followed by the number of weeks.',
          },
        });
      }
    }

    if (name === 'list-projects') {
      const projects = activeGame.getProjects();
    
      let activeProjects = "\n\nActive Projects:";
      let completedProjects = "\n\nCompleted Projects:";
      let failedProjects = "\n\nFailed Projects:";
    
      projects.forEach((project, index) => {
        if (project.failed) {
          failedProjects += `\n${index + 1}. ${project.name}`;
        } else if (project.is_complete) {
          completedProjects += `\n${index + 1}. ${project.name}`;
        } else {
          activeProjects += `\n${index + 1}. ${project.name}`;
        }
      });
    
      const responseMessage = activeProjects + completedProjects + failedProjects;
    
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: responseMessage,
        },
      });
    }
    
    if (name === 'remove-project') {
      const projectNum = data.options.find((option) => option.name === 'project_num').value;
      const success = activeGame.removeProject(projectNum - 1);
    
      if (success) {
        const messageContent = `Project ${projectNum} has been removed.`
        activeGame.logEvent(messageContent)

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: messageContent,
          },
        });
      } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Error: Project ${projectNum} does not exist.`,
          },
        });
      }
    }
    
    if (name === 'finish-project') {
      const projectNum = data.options.find((option) => option.name === 'project_num').value;
      const success = activeGame.finishProject(projectNum - 1);
    
      if (success) {
        const messageContent = `Project ${projectNum} has been marked as finished.`
        activeGame.logEvent(messageContent)

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: messageContent,
          },
        });
      } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Error: Project ${projectNum} does not exist.`,
          },
        });
      }
    }
    
    if (name === 'fail-project') {
      const projectNum = data.options.find((option) => option.name === 'project_num').value;
      const success = activeGame.failProject(projectNum - 1);
    
      if (success) {
        const messageContent = `Project ${projectNum} has been marked as failed.`
        activeGame.logEvent(messageContent)

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: messageContent,
          },
        });
      } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Error: Project ${projectNum} does not exist.`,
          },
        });
      }
    }

    if (name === 'actions') {
      const activePlayer = activeGame.getCurrentPlayer();
  
      if (activePlayer.name === member.user.username) {
        const actionsActivePlayer = `Actions
===========
Discover Something New:
Introduce a new situation, and draw it onto the map.

Hold a Discussion:
Choose a topic. Everyone gets to weigh in once.

Start a Project: (/add-project projectName weeks)
State a project that the community is starting. As a group, decide its duration

End Week: (/end-week)
End the current week.`;
  
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: actionsActivePlayer,
          },
        });
      } else {
        const actionsOtherPlayers = `Actions
===========
Take Contempt: (/take-contempt)
If ever you feel like you weren’t consulted or honoured in a decision-making process, you can take a piece of Contempt, we'll record it for you. This is your outlet for expressing disagreement or tension. If
someone starts a project that you don’t agree with, you don’t get to voice your objections or speak out of turn. You are instead invited to take a piece of Contempt.

Use Contempt: (/use-contempt)
You can use contempt in two ways: by acting selfishly and by diffusing tensions. 
If you ever want to act selfishly, to the known detriment of the community, you can discard a Contempt token to justify your behaviour. You decide whether your behaviour requires justification. This will often trigger others taking Contempt tokens in response.
If someone else does something that you greatly support, that would mend relationships and rebuild trust, you can discard a Contempt token to demonstrate how they have diffused past tensions.

Count Contempt: (/count-contempt)
Get your current amount of contempt points`;
  
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: actionsOtherPlayers,
          },
        });
      }
    }

    if (name === 'take-contempt') {
      const player = activeGame.getPlayerByName(member.user.username);
      const tokens = player.add_contempt();
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `You now have ${tokens} contempt token(s).`,
        },
      });
    }
    
    if (name === 'use-contempt') {
      const player = activeGame.getPlayerByName(member.user.username);
      const success = player.use_contempt();
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: success
            ? `You have used a contempt token. You now have ${player.contempt_tokens} contempt token(s) left.`
            : `You don't have any contempt tokens to use.`,
        },
      });
    }
    
    if (name === 'count-contempt') {
      const player = activeGame.getPlayerByName(member.user.username);
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `You currently have ${player.contempt_tokens} contempt token(s).`,
        },
      });
    }
    
    if (name === 'log-event') {
      const eventDetails = options.find((option) => option.name === 'event_details').value;
      activeGame.logEvent(eventDetails);
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Event logged: ${eventDetails}`,
        },
      });
    }
    
    if (name === 'save') {
      activeGame.save();
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Game state saved successfully.',
        },
      });
    }
    
    if (name === 'load') {
      const loaded = activeGame.load();
      if (loaded) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Game state loaded successfully.',
          },
        });
      } else {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'No save file found to load.',
          },
        });
      }
    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
