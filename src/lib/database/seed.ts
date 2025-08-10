/** biome-ignore-all lint/suspicious/noConsole: needed for seed script feedback */
import { db } from './client'
import { messages } from './schema'

const sampleMessages = [
  // Approved messages (12)
  {
    name: 'Maria Silva',
    message: 'Parabéns pelos 50 anos! Que venham muitos mais anos de alegria e saúde!',
    status: 'approved' as const,
  },
  {
    name: 'João Santos',
    message: 'Feliz aniversário! Que Deus continue abençoando sua vida com muita felicidade.',
    status: 'approved' as const,
  },
  {
    name: 'Ana Costa',
    message: 'Parabéns! Que este novo ano de vida seja repleto de realizações e momentos especiais.',
    status: 'approved' as const,
  },
  {
    name: 'Pedro Oliveira',
    message: 'Feliz aniversário! Que você continue sendo essa pessoa incrível que é.',
    status: 'approved' as const,
  },
  {
    name: 'Lucia Ferreira',
    message: 'Parabéns pelos 50 anos! Que venham muitas outras primaveras!',
    status: 'approved' as const,
  },
  {
    name: 'Carlos Lima',
    message: 'Feliz aniversário! Que este novo ciclo seja cheio de conquistas e alegrias.',
    status: 'approved' as const,
  },
  {
    name: 'Fernanda Rocha',
    message: 'Parabéns! Que você continue inspirando todos ao seu redor com sua bondade.',
    status: 'approved' as const,
  },
  {
    name: 'Roberto Alves',
    message: 'Feliz aniversário! Que Deus continue te abençoando com saúde e paz.',
    status: 'approved' as const,
  },
  {
    name: 'Patricia Souza',
    message: 'Parabéns pelos 50 anos! Que venham muitos momentos especiais pela frente.',
    status: 'approved' as const,
  },
  {
    name: 'Marcelo Dias',
    message: 'Feliz aniversário! Que este novo ano seja repleto de realizações.',
    status: 'approved' as const,
  },
  {
    name: 'Cristina Martins',
    message: 'Parabéns! Que você continue sendo essa pessoa maravilhosa que é.',
    status: 'approved' as const,
  },
  {
    name: 'Ricardo Nunes',
    message: 'Feliz aniversário! Que venham muitos anos de felicidade e saúde!',
    status: 'approved' as const,
  },

  // Pending messages (3)
  {
    name: 'Sofia Mendes',
    message: 'Parabéns pelos 50 anos! Que venham muitas outras primaveras cheias de alegria!',
    status: 'pending' as const,
  },
  {
    name: 'Gabriel Torres',
    message: 'Feliz aniversário! Que este novo ciclo seja repleto de conquistas e momentos especiais.',
    status: 'pending' as const,
  },
  {
    name: 'Isabela Cardoso',
    message: 'Parabéns! Que Deus continue te abençoando com saúde, paz e muita felicidade.',
    status: 'pending' as const,
  },

  // Rejected messages (3)
  {
    name: 'Lucas Barbosa',
    message: 'Parabéns pelos 50 anos! Que venham muitos mais anos de alegria!',
    status: 'rejected' as const,
  },
  {
    name: 'Amanda Silva',
    message: 'Feliz aniversário! Que este novo ano seja cheio de realizações e momentos especiais.',
    status: 'rejected' as const,
  },
  {
    name: 'Thiago Costa',
    message: 'Parabéns! Que você continue sendo essa pessoa incrível que é.',
    status: 'rejected' as const,
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
