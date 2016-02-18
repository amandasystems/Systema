BEGIN TRANSACTION;

PRAGMA user_version = 1;
PRAGMA foreign_keys = ON;

CREATE TABLE tag_type(
       type_id INTEGER PRIMARY KEY,
       description TEXT
);

CREATE TABLE tag (
       tag_id INTEGER PRIMARY KEY,
       colour TEXT,
       description TEXT NOT NULL,
       type_id INTEGER REFERENCES tag_type(type_id),
       CONSTRAINT ns_unq UNIQUE (type_id, description)
);

CREATE TABLE states(
       state_id INTEGER PRIMARY KEY,
       next_state_id INTEGER,
       description TEXT NOT NULL,
       colour TEXT
);

CREATE TABLE note(
       note_id INTEGER PRIMARY KEY,
       is_archived BOOLEAN,
       description TEXT
);

--
-- Composite primary key.
-- See http://www.sqlite.org/lang_createtable.html
--
CREATE TABLE note_parent(
       parent_note_id INTEGER REFERENCES note(note_id) ON DELETE CASCADE,
       child_note_id INTEGER REFERENCES note(note_id) ON DELETE CASCADE,
       PRIMARY KEY(parent_note_id, child_note_id)
);

CREATE TABLE project(
       note_id INTEGER PRIMARY KEY REFERENCES note(note_id) ON DELETE CASCADE,
       type INTEGER
);

CREATE TABLE note_tag(
       note_id INTEGER REFERENCES note(note_id) ON DELETE CASCADE,
       tag_id INTEGER REFERENCES tag(tag_id) ON DELETE CASCADE,
       PRIMARY KEY(note_id, tag_id)
);

CREATE TABLE event_types(
       event_type_id INTEGER PRIMARY KEY,
       description TEXT UNIQUE NOT NULL
);

CREATE TABLE event(
       note_id INTEGER PRIMARY KEY REFERENCES note(note_id) ON DELETE CASCADE,
       event_type_id INTEGER REFERENCES event_types(event_type_id),
       event_date DATETIME,
       event_date_repeat TEXT
);

CREATE TABLE task(
       note_id INTEGER PRIMARY KEY REFERENCES note(note_id) ON DELETE CASCADE,
       effort INTEGER, -- in minutes
       state_id INTEGER REFERENCES states(state_id),
       important BOOLEAN,
       urgent BOOLEAN,
       deadline INTEGER,
       scheduled INTEGER,
       scheduled_repeat TEXT,
       deadline_repeat TEXT
);

CREATE TABLE clock_entry(
       note_id INTEGER PRIMARY KEY REFERENCES note(note_id) ON DELETE SET NULL,
       datetime_start DATETIME NOT NULL,
       datetime_end DATETIME NOT NULL,
       comment TEXT
);

-- tag namespaces: system, list, user
INSERT INTO tag_type(type_id, description) VALUES(0, 'system');
INSERT INTO tag_type(type_id, description) VALUES(1, 'list');
INSERT INTO tag_type(type_id, description) VALUES(2, 'user');

-- Set up system tags
INSERT INTO tag(type_id, description) VALUES(0, 'inbox');
INSERT INTO tag(type_id, description) VALUES(0, 'starred');

-- Set up system event types
INSERT INTO event_types(event_type_id, description) VALUES(0, 'calendar-event');
INSERT INTO event_types(event_type_id, description) VALUES(1, 'logging-event');

-- Default TODO states
INSERT INTO states(state_id, description, next_state_id, colour) VALUES(0, 'DONE', NULL, 'green');
INSERT INTO states(state_id, description, next_state_id, colour) VALUES(1, 'TODO', 0, 'red');
INSERT INTO states(state_id, description, next_state_id, colour) VALUES(2, 'WAITING', 0, 'blue');
INSERT INTO states(state_id, description, next_state_id, colour) VALUES(3, 'CANCELLED', NULL, 'pink');


END TRANSACTION;
