const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const forms = await prisma.googleForm.findMany({
    include: {
      questions: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 1
  });

  if (forms.length === 0) {
    console.log('No forms found');
    return;
  }

  const form = forms[0];
  console.log(`Form: ${form.title}`);
  form.questions.forEach(q => {
    console.log(`- [${q.type}] ${q.title} (${q.entryId})`);
    console.log(`  Options: ${JSON.stringify(q.options)}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
