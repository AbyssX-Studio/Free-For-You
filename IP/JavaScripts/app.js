const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes, PermissionsBitField } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const TOKEN = process.env.TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const commands = [new SlashCommandBuilder().setName('ip').setDescription('IP')].map(cmd => cmd.toJSON());

client.once('ready', async () => {
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log('Slash commands synced ✔');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ip') {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'Administrator Only', ephemeral: true });
        }

        try {
            const response = await axios.get('https://api.ipify.org');
            const embed = new EmbedBuilder()
                .setDescription(`\`: IP Public :\`\n\`\`\`${response.data}\`\`\``);

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (err) {
            await interaction.reply({ content: `${err}`, ephemeral: true });
        }
    }
});

client.login(TOKEN);
