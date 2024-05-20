import { VercelClient, createClient } from "@vercel/postgres";

const seedUsers = async (client: VercelClient) => {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    return { createTable };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

const seedUrls = async (client: VercelClient) => {
    try {
        await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
        // Create the "urls" table if it doesn't exist
        const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS urls (
            user_id UUID NOT NULL REFERENCES users(id),
            original_url TEXT NOT NULL,
            short_url TEXT NOT NULL PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP,
            views INT DEFAULT 0
        );
        `;
        console.log(`Created "urls" table`);
        return { createTable };
    } catch (error) {
        console.error('Error seeding urls:', error);
        throw error;
    }
}

            

const main = async () => {
  const client = createClient();
  await client.connect()

  await seedUsers(client);
    await seedUrls(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});