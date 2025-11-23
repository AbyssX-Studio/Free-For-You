import discord, requests, os
from discord import Embed, Interaction
from discord.ext import commands
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("TOKEN")
bot = commands.Bot(command_prefix="!", intents=discord.Intents.all())

@bot.event
async def on_ready():
    await bot.tree.sync()

@bot.tree.command(name="ip", description="IP")
async def ip(interaction: Interaction):
    if not interaction.user.guild_permissions.administrator:
        return await interaction.response.send_message("Administrator Only", ephemeral=True)

    try:
        embed = Embed(description=f"`: IP Public :`\n```{requests.get('https://api.ipify.org').text}```")
        await interaction.response.send_message(embed=embed, ephemeral=True)
    except Exception as e:
        await interaction.response.send_message(e, ephemeral=True)

bot.run(TOKEN)
