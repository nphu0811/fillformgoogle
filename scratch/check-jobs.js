const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const jobs = await prisma.fillJob.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { responses: true }
      }
    }
  });
  console.log(JSON.stringify(jobs, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
