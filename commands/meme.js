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
          "https://discord.gg/dfzGqaGcg6",
          "https://static.wikia.nocookie.net/joke-battles/images/b/b2/Obama_Prism.png/revision/latest/scale-to-width-down/340?cb=20191119223022"
        );

      message.channel.send({ embed: memeEmbed });
    });
  },
};
