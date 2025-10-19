-- Safe SQL Schema for BL Novels App
-- This version uses CREATE TABLE IF NOT EXISTS to avoid errors with existing tables
-- Run this in Supabase SQL Editor

-- ============================================
-- EXISTING TABLES (Safe to run - won't error)
-- ============================================

CREATE TABLE IF NOT EXISTS authors (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS genres (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS works (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id BIGINT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  summary TEXT,
  background TEXT,
  main_genre_id BIGINT REFERENCES genres(id),
  status VARCHAR(50) DEFAULT 'ongoing',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chapters (
  id BIGSERIAL PRIMARY KEY,
  work_id BIGINT NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  title VARCHAR(255),
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(work_id, chapter_number)
);

CREATE TABLE IF NOT EXISTS work_tags (
  id BIGSERIAL PRIMARY KEY,
  work_id BIGINT NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS translators (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS translation_platforms (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  url_pattern VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS translator_accounts (
  id BIGSERIAL PRIMARY KEY,
  translator_id BIGINT NOT NULL REFERENCES translators(id) ON DELETE CASCADE,
  platform_id BIGINT NOT NULL REFERENCES translation_platforms(id) ON DELETE CASCADE,
  account_name VARCHAR(255) NOT NULL,
  account_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS translations (
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

CREATE TABLE IF NOT EXISTS story_import_requests (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  translator_name VARCHAR(255),
  platform_name VARCHAR(100),
  platform_link VARCHAR(500),
  summary TEXT,
  background TEXT,
  main_genre VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS story_status_history (
  id BIGSERIAL PRIMARY KEY,
  story_import_id BIGINT NOT NULL REFERENCES story_import_requests(id) ON DELETE CASCADE,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  changed_by VARCHAR(255),
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NEW TABLES FOR ACCOUNT SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS user_accounts (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(50) NOT NULL, -- 'reader' or 'translator'
  role VARCHAR(50) DEFAULT 'user', -- 'user', 'translator', 'admin'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS account_upgrade_requests (
  id BIGSERIAL PRIMARY KEY,
  user_account_id BIGINT NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  platform_name VARCHAR(100),
  platform_link VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS story_classifications (
  id BIGSERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS story_classifications_mapping (
  id BIGSERIAL PRIMARY KEY,
  story_import_id BIGINT NOT NULL REFERENCES story_import_requests(id) ON DELETE CASCADE,
  classification_id BIGINT NOT NULL REFERENCES story_classifications(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS story_upload_requests (
  id BIGSERIAL PRIMARY KEY,
  user_account_id BIGINT NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  summary TEXT,
  background TEXT,
  main_genre VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  source_url VARCHAR(500),
  source_platform VARCHAR(100),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS upload_tags (
  id BIGSERIAL PRIMARY KEY,
  upload_id BIGINT NOT NULL REFERENCES story_upload_requests(id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_works_author_id ON works(author_id);
CREATE INDEX IF NOT EXISTS idx_works_main_genre_id ON works(main_genre_id);
CREATE INDEX IF NOT EXISTS idx_chapters_work_id ON chapters(work_id);
CREATE INDEX IF NOT EXISTS idx_work_tags_work_id ON work_tags(work_id);
CREATE INDEX IF NOT EXISTS idx_translations_chapter_id ON translations(chapter_id);
CREATE INDEX IF NOT EXISTS idx_translations_platform_id ON translations(platform_id);
CREATE INDEX IF NOT EXISTS idx_translations_translator_id ON translations(translator_id);
CREATE INDEX IF NOT EXISTS idx_story_import_status ON story_import_requests(status);
CREATE INDEX IF NOT EXISTS idx_user_accounts_email ON user_accounts(email);
CREATE INDEX IF NOT EXISTS idx_user_accounts_username ON user_accounts(username);
CREATE INDEX IF NOT EXISTS idx_user_accounts_user_type ON user_accounts(user_type);
CREATE INDEX IF NOT EXISTS idx_user_accounts_role ON user_accounts(role);
CREATE INDEX IF NOT EXISTS idx_account_upgrade_user_id ON account_upgrade_requests(user_account_id);
CREATE INDEX IF NOT EXISTS idx_account_upgrade_status ON account_upgrade_requests(status);
CREATE INDEX IF NOT EXISTS idx_story_classifications_category ON story_classifications(category);
CREATE INDEX IF NOT EXISTS idx_story_classifications_mapping_story_id ON story_classifications_mapping(story_import_id);
CREATE INDEX IF NOT EXISTS idx_story_classifications_mapping_classification_id ON story_classifications_mapping(classification_id);
CREATE INDEX IF NOT EXISTS idx_story_upload_user_id ON story_upload_requests(user_account_id);
CREATE INDEX IF NOT EXISTS idx_story_upload_status ON story_upload_requests(status);
CREATE INDEX IF NOT EXISTS idx_upload_tags_upload_id ON upload_tags(upload_id);
CREATE INDEX IF NOT EXISTS idx_upload_tags_tag_name ON upload_tags(tag_name);

-- ============================================
-- DONE!
-- ============================================
-- All tables created successfully!
-- You can now use the application without SQL errors.

