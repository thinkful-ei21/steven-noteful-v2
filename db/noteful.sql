DROP TABLE IF EXISTS notes_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;

CREATE TABLE folders (
 id serial PRIMARY KEY,
 name text NOT NULL
);

INSERT INTO folders (name) VALUES
 ('Archive'),
 ('Drafts'),
 ('Personal'),
 ('Work');

CREATE TABLE notes (
 id serial PRIMARY KEY,
 title text NOT NULL,
 content text,
 created timestamp DEFAULT now(),
 folders_id int REFERENCES folders(id) ON DELETE SET NULL
);

INSERT INTO notes (title, content, folders_id) VALUES
 (
 '5 life lessons learned from cats',
 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
 1

 ),
 (
 'still about dogs',
 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
 3

 ),
 (
 '5 life lessons learned from cats',
 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
 1

 ),
 (
 'not about cats',
 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,',
 2

 ); 


CREATE TABLE tags (
 id serial PRIMARY KEY,
 name text NOT NULL UNIQUE
);

INSERT INTO tags (name) VALUES
 ('red'),
 ('blue'),
 ('yellow');

CREATE TABLE notes_tags (
 note_id INTEGER NOT NULL REFERENCES notes ON DELETE CASCADE,
 tag_id INTEGER NOT NULL REFERENCES tags ON DELETE CASCADE
);

INSERT INTO notes_tags (note_id, tag_id)VALUES
 (1,1),
 (1,2),
 (2,3),
 (3,3),
 (4,2);