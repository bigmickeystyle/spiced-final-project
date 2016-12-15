DROP TABLE users;

CREATE TABLE users (
    id SERIAL primary key,
    username VARCHAR(255) not null,
    email_address VARCHAR(255) UNIQUE not null,
    password_hash TEXT not null,
    timecreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    config INTEGER,
    positions TEXT,
    playlists TEXT,
    location VARCHAR(255)
);
