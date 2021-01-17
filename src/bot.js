// load up all env variables in .env file
require('dotenv').config()
const Discord = require('discord.js')
const shuffle = require('lodash/shuffle')

// CONSTANTS
const PREFIX = "크롱! "
const COMMANDS = {
    'SPLIT_TEAMS': '팀나눠줘' 
}

const client = new Discord.Client()

/**
 * @param {Discord.User[]} users 
 */
function formatTeamList(users) {
    if (!users || users.length === 0) return 'empty'
    let teamlist = ''
    users.forEach(user => {
        teamlist += `- ${user.username}\n`
    })
    return teamlist
}

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in.`)
})

client.on('message', (message) => {
    // return if the message is from a bot
    if (message.author.bot) return

    if (message.content.startsWith(PREFIX)) {
        const [COMMAND_NAME, ...args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/)

        console.log({COMMAND_NAME, args})

        switch (COMMAND_NAME) {
            case COMMANDS.SPLIT_TEAMS: {
                const voiceChannel = message.guild.channels.cache.get('797302100849721382')
                const membersInChannel = [...voiceChannel.members.values()]
                    .filter(member => member.presence.status === 'online' && !member.user.bot)
                    .map(member => member.user)
                
                const shuffled = shuffle(membersInChannel)
                const team1 = shuffled.splice(0, shuffled.length/2)
                const team2 = shuffled

                const isAdminInTeam1 = team1.find(user => user.username === '유진')

                const embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .addFields(
                        { name: '청팀', value: formatTeamList(team1)},
                        { name: '백팀', value: formatTeamList(team2)},
                    )
                    .setTimestamp()
                    .setFooter(`${isAdminInTeam1 ? '청팀' : '백팀'} 이겨라!!`)

                message.channel.send(embed)
                break;
            }
            default:
                console.log('존재하지 않는 명령이에요!')
                break;
        }
    }

    if (message.content === '안녕 크롱~') {
        message.reply('안녕하세요!')
    }
})

client.login(process.env.DISCORDJS_BOT_TOKEN)
