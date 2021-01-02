const { meme } = require("memejs");
const { MessageEmbed } = require("discord.js");

module.exports = {
  memeGrabber(message) {
    message.channel.send(
      "Retrieving meme from r/meme... (estimated time: 5 seconds)"
    );

    meme("meme", function (err, data) {
      if (err) return console.error(err);
      const memeEmbed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`r/${data.subreddit}`)
        .setURL("https://reddit.com/r/meme/")
        .setAuthor(data.author)
        .setDescription(data.title)
        .addFields({
          name: "URL",
          value: data.url,
        })
        .setImage(data.url)
        .setTimestamp()
        .setFooter(
          "discord.gg/eW8kyHF",
          "https://yt3.ggpht.com/a/AATXAJyfayDHoTLqykhU-rFrVpOQiACjgZCQUKzBKJQQ0w=s900-c-k-c0xffffffff-no-rj-mo"
        );

      message.channel.send({ embed: memeEmbed });
    });
  },
};
