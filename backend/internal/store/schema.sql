CREATE TABLE IF NOT EXISTS users (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL DEFAULT '',
    email      TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS business_profiles (
    user_id       TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    branch        TEXT NOT NULL DEFAULT '',
    business_name TEXT NOT NULL DEFAULT '',
    category      TEXT NOT NULL DEFAULT '',
    needs         JSONB NOT NULL DEFAULT '[]',
    answers       JSONB NOT NULL DEFAULT '{}',
    completed_at  TEXT NOT NULL DEFAULT ''
);

-- Each dashboard section (summary, laporan, pajak, supplier, iklan, modal)
-- is stored as a JSONB blob per user.
CREATE TABLE IF NOT EXISTS dashboard_data (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    section TEXT NOT NULL,
    data    JSONB NOT NULL,
    PRIMARY KEY (user_id, section)
);
