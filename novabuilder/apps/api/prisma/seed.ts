import prisma from './prismaClient.ts';

async function main() {
  console.log('Seeding database...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@novabuilder.test' },
    update: { name: 'Admin User' },
    create: {
      email: 'admin@novabuilder.test',
      name: 'Admin User',
      avatarUrl: null
    }
  });

  const project = await prisma.project.upsert({
    where: { slug: 'demo-project' },
    update: {},
    create: {
      name: 'Demo Project',
      slug: 'demo-project',
      description: 'A demo project seeded for local development',
      ownerId: admin.id
    }
  });

  await prisma.page.upsert({
    where: { id: project.id },
    update: {},
    create: {
      id: project.id,
      projectId: project.id,
      title: 'Home',
      slug: 'home',
      path: '/',
      published: true
    }
  }).catch(() => {});

  await prisma.layout.create({
    data: {
      projectId: project.id,
      name: 'Main Layout',
      json: { layout: 'main', regions: ['header', 'content', 'footer'] }
    }
  });

  await prisma.block.createMany({
    data: [
      {
        projectId: project.id,
        name: 'Hero Simple',
        category: 'Hero',
        schema: { title: 'Hero title', subtitle: 'Hero subtitle' }
      },
      {
        projectId: project.id,
        name: 'Feature Grid',
        category: 'Features',
        schema: { columns: 3 }
      }
    ]
  });

  const folder = await prisma.folder.create({
    data: { projectId: project.id, name: 'root' }
  });

  await prisma.asset.create({
    data: {
      projectId: project.id,
      folderId: folder.id,
      filename: 'logo.png',
      url: '/assets/logo.png',
      mimeType: 'image/png'
    }
  });

  await prisma.team.create({
    data: {
      projectId: project.id,
      name: 'Owners'
    }
  });

  await prisma.cMSCollection.create({
    data: {
      projectId: project.id,
      name: 'Blog Posts',
      slug: 'blog-posts',
      fields: {
        create: [
          { name: 'title', type: 'text' },
          { name: 'body', type: 'richtext' }
        ]
      }
    }
  });

  await prisma.featureFlag.create({
    data: { key: 'beta-editor', meta: { enabled: true } }
  }).catch(() => {});

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Prisma disconnect error:', e?.message || e);
    }
  });
