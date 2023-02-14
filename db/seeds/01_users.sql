-- Users table seeds here (Example)
INSERT INTO users (email, password) VALUES ('a@a.com', 'a');
INSERT INTO users (email, password) VALUES ('b@b.com', 'b');

INSERT INTO stories (owner_id, title, story) VALUES (1, 'Fairytales', 'Once upon a time...');
INSERT INTO stories (owner_id, title, story) VALUES (1, 'Starwars', 'A long time agon in a galaxy far, far away...');
INSERT INTO stories (owner_id, title, story) VALUES (2, 'How I met your mother', 'So the story goes,');

INSERT INTO contributions (story_id, contribution, upvotes) VALUES (2, 'JEDI DIES', 5);
INSERT INTO contributions (story_id, contribution, upvotes) VALUES (2, 'I AM YOUR FATHER', 99);
INSERT INTO contributions (story_id, contribution, upvotes) VALUES (1, 'Hello there', 99);

