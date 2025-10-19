-- Supabase Schema for Chinese BL Novel Synthesis Platform
-- This schema supports comprehensive management of novels, authors, chapters, and translations

-- Authors table
CREATE TABLE authors (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Genres table
CREATE TABLE genres (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Works (Novels) table
CREATE TABLE works (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id BIGINT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  summary TEXT,
  background TEXT,
  main_genre_id BIGINT REFERENCES genres(id),
  status VARCHAR(50) DEFAULT 'ongoing', -- ongoing, completed, hiatus
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work Tags (for related story tags)
CREATE TABLE work_tags (
  id BIGSERIAL PRIMARY KEY,
  work_id BIGINT NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Translation Platforms table
CREATE TABLE translation_platforms (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'Wattpad', 'Web', etc.
  url_pattern VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Translators/Editors table (must be created before translations table)
CREATE TABLE translators (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chapters table
CREATE TABLE chapters (
  id BIGSERIAL PRIMARY KEY,
  work_id BIGINT NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  title VARCHAR(255),
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(work_id, chapter_number)
);

-- Translations table
CREATE TABLE translations (
  id BIGSERIAL PRIMARY KEY,
  chapter_id BIGINT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  translator_id BIGINT REFERENCES translators(id),
  platform_id BIGINT NOT NULL REFERENCES translation_platforms(id),
  translation_url VARCHAR(500),
  translated_content TEXT,
  language VARCHAR(50) DEFAULT 'Vietnamese',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_works_author_id ON works(author_id);
CREATE INDEX idx_works_main_genre_id ON works(main_genre_id);
CREATE INDEX idx_chapters_work_id ON chapters(work_id);
CREATE INDEX idx_work_tags_work_id ON work_tags(work_id);
CREATE INDEX idx_translations_chapter_id ON translations(chapter_id);
CREATE INDEX idx_translations_platform_id ON translations(platform_id);
CREATE INDEX idx_translations_translator_id ON translations(translator_id);

-- Create search indexes for better full-text search
-- Note: Using 'english' as default since 'vietnamese' is not available in standard PostgreSQL
-- For Vietnamese support, install the vietnamese text search configuration or use simple text search
CREATE INDEX idx_works_title_search ON works USING GIN(to_tsvector('english', title));
CREATE INDEX idx_authors_name_search ON authors USING GIN(to_tsvector('english', name));
CREATE INDEX idx_work_tags_name_search ON work_tags USING GIN(to_tsvector('english', tag_name));

-- User Accounts table (for all user types - readers and translators)
CREATE TABLE user_accounts (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(50) DEFAULT 'reader', -- 'reader' or 'translator'
  role VARCHAR(50) DEFAULT 'user', -- 'user', 'translator', 'admin'
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Translator Accounts table (for backward compatibility and translator-specific info)
CREATE TABLE translator_accounts (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  translator_id BIGINT REFERENCES translators(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Account Upgrade Requests table (for readers requesting translator status)
CREATE TABLE account_upgrade_requests (
  id BIGSERIAL PRIMARY KEY,
  user_account_id BIGINT NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  platform_name VARCHAR(100),
  platform_link VARCHAR(500),
  proof_image_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_by BIGINT REFERENCES user_accounts(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP,
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Story Import Requests table (for tracking story submissions)
CREATE TABLE story_import_requests (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  summary TEXT,
  background TEXT,
  main_genre VARCHAR(100),
  translator_id BIGINT NOT NULL REFERENCES translators(id) ON DELETE CASCADE,
  translator_name VARCHAR(255), -- Store translator name for easy access
  status VARCHAR(50) DEFAULT 'incoming', -- incoming, process, completed, rejected
  source_url VARCHAR(500),
  source_platform VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Story Status History table (for tracking status changes)
CREATE TABLE story_status_history (
  id BIGSERIAL PRIMARY KEY,
  story_import_id BIGINT NOT NULL REFERENCES story_import_requests(id) ON DELETE CASCADE,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by BIGINT REFERENCES translator_accounts(id),
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Story Upload Requests table (for readers uploading stories)
CREATE TABLE IF NOT EXISTS story_upload_requests (
  id BIGSERIAL PRIMARY KEY,
  user_account_id BIGINT NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  summary TEXT,
  background TEXT,
  main_genre VARCHAR(100),
  translator_editor_name VARCHAR(255), -- Name of translator/editor if applicable
  is_translator_editor BOOLEAN DEFAULT false, -- Whether the uploader is a translator/editor
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  source_url VARCHAR(500),
  source_platform VARCHAR(100),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for new tables
CREATE INDEX idx_translator_accounts_email ON translator_accounts(email);
CREATE INDEX idx_translator_accounts_username ON translator_accounts(username);
CREATE INDEX idx_story_import_translator_id ON story_import_requests(translator_id);
CREATE INDEX idx_story_import_status ON story_import_requests(status);
CREATE INDEX idx_story_status_history_story_id ON story_status_history(story_import_id);
CREATE INDEX IF NOT EXISTS idx_story_upload_user_id ON story_upload_requests(user_account_id);
CREATE INDEX IF NOT EXISTS idx_story_upload_status ON story_upload_requests(status);
CREATE INDEX IF NOT EXISTS idx_account_upgrade_user_id ON account_upgrade_requests(user_account_id);
CREATE INDEX IF NOT EXISTS idx_account_upgrade_status ON account_upgrade_requests(status);

