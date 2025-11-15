// mimo-api/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.message.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.moodTracking.deleteMany();
  await prisma.therapist.deleteMany();
  await prisma.user.deleteMany();

  // Create test patients
  const patient1 = await prisma.user.create({
    data: {
      email: 'patient1@test.com',
      name: 'Ahmet Yılmaz',
      password: await bcrypt.hash('Test123!', 10),
      phone: '5551234567',
      role: 'PATIENT',
      emailVerified: true,
    },
  });

  const patient2 = await prisma.user.create({
    data: {
      email: 'patient2@test.com',
      name: 'Ayşe Kaya',
      password: await bcrypt.hash('Test123!', 10),
      phone: '5559876543',
      role: 'PATIENT',
      emailVerified: true,
    },
  });

  // Create test therapists
  const therapistUser1 = await prisma.user.create({
    data: {
      email: 'therapist1@test.com',
      name: 'Dr. Mehmet Öz',
      password: await bcrypt.hash('Test123!', 10),
      phone: '5551112233',
      role: 'THERAPIST',
      emailVerified: true,
    },
  });

  const therapist1 = await prisma.therapist.create({
    data: {
      userId: therapistUser1.id,
      licenseNo: 'PSY-2020-12345',
      specialties: ['Depresyon', 'Anksiyete', 'Stres Yönetimi'],
      about: 'Klinik psikoloji alanında 10 yıllık deneyime sahibim. Bilişsel davranışçı terapi ve mindfulness teknikleri konusunda uzmanım.',
      experience: 10,
      education: ['İstanbul Üniversitesi - Psikoloji Lisans', 'Boğaziçi Üniversitesi - Klinik Psikoloji Yüksek Lisans'],
      languages: ['Türkçe', 'İngilizce'],
      sessionPrice: 500,
      availability: {
        monday: ['09:00-12:00', '14:00-17:00'],
        tuesday: ['09:00-12:00', '14:00-17:00'],
        wednesday: ['09:00-12:00'],
        thursday: ['09:00-12:00', '14:00-17:00'],
        friday: ['09:00-12:00', '14:00-17:00'],
      },
      verifiedAt: new Date(),
      isActive: true,
      rating: 4.8,
      totalReviews: 45,
    },
  });

  const therapistUser2 = await prisma.user.create({
    data: {
      email: 'therapist2@test.com',
      name: 'Dr. Zeynep Demir',
      password: await bcrypt.hash('Test123!', 10),
      phone: '5554445566',
      role: 'THERAPIST',
      emailVerified: true,
    },
  });

  const therapist2 = await prisma.therapist.create({
    data: {
      userId: therapistUser2.id,
      licenseNo: 'PSY-2018-54321',
      specialties: ['İlişki Terapisi', 'Aile Danışmanlığı', 'Travma'],
      about: 'Çift ve aile terapisi konusunda uzmanım. EMDR sertifikasına sahibim ve travma sonrası stres bozukluğu tedavisinde deneyimliyim.',
      experience: 12,
      education: ['ODTÜ - Psikoloji Lisans', 'Ankara Üniversitesi - Aile Danışmanlığı Yüksek Lisans', 'EMDR Sertifikası'],
      languages: ['Türkçe', 'İngilizce', 'Almanca'],
      sessionPrice: 600,
      availability: {
        monday: ['10:00-13:00', '15:00-18:00'],
        tuesday: ['10:00-13:00', '15:00-18:00'],
        wednesday: ['10:00-13:00'],
        thursday: ['10:00-13:00', '15:00-18:00'],
        friday: ['10:00-13:00'],
      },
      verifiedAt: new Date(),
      isActive: true,
      rating: 4.9,
      totalReviews: 67,
    },
  });

  const therapistUser3 = await prisma.user.create({
    data: {
      email: 'therapist3@test.com',
      name: 'Uzm. Psk. Ali Yıldırım',
      password: await bcrypt.hash('Test123!', 10),
      phone: '5557778899',
      role: 'THERAPIST',
      emailVerified: true,
    },
  });

  const therapist3 = await prisma.therapist.create({
    data: {
      userId: therapistUser3.id,
      licenseNo: 'PSY-2019-98765',
      specialties: ['Çocuk ve Ergen', 'DEHB', 'Otizm Spektrum'],
      about: 'Çocuk ve ergen psikolojisi alanında 8 yıllık deneyimim var. Oyun terapisi ve aile eğitimi konularında çalışıyorum.',
      experience: 8,
      education: ['Hacettepe Üniversitesi - Psikoloji Lisans', 'Çocuk ve Ergen Psikolojisi Sertifikası'],
      languages: ['Türkçe', 'İngilizce'],
      sessionPrice: 450,
      availability: {
        monday: ['09:00-12:00', '13:00-16:00'],
        tuesday: ['09:00-12:00', '13:00-16:00'],
        wednesday: ['09:00-12:00'],
        thursday: ['09:00-12:00', '13:00-16:00'],
        friday: ['09:00-12:00'],
        saturday: ['10:00-13:00'],
      },
      verifiedAt: new Date(),
      isActive: true,
      rating: 4.7,
      totalReviews: 32,
    },
  });

  // Create appointments
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const appointment1 = await prisma.appointment.create({
    data: {
      userId: patient1.id,
      therapistId: therapist1.id,
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 60 * 60 * 1000), // 1 hour later
      type: 'VIDEO',
      price: 500,
      status: 'CONFIRMED',
      notes: 'İlk seans - tanışma ve değerlendirme',
      meetingUrl: 'https://meet.mimo.app/session-123456',
    },
  });

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(14, 0, 0, 0);

  const appointment2 = await prisma.appointment.create({
    data: {
      userId: patient1.id,
      therapistId: therapist2.id,
      startTime: nextWeek,
      endTime: new Date(nextWeek.getTime() + 60 * 60 * 1000),
      type: 'VIDEO',
      price: 600,
      status: 'PENDING',
      notes: 'İlişki danışmanlığı',
    },
  });

  // Create past appointment
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  lastWeek.setHours(11, 0, 0, 0);

  const appointment3 = await prisma.appointment.create({
    data: {
      userId: patient2.id,
      therapistId: therapist1.id,
      startTime: lastWeek,
      endTime: new Date(lastWeek.getTime() + 60 * 60 * 1000),
      type: 'VIDEO',
      price: 500,
      status: 'COMPLETED',
      notes: 'Stres yönetimi seansı tamamlandı',
    },
  });

  // Create mood tracking data for patient1
  const moodData = [
    { mood: 'happy', value: 8, notes: 'Bugün kendimi çok iyi hissediyorum' },
    { mood: 'neutral', value: 6, notes: 'Normal bir gün' },
    { mood: 'anxious', value: 4, notes: 'İş stresi yüzünden biraz gerginim' },
    { mood: 'happy', value: 7, notes: 'Arkadaşlarla güzel vakit geçirdim' },
    { mood: 'tired', value: 5, notes: 'Yorgun ama pozitif' },
  ];

  for (let i = 0; i < moodData.length; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    await prisma.moodTracking.create({
      data: {
        userId: patient1.id,
        mood: moodData[i].mood,
        value: moodData[i].value,
        notes: moodData[i].notes,
        createdAt: date,
      },
    });
  }

  // Create reviews
  await prisma.review.create({
    data: {
      therapistId: therapist1.id,
      rating: 5,
      comment: 'Dr. Mehmet Bey çok anlayışlı ve profesyonel. Kesinlikle tavsiye ederim.',
      isAnonymous: false,
    },
  });

  await prisma.review.create({
    data: {
      therapistId: therapist1.id,
      rating: 4,
      comment: 'Genel olarak memnunum, seanslar faydalı geçiyor.',
      isAnonymous: true,
    },
  });

  await prisma.review.create({
    data: {
      therapistId: therapist2.id,
      rating: 5,
      comment: 'Zeynep Hanım alanında uzman ve çok yardımcı oluyor. Çift terapisinde harika sonuçlar aldık.',
      isAnonymous: false,
    },
  });

  // Create messages
  await prisma.message.create({
    data: {
      senderId: patient1.id,
      receiverId: therapistUser1.id,
      appointmentId: appointment1.id,
      content: 'Merhaba, yarınki seansımız için hazırım. Görüşmek üzere!',
      isRead: true,
      readAt: new Date(),
    },
  });

  await prisma.message.create({
    data: {
      senderId: therapistUser1.id,
      receiverId: patient1.id,
      appointmentId: appointment1.id,
      content: 'Merhaba, ben de sabırsızlanıyorum. Görüşmek üzere!',
      isRead: false,
    },
  });

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@mimo.app',
      name: 'Admin User',
      password: await bcrypt.hash('Admin123!', 10),
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📝 Test Accounts:');
  console.log('-------------------');
  console.log('Patient: patient1@test.com / Test123!');
  console.log('Patient: patient2@test.com / Test123!');
  console.log('Therapist: therapist1@test.com / Test123!');
  console.log('Therapist: therapist2@test.com / Test123!');
  console.log('Therapist: therapist3@test.com / Test123!');
  console.log('Admin: admin@mimo.app / Admin123!');
  console.log('-------------------\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });