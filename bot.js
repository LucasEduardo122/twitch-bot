const tmi = require('tmi.js');
const Moment = require('moment');
const MomentPrecise = require('moment-precise-range-plugin');
const commands = require('./commands');

require('dotenv').config();

const opts = {
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL
  ],
  connection: {
    reconnect: true
  }
};

const client = new tmi.client(opts);

client.on('message', onMessageHandler);
client.on('connected', commands.onConnectedHandler);

client.connect();

// Pega as mensagens em tempo real
function onMessageHandler(target, context, msg, self) {
  if (self) { return; } // Ignora mensgens do bot

  // remover espaços em branco das mensagens
  const commandSplit = msg.trim().toLowerCase().split("!");
  const command = msg.trim().toLowerCase();
  const commandName = commandSplit[1];

  //const commandName = msg.trim().toLowerCase();

  var chars = ['!vou pegar o albedo?', '!vou pegar a ganyu?', '!vou pegar a hu tao?', '!vou pegar a raiden?', '!vou pegar o childe?', '!vou pegar a ayaka?', '!vou pegar a kequing?', '!vou pegar a klee?', '!vou pegar o venti?',
    '!vou pegar o xiao?', '!vou pegar o zhongli?', '!vou pegar a kokomi?'];

  const found = chars.find(element => element == command);

  if (commandSplit[0] != "") return;

  if (commandName === 'dono') {
    client.say(target, `${context['display-name']}, o Lector133 que me criou VirtualHug`);
  } else if (found != undefined) {
    //const result = commands.bencao();
    //client.say(target, `${context['display-name']}, ${result}`);
    client.say(target, `${context['display-name']}, comando desativado`)
  } else if (commandName === 'video') {
    commands.apiYoutube().then(ur => {
      return client.say(target, `${context['display-name']}, último video do canal: https://www.youtube.com/watch?v=${ur}`);
    })

    /*commands.url_video1().then(ur => {
      return client.say(target, `${context['display-name']}, último video do canal: ${ur}`);
    }).then(text => console.log(text)); */

  } else if (commandName === 'chars') {
    client.say(target, `${context['display-name']}, esse comando foi desativado' `)
  } else if (commandName === 'info') {
    
    commands.infoGenshin().then(ur => {
      return client.say(target, `${context['display-name']}, essa  é a ultima informação do genshin: ' ${ur.frase} . link: ${ur.link}`);
    })
  } else if (commandName === 'eventos') {
    commands.eventGenshin().then(ur => {
      client.say(target, `${context['display-name']}, essa  é a ultima informação de eventos do genshin: ' ${ur.frase} . link: ${ur.link}`)
    })
  } else if (commandName.indexOf("adicionar") != -1) {
    if (command.indexOf("mensagem:") == -1) {
      return client.say(target, `${context['display-name']}, a forma de adicionar um comando é a segunte -> !adicionar [nome do comando com '!'] mensagem: [O conteúdo do comando] marcação: [Se devo marcar o usuario: sim ou nao]`);
    } else {
      const name = command.split(" ");

      if (name[1] == undefined || name[1] == null || name[1] == '') {
        return client.say(target, `${context['display-name']}, a forma de adicionar um comando é a segunte -> !adicionar [nome do comando com '!'] mensagem: [O conteúdo do comando] marcação: [Se devo marcar o usuario: sim ou nao]`);
      }

      if (!name[1].indexOf("!") == 0) {
        return client.say(target, `${context['display-name']}, a forma de adicionar um comando é a segunte -> !adicionar [nome do comando com '!'] mensagem: [O conteúdo do comando] marcação: [Se devo marcar o usuario: sim ou nao]`);
      }

      if (command.indexOf("marcação:") == -1) {
        return client.say(target, `${context['display-name']}, a forma de adicionar um comando é a segunte -> !adicionar [nome do comando com '!'] mensagem: [O conteúdo do comando] marcação: [Se devo marcar o usuario: sim ou nao]`);
      }

      const conteudo = command.split("mensagem:");

      const mark = conteudo[1].split("marcação:");

      const marcacao = mark[1];

      commands.addComands(context['display-name'], name[1], mark[0], marcacao).then(message => {
        client.say(target, `${context['display-name']}, ${message}`);
      })
    }
  } else if (commandName.indexOf("editar") != -1) {

    if (commandName.indexOf("mensagem:") == -1) {
      client.say(target, `${context['display-name']}, a forma de editar o comando é a segunte -> !editar [nome do comando com '!'] mensagem: [O conteúdo do comando]`);
    } else {
      const name = command.split(" ");

      if (name[1] == undefined || name[1] == null || name[1] == '') {
        return client.say(target, `${context['display-name']}, a forma de editar o comando é a segunte -> !editar [nome do comando com '!'] mensagem: [O conteúdo do comando]`);
      }

      if (!name[1].indexOf("!") == 0) {
        return client.say(target, `${context['display-name']}, a forma de editar um comando é a segunte -> !adicionar [nome do comando com '!'] mensagem: [O conteúdo do comando]`);
      }

      const conteudo = command.split("mensagem:");

      commands.editCommand(context['display-name'], name[1], conteudo[1]).then(message => {
        client.say(target, `${context['display-name']}, ${message}`);
      })
    }

  } else if (commandName.indexOf("deletar") != -1) {
    const name = command.split(" ");

    if (name[1] == undefined || name[1] == null || name[1] == '') {
      return client.say(target, `${context['display-name']}, a forma de remover o comando é a segunte -> !deletar [nome do comando com '!']`);
    }

    if (!name[1].indexOf("!") == 0) {
      return client.say(target, `${context['display-name']}, a forma de remover um comando é a segunte -> !deletar [nome do comando com '!']`);
    }

    commands.removeCommand(context['display-name'], name[1]).then(message => {
      client.say(target, `${context['display-name']}, ${message}`);
    })

  }

  commands.comandos().then(result => {
    result.forEach(messages => {
      const message = messages.data();
      if (message == null) {
        return;
      }

      if (command === message.name && message.mark.trim() === "sim") {
        client.say(target, `${context['display-name']}, ${message.message}`);
      } else if (command === message.name && message.mark.trim() === "nao") {
        client.say(target, `${message.message}`);
      }
    })
  })
}

