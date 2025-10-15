/** biome-ignore-all lint/suspicious/noConsole: needed for seed script feedback */
import { db } from './client'
import { messages } from './schema'

const now = new Date()
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)

const sampleMessages = [
  {
    name: 'Maria Silva',
    message: 'Parabéns pelos 50 anos! Que venham muitos mais anos de alegria e saúde!',
    status: 'approved' as const,
    createdAt: threeDaysAgo,
    approvedAt: twoDaysAgo,
  },
  {
    name: 'Sofia Mendes',
    message: 'Parabéns pelos 50 anos! Que venham muitas outras primaveras cheias de alegria!',
    status: 'pending' as const,
    createdAt: twoDaysAgo,
  },
  {
    name: 'João Santos',
    message: 'Feliz aniversário! Que Deus continue abençoando sua vida com muita felicidade.',
    status: 'approved' as const,
    createdAt: threeDaysAgo,
    approvedAt: twoDaysAgo,
  },
  {
    name: 'Lucas Barbosa',
    message: 'Parabéns pelos 50 anos! Que venham muitos mais anos de alegria!',
    status: 'rejected' as const,
    createdAt: threeDaysAgo,
    rejectedAt: twoDaysAgo,
  },
  {
    name: 'Ana Costa',
    message: 'Parabéns! Que este novo ano de vida seja repleto de realizações e momentos especiais.',
    status: 'approved' as const,
    createdAt: threeDaysAgo,
    approvedAt: twoDaysAgo,
  },
  {
    name: 'Pedro Oliveira',
    message: 'Feliz aniversário! Que você continue sendo essa pessoa incrível que é.',
    status: 'approved' as const,
    createdAt: twoDaysAgo,
    approvedAt: oneDayAgo,
  },
  {
    name: 'Gabriel Torres',
    message: 'Feliz aniversário! Que este novo ciclo seja repleto de conquistas e momentos especiais.',
    status: 'pending' as const,
    createdAt: oneDayAgo,
  },
  {
    name: 'Lucia Ferreira',
    message: 'Parabéns pelos 50 anos! Que venham muitas outras primaveras!',
    status: 'approved' as const,
    createdAt: twoDaysAgo,
    approvedAt: oneDayAgo,
  },
  {
    name: 'Amanda Silva',
    message: 'Feliz aniversário! Que este novo ano seja cheio de realizações e momentos especiais.',
    status: 'rejected' as const,
    createdAt: twoDaysAgo,
    rejectedAt: oneDayAgo,
  },
  {
    name: 'Carlos Lima',
    message: 'Feliz aniversário! Que este novo ciclo seja cheio de conquistas e alegrias.',
    status: 'approved' as const,
    createdAt: twoDaysAgo,
    approvedAt: oneDayAgo,
  },
  {
    name: 'Fernanda Rocha',
    message: 'Parabéns! Que você continue inspirando todos ao seu redor com sua bondade.',
    status: 'approved' as const,
    createdAt: twoDaysAgo,
    approvedAt: oneDayAgo,
  },
  {
    name: 'Isabela Cardoso',
    message: 'Parabéns! Que Deus continue te abençoando com saúde, paz e muita felicidade.',
    status: 'pending' as const,
    createdAt: now,
  },
  {
    name: 'Roberto Alves',
    message: 'Feliz aniversário! Que Deus continue te abençoando com saúde e paz.',
    status: 'approved' as const,
    createdAt: oneDayAgo,
    approvedAt: now,
  },
  {
    name: 'Thiago Costa',
    message: 'Parabéns! Que você continue sendo essa pessoa incrível que é.',
    status: 'rejected' as const,
    createdAt: oneDayAgo,
    rejectedAt: now,
  },
  {
    name: 'Patricia Souza',
    message: 'Parabéns pelos 50 anos! Que venham muitos momentos especiais pela frente.',
    status: 'approved' as const,
    createdAt: oneDayAgo,
    approvedAt: now,
  },
  {
    name: 'Marcelo Dias',
    message: 'Feliz aniversário! Que este novo ano seja repleto de realizações.',
    status: 'approved' as const,
    createdAt: oneDayAgo,
    approvedAt: now,
  },
  {
    name: 'Cristina Martins',
    message: 'Parabéns! Que você continue sendo essa pessoa maravilhosa que é.',
    status: 'approved' as const,
    createdAt: oneDayAgo,
    approvedAt: now,
  },
  {
    name: 'Ricardo Nunes',
    message: 'Feliz aniversário! Que venham muitos anos de felicidade e saúde!',
    status: 'approved' as const,
    createdAt: oneDayAgo,
    approvedAt: now,
  },
]

export async function seedDatabase() {
  try {
    console.log('Starting database seed...')

    // Insert messages
    console.log('Inserting sample messages...')
    await db.insert(messages).values(sampleMessages)
    console.log(`Inserted ${sampleMessages.length} messages`)

    console.log('Database seeded successfully!')

    // Show status summary
    const messageStats = await db.select().from(messages)

    console.log('Seed summary:')
    console.log(`- Messages: ${messageStats.length}`)
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
