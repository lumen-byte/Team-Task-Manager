import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const hashedPassword = await bcrypt.hash('Password123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@team.com' },
    update: {},
    create: {
      email: 'admin@team.com',
      name: 'Admin User',
      password: hashedPassword,
    },
  });

  const member1 = await prisma.user.upsert({
    where: { email: 'member1@team.com' },
    update: {},
    create: {
      email: 'member1@team.com',
      name: 'Alice Member',
      password: hashedPassword,
    },
  });

  const member2 = await prisma.user.upsert({
    where: { email: 'member2@team.com' },
    update: {},
    create: {
      email: 'member2@team.com',
      name: 'Bob Member',
      password: hashedPassword,
    },
  });

  const member3 = await prisma.user.upsert({
    where: { email: 'member3@team.com' },
    update: {},
    create: {
      email: 'member3@team.com',
      name: 'Charlie Member',
      password: hashedPassword,
    },
  });

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Redesigning the main marketing website',
      color: '#4F46E5',
      owner_id: admin.id,
      members: {
        create: [
          { user_id: admin.id, role: 'ADMIN' },
          { user_id: member1.id, role: 'MEMBER' },
          { user_id: member2.id, role: 'MEMBER' }
        ]
      }
    }
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App MVP',
      description: 'First version of the mobile app',
      color: '#10B981',
      owner_id: admin.id,
      members: {
        create: [
          { user_id: admin.id, role: 'ADMIN' },
          { user_id: member3.id, role: 'MEMBER' }
        ]
      }
    }
  });

  // Create Tasks for Project 1
  for (let i = 1; i <= 5; i++) {
    await prisma.task.create({
      data: {
        title: `Design Home Page ${i}`,
        description: 'Create wireframes and mockups',
        status: i % 2 === 0 ? 'Todo' : 'In Progress',
        priority: i === 1 ? 'High' : 'Medium',
        project_id: project1.id,
        creator_id: admin.id,
        assignee_id: i % 2 === 0 ? member1.id : member2.id,
        due_date: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
      }
    });
  }

  // Create Tasks for Project 2
  for (let i = 1; i <= 5; i++) {
    await prisma.task.create({
      data: {
        title: `Setup API ${i}`,
        description: 'Initialize backend services',
        status: i % 3 === 0 ? 'Done' : 'Review',
        priority: 'High',
        project_id: project2.id,
        creator_id: admin.id,
        assignee_id: member3.id,
        due_date: new Date(Date.now() - i * 24 * 60 * 60 * 1000) // Some overdue
      }
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
