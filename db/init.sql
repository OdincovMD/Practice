CREATE DATABASE pneumonia;
\c pneumonia

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login TEXT UNIQUE NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    last_login_ip TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- CREATE TABLE images (
--     id SERIAL PRIMARY KEY,
--     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--     original_filename TEXT NOT NULL,
--     stored_filename TEXT NOT NULL,
--     upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--     hout_time_zone TEXT,
--     processing_result TEXT
-- );
-- CREATE TABLE diagnosisresults (
--     id SERIAL PRIMARY KEY,
--     image_id INTEGER REFERENCES images(id) ON DELETE CASCADE,
--     diagnosis TEXT,
--     confidence_score DOUBLE PRECISION,
--     recission TEXT,
--     model_version TEXT,
--     processing_time INTEGER,
--     diagnosis_details JSONB,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );