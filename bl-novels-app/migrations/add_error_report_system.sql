-- Error Report System Migration
-- Date: 2025-10-20
-- Description: Adds error/bug report functionality for story information

-- ============================================
-- 1. Create error_reports table
-- ============================================

CREATE TABLE IF NOT EXISTS error_reports (
  id BIGSERIAL PRIMARY KEY,
  work_id BIGINT NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  user_account_id BIGINT REFERENCES user_accounts(id) ON DELETE SET NULL,
  reporter_name VARCHAR(255), -- For anonymous reports or display name
  report_type VARCHAR(50) NOT NULL, -- 'incorrect_info', 'missing_info', 'broken_link', 'other'
  field_name VARCHAR(100), -- Which field has the error (e.g., 'title', 'author', 'summary')
  description TEXT NOT NULL, -- Detailed description of the error
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'resolved', 'rejected'
  admin_notes TEXT, -- Admin's notes on the report
  resolved_by BIGINT REFERENCES user_accounts(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. Create indexes for better performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_error_reports_work_id ON error_reports(work_id);
CREATE INDEX IF NOT EXISTS idx_error_reports_user_id ON error_reports(user_account_id);
CREATE INDEX IF NOT EXISTS idx_error_reports_status ON error_reports(status);
CREATE INDEX IF NOT EXISTS idx_error_reports_created_at ON error_reports(created_at DESC);

-- ============================================
-- 3. Create user_reviews table for review system
-- ============================================

CREATE TABLE IF NOT EXISTS user_reviews (
  id BIGSERIAL PRIMARY KEY,
  work_id BIGINT NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  user_account_id BIGINT NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  username VARCHAR(255) NOT NULL, -- Cached username for display
  rating INT CHECK (rating >= 1 AND rating <= 5), -- 1-5 stars (optional)
  review_text TEXT NOT NULL,
  likes_count INT DEFAULT 0,
  dislikes_count INT DEFAULT 0,
  is_reported BOOLEAN DEFAULT false,
  report_count INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'hidden', 'deleted'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(work_id, user_account_id) -- One review per user per work
);

-- ============================================
-- 4. Create review_reactions table (likes/dislikes)
-- ============================================

CREATE TABLE IF NOT EXISTS review_reactions (
  id BIGSERIAL PRIMARY KEY,
  review_id BIGINT NOT NULL REFERENCES user_reviews(id) ON DELETE CASCADE,
  user_account_id BIGINT NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  reaction_type VARCHAR(20) NOT NULL, -- 'like' or 'dislike'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(review_id, user_account_id) -- One reaction per user per review
);

-- ============================================
-- 5. Create review_reports table
-- ============================================

CREATE TABLE IF NOT EXISTS review_reports (
  id BIGSERIAL PRIMARY KEY,
  review_id BIGINT NOT NULL REFERENCES user_reviews(id) ON DELETE CASCADE,
  reporter_id BIGINT NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  reason VARCHAR(100) NOT NULL, -- 'spam', 'offensive', 'inappropriate', 'other'
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'resolved', 'rejected'
  admin_notes TEXT,
  resolved_by BIGINT REFERENCES user_accounts(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. Create indexes for review tables
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_reviews_work_id ON user_reviews(work_id);
CREATE INDEX IF NOT EXISTS idx_user_reviews_user_id ON user_reviews(user_account_id);
CREATE INDEX IF NOT EXISTS idx_user_reviews_status ON user_reviews(status);
CREATE INDEX IF NOT EXISTS idx_user_reviews_created_at ON user_reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_review_reactions_review_id ON review_reactions(review_id);
CREATE INDEX IF NOT EXISTS idx_review_reactions_user_id ON review_reactions(user_account_id);

CREATE INDEX IF NOT EXISTS idx_review_reports_review_id ON review_reports(review_id);
CREATE INDEX IF NOT EXISTS idx_review_reports_status ON review_reports(status);

-- ============================================
-- 7. Create triggers to update counts
-- ============================================

-- Trigger to update review likes/dislikes count
CREATE OR REPLACE FUNCTION update_review_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.reaction_type = 'like' THEN
      UPDATE user_reviews SET likes_count = likes_count + 1 WHERE id = NEW.review_id;
    ELSIF NEW.reaction_type = 'dislike' THEN
      UPDATE user_reviews SET dislikes_count = dislikes_count + 1 WHERE id = NEW.review_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.reaction_type = 'like' THEN
      UPDATE user_reviews SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.review_id;
    ELSIF OLD.reaction_type = 'dislike' THEN
      UPDATE user_reviews SET dislikes_count = GREATEST(0, dislikes_count - 1) WHERE id = OLD.review_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle reaction type change
    IF OLD.reaction_type = 'like' THEN
      UPDATE user_reviews SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.review_id;
    ELSIF OLD.reaction_type = 'dislike' THEN
      UPDATE user_reviews SET dislikes_count = GREATEST(0, dislikes_count - 1) WHERE id = OLD.review_id;
    END IF;
    IF NEW.reaction_type = 'like' THEN
      UPDATE user_reviews SET likes_count = likes_count + 1 WHERE id = NEW.review_id;
    ELSIF NEW.reaction_type = 'dislike' THEN
      UPDATE user_reviews SET dislikes_count = dislikes_count + 1 WHERE id = NEW.review_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_review_reaction_counts ON review_reactions;
CREATE TRIGGER trigger_update_review_reaction_counts
AFTER INSERT OR UPDATE OR DELETE ON review_reactions
FOR EACH ROW EXECUTE FUNCTION update_review_reaction_counts();

-- Trigger to update review report count
CREATE OR REPLACE FUNCTION update_review_report_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_reviews 
    SET report_count = report_count + 1,
        is_reported = true
    WHERE id = NEW.review_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_review_report_count ON review_reports;
CREATE TRIGGER trigger_update_review_report_count
AFTER INSERT ON review_reports
FOR EACH ROW EXECUTE FUNCTION update_review_report_count();

-- ============================================
-- 8. Create admin_notifications table
-- ============================================

CREATE TABLE IF NOT EXISTS admin_notifications (
  id BIGSERIAL PRIMARY KEY,
  notification_type VARCHAR(50) NOT NULL, -- 'error_report', 'review_report', 'story_upload', 'upgrade_request'
  reference_id BIGINT NOT NULL, -- ID of the related record
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON admin_notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON admin_notifications(created_at DESC);

-- ============================================
-- 9. Create triggers for notifications
-- ============================================

-- Trigger for new error reports
CREATE OR REPLACE FUNCTION notify_admin_error_report()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_notifications (notification_type, reference_id, title, message)
  VALUES (
    'error_report',
    NEW.id,
    'Báo Lỗi Mới: ' || (SELECT title FROM works WHERE id = NEW.work_id LIMIT 1),
    'Người dùng ' || COALESCE(NEW.reporter_name, 'Ẩn danh') || ' đã báo lỗi về truyện'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_admin_error_report ON error_reports;
CREATE TRIGGER trigger_notify_admin_error_report
AFTER INSERT ON error_reports
FOR EACH ROW EXECUTE FUNCTION notify_admin_error_report();

-- Trigger for new review reports
CREATE OR REPLACE FUNCTION notify_admin_review_report()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_notifications (notification_type, reference_id, title, message)
  VALUES (
    'review_report',
    NEW.id,
    'Báo Cáo Đánh Giá Mới',
    'Một đánh giá đã bị báo cáo vi phạm tiêu chuẩn cộng đồng'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_admin_review_report ON review_reports;
CREATE TRIGGER trigger_notify_admin_review_report
AFTER INSERT ON review_reports
FOR EACH ROW EXECUTE FUNCTION notify_admin_review_report();

-- ============================================
-- 10. Verification queries
-- ============================================

SELECT 'Error report system migration completed successfully!' as status;

-- Show table structures
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('error_reports', 'user_reviews', 'review_reactions', 'review_reports', 'admin_notifications')
ORDER BY table_name, ordinal_position;

