import { PrismaClient } from '@prisma/client'
import csvParser from './parseCsv.js'

interface InjuryRaw {
  team: string
  player: string
  event_type: string    
  reason: string
  start_date: string  
  end_date: string  
  days: string
  url : string
}

interface Injury {
  team: string
  player: string
  event_type: string    
  reason: string
  start_date: Date  
  end_date: Date  
  days: string
  url : string
}


const prisma = new PrismaClient()

async function writeInjuries() {
  // ... write Prisma Client queries here
  const data: InjuryRaw[] = await csvParser('../temp/csvfiles/injuries_and_suspensions_final.csv')
  const injuries: Injury[] = data.map((injury: InjuryRaw) => {
    const newStartDate = new Date(injury.start_date)
    const newEndDate = new Date(injury.end_date)
    return {
      ...injury,
      start_date: newStartDate,
      end_date: newEndDate
    }
  })
  await prisma.injuries.createMany({data: injuries})
}

async function writePlayers() {
  const data = await csvParser('../temp/csvfiles/cleaned_players.csv')
  const players = data.map(player => {
    const goalsScored = parseInt(player.goals_scored)
    const assists = parseInt(player.assists)
    const totalPoints = parseInt(player.total_points)
    const minutes = parseInt(player.minutes)
    const goalsConceded = parseInt(player.goals_conceded)
    const creativity = parseFloat(player.creativity)
    const influence = parseFloat(player.influence)
    const threat = parseFloat(player.threat)
    const bonus = parseInt(player.bonus)
    const bps = parseInt(player.bps)
    const ictIndex = parseFloat(player.ict_index)
    const cleanSheets = parseInt(player.clean_sheets)
    const redCards = parseInt(player.red_cards)
    const yellowCards = parseInt(player.yellow_cards)
    const selectedByPercent = parseFloat(player.selected_by_percent)
    return {
      ...player,
      goals_scored: goalsScored,
      assists: assists,
      total_points: totalPoints,
      minutes: minutes,
      goals_conceded: goalsConceded,
      creativity: creativity,
      influence: influence,
      threat: threat,
      bonus: bonus,
      bps: bps,
      ict_index: ictIndex,
      clean_sheets: cleanSheets,
      red_cards: redCards,
      yellow_cards: yellowCards,
      selected_by_percent: selectedByPercent
    }
  })
  await prisma.players.createMany({data: players})
}

writePlayers()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })