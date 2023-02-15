-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS contributions CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  email VARCHAR(255),
  password VARCHAR(255)
);

CREATE TABLE stories (
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  story VARCHAR(255),
  end_story BOOLEAN DEFAULT FALSE
);

CREATE TABLE contributions (
  id SERIAL PRIMARY KEY NOT NULL,
  story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
  contribution VARCHAR(255),
  upvotes INTEGER,
  date_created INTEGER
);


