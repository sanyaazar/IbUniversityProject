import { PrismaClient, RightType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const rights = [
    { rightId: 1, right: RightType.READ },
    { rightId: 2, right: RightType.READ_COPY },
    { rightId: 3, right: RightType.READ_WRITE_COPY },
  ];

  for (const right of rights) {
    await prisma.right.upsert({
      where: { rightId: right.rightId },
      update: {},
      create: right,
    });
  }

  console.log('Начальные права доступа добавлены!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
