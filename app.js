require("dotenv").config();
const { Client, MessageEmbed } = require("discord.js");
const { memeGrabber } = require("./commands/meme");
const music = require("./commands/music");

const client = new Client();

const prefix = ".";

let guild;
let user;
let member;

const helpEmbed = new MessageEmbed()
  .setColor("#0099ff")
  .setTitle("Commands")
  .setAuthor(
    "Obamium",
    "https://static.wikia.nocookie.net/joke-battles/images/b/b2/Obama_Prism.png/revision/latest/scale-to-width-down/340?cb=20191119223022"
  )
  .setDescription("All the commands avaliable for Obamium")
  .setThumbnail(
    "https://static.wikia.nocookie.net/joke-battles/images/b/b2/Obama_Prism.png/revision/latest/scale-to-width-down/340?cb=20191119223022"
  )
  .addFields(
    {
      name: "Basic Commands",
      value: "`.meme`: Generate a random meme from r/meme",
    },
    {
      name: "Music Commands",
      value:
        "`.play <YouTube URL>`: Plays a song of your choice\n`.skip`: Plays the next song in the queue\n`.stop`: Stops playing music\n`.queue`: Display all the songs in the queue\n`.disconnect`: Disconnect bot from voice channel",
    },
    { name: "\u200B", value: "\u200B" }
  )
  .setTimestamp()
  .setFooter(
    "https://discord.gg/dfzGqaGcg6",
    "https://static.wikia.nocookie.net/joke-battles/images/b/b2/Obama_Prism.png/revision/latest/scale-to-width-down/340?cb=20191119223022"
  );

client.once("ready", () => {
  console.log("Ready!");

  client.user.setActivity("obamiumbot.xyz");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async (message) => {
  const args = message.content.split(" ");

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = music.queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    music.execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    message.channel.send(":arrow_forward:  **Skipped!**");
    music.skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    music.stop(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}disconnect`)) {
    music.disconnect(serverQueue);
  } else if (message.content.startsWith(`${prefix}ban`)) {
    user = message.mentions.users.first();

    if (user) {
      member = message.guild.member(user);

      member
        .ban({
          reason: "Inappropriate behaviour",
        })
        .then(() => {
          message.reply(`Successfully banned ${user.tag}`);
        })
        .catch((err) => {
          message.reply("I was unable to ban the user");
        });
    } else {
      message.reply("Please specify the user you want me to ban");
    }
  } else if (message.content.startsWith(`${prefix}queue`)) {
    const songs = [];

    for (let song of music.queue.values()) {
      song.songs.forEach((song) => {
        songs.push(` ${song.title}`);
      });

      message.channel.send(`Queue: **${songs}**`);
    }
  } else if (message.content.startsWith(`${prefix}kick`)) {
    user = message.mentions.users.first();

    if (user) {
      member = message.guild.member(user);

      message.reply("You don't have the permissions to use this command");
      member
        .kick("You have been kicked from the server")
        .then(() => {
          message.reply(`Successfully kicked ${user.tag}`);
        })
        .catch((err) => {
          message.reply("I was unable to kick the member");
        });
    } else {
      message.reply("Please specify the user you want me to kick");
    }
  } else if (message.content.startsWith(`${prefix}meme`)) {
    memeGrabber(message);
  } else if (message.content.startsWith(`${prefix}help`)) {
    message.channel.send({ embed: helpEmbed });
  } else if (message.content.startsWith(`${prefix}members-online`)) {
    guild = client.guilds.cache.get("794983707634171955");
    const onlineCount = guild.members.cache.filter(
      (m) => m.presence.status === "online" || m.presence.status === "dnd"
    ).size;
    message.channel.send(onlineCount);
  } else if (message.content.startsWith(`${prefix}members`)) {
    guild = client.guilds.cache.get("794983707634171955");
    const memberCount = guild.memberCount;
    message.channel.send(memberCount);
  } else if (message.content.startsWith(`${prefix}clear`)) {
    if (!args[1]) {
      return message.reply("Specify the number of messages to clear");
    }

    message.channel.bulkDelete(args[1]);
  }
});

client.login(process.env.TOKEN);
