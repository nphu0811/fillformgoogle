import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@fillform.info' },
    update: {},
    create: {
      email: 'demo@fillform.info',
      username: 'demo',
      password: hashedPassword,
      name: 'Demo User',
      credits: 1000,
      role: 'USER',
      referralCode: 'DEMO2024',
    },
  });

  console.log('✅ Created demo user:', user.email);

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fillform.info' },
    update: {},
    create: {
      email: 'admin@fillform.info',
      username: 'admin',
      password: adminPassword,
      name: 'Admin User',
      credits: 999999,
      role: 'ADMIN',
      referralCode: 'ADMIN2024',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create a sample form
  const form = await prisma.form.upsert({
    where: { id: 'seed-form-1' },
    update: {},
    create: {
      id: 'seed-form-1',
      userId: user.id,
      googleFormUrl: 'https://docs.google.com/forms/d/e/sample-form/viewform',
      googleFormId: 'sample-form',
      title: 'Khảo sát mức độ hài lòng của sinh viên',
      description: 'Khảo sát đánh giá chất lượng dịch vụ giáo dục',
      status: 'ACTIVE',
    },
  });

  // Create sample questions
  const questions = [
    {
      id: 'q1',
      googleEntryId: 'entry.1000001',
      title: 'Giới tính',
      type: 'MULTIPLE_CHOICE',
      required: true,
      options: JSON.stringify(['Nam', 'Nữ', 'Khác']),
      order: 0,
    },
    {
      id: 'q2',
      googleEntryId: 'entry.1000002',
      title: 'Năm học',
      type: 'DROPDOWN',
      required: true,
      options: JSON.stringify(['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', 'Sau đại học']),
      order: 1,
    },
    {
      id: 'q3',
      googleEntryId: 'entry.1000003',
      title: 'Bạn đánh giá chất lượng giảng dạy như thế nào?',
      type: 'LINEAR_SCALE',
      required: true,
      options: JSON.stringify(['1', '2', '3', '4', '5']),
      order: 2,
    },
    {
      id: 'q4',
      googleEntryId: 'entry.1000004',
      title: 'Bạn hài lòng với cơ sở vật chất không?',
      type: 'MULTIPLE_CHOICE',
      required: true,
      options: JSON.stringify(['Rất hài lòng', 'Hài lòng', 'Bình thường', 'Không hài lòng', 'Rất không hài lòng']),
      order: 3,
    },
    {
      id: 'q5',
      googleEntryId: 'entry.1000005',
      title: 'Bạn có góp ý gì cho nhà trường?',
      type: 'LONG_TEXT',
      required: false,
      options: JSON.stringify([]),
      order: 4,
    },
  ];

  for (const q of questions) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {},
      create: {
        ...q,
        formId: form.id,
      },
    });
  }

  console.log('✅ Created sample form with', questions.length, 'questions');

  // Create a completed fill job
  const fillJob = await prisma.fillJob.upsert({
    where: { id: 'seed-job-1' },
    update: {},
    create: {
      id: 'seed-job-1',
      formId: form.id,
      userId: user.id,
      responseCount: 50,
      completedCount: 50,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 3600000),
      completedAt: new Date(Date.now() - 3500000),
    },
  });

  // Create welcome transaction
  await prisma.transaction.upsert({
    where: { id: 'seed-tx-1' },
    update: {},
    create: {
      id: 'seed-tx-1',
      userId: user.id,
      amount: 1000,
      type: 'WELCOME_BONUS',
      description: 'Bonus chào mừng thành viên mới',
    },
  });

  await prisma.transaction.upsert({
    where: { id: 'seed-tx-2' },
    update: {},
    create: {
      id: 'seed-tx-2',
      userId: user.id,
      amount: -50,
      type: 'FILL_DEBIT',
      description: 'Điền form: Khảo sát mức độ hài lòng (50 responses)',
      fillJobId: fillJob.id,
    },
  });

  console.log('✅ Created sample fill job and transactions');
  console.log('');
  console.log('🎉 Seed complete!');
  console.log('');
  console.log('📧 Demo login: demo@fillform.info / demo123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
