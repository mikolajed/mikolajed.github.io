DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at INTEGER,
  updated_at INTEGER
);

-- Index for faster lookups by slug
CREATE INDEX idx_posts_slug ON posts(slug);
