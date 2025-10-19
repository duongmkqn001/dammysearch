-- Sample Data for Testing
-- Date: 2025-10-19
-- Description: Adds sample data to test the application features

-- ============================================
-- 1. Add sample authors
-- ============================================

INSERT INTO authors (name, bio) VALUES
  ('Thiên Phi', 'Tác giả nổi tiếng với các tác phẩm đam mỹ cổ trang')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 2. Add sample genres
-- ============================================

INSERT INTO genres (name, description) VALUES
  ('Đam Mỹ', 'Thể loại tình cảm nam-nam'),
  ('Cổ Trang', 'Bối cảnh thời cổ đại'),
  ('Hiện Đại', 'Bối cảnh thời hiện đại'),
  ('Huyền Huyễn', 'Thể loại huyền ảo, thần thoại'),
  ('Xuyên Không', 'Thể loại xuyên không gian, thời gian')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 3. Update existing work "Vùng Cấm Hoa Hồng" with complete information
-- ============================================

-- First, get the IDs we need
DO $$
DECLARE
  author_id_var BIGINT;
  genre_id_var BIGINT;
  work_id_var BIGINT;
BEGIN
  -- Get author ID
  SELECT id INTO author_id_var FROM authors WHERE name = 'Thiên Phi' LIMIT 1;
  
  -- Get genre ID
  SELECT id INTO genre_id_var FROM genres WHERE name = 'Đam Mỹ' LIMIT 1;
  
  -- Check if work exists
  SELECT id INTO work_id_var FROM works WHERE title = 'Vùng Cấm Hoa Hồng' LIMIT 1;
  
  IF work_id_var IS NOT NULL THEN
    -- Update existing work
    UPDATE works 
    SET 
      author_id = author_id_var,
      main_genre_id = genre_id_var,
      status = 'ongoing',
      chapter_count = 45,
      translator_name = 'Translator Name',
      translation_platform = 'Wattpad',
      translation_url = 'https://www.wattpad.com/story/example'
    WHERE id = work_id_var;
    
    -- Add tags for this work
    DELETE FROM work_tags WHERE work_id = work_id_var;
    
    INSERT INTO work_tags (work_id, tag_name) VALUES
      (work_id_var, 'Tình hữu độc chung'),
      (work_id_var, 'Trời sinh một cặp'),
      (work_id_var, 'Con cưng của trời'),
      (work_id_var, 'Ngọt ngào'),
      (work_id_var, 'Trường thành'),
      (work_id_var, 'ABO');
      
    RAISE NOTICE 'Updated work: Vùng Cấm Hoa Hồng (ID: %)', work_id_var;
  ELSE
    -- Insert new work if it doesn't exist
    INSERT INTO works (
      title, 
      author_id, 
      summary, 
      background, 
      main_genre_id, 
      status,
      chapter_count,
      translator_name,
      translation_platform,
      translation_url
    ) VALUES (
      'Vùng Cấm Hoa Hồng',
      author_id_var,
      E'Ngày biết được bạn đời mới xác lập quan hệ của mình là Enigma, Tô Tri đã không kịp nhận thức được mọi nguy hiểm phía sau đó.\n\nViên nghiên cứu bảng nhiên cho nghĩ phép: Tô Tri mang theo mẫu máu của Enigma đi nghiên cứu, nhưng lại bị Enigma phát hiện.\n\nTô Tri: Anh đừng giết tôi QAQ\n\nEnigma: Tôi không giết ngươi, nhưng ngươi phải chịu trách nhiệm với ta.\n\nTô Tri: ???',
      'Hiện Đại',
      genre_id_var,
      'ongoing',
      45,
      'Translator Name',
      'Wattpad',
      'https://www.wattpad.com/story/example'
    ) RETURNING id INTO work_id_var;
    
    -- Add tags for the new work
    INSERT INTO work_tags (work_id, tag_name) VALUES
      (work_id_var, 'Tình hữu độc chung'),
      (work_id_var, 'Trời sinh một cặp'),
      (work_id_var, 'Con cưng của trời'),
      (work_id_var, 'Ngọt ngào'),
      (work_id_var, 'Trường thành'),
      (work_id_var, 'ABO');
      
    RAISE NOTICE 'Created new work: Vùng Cấm Hoa Hồng (ID: %)', work_id_var;
  END IF;
END $$;

-- ============================================
-- 4. Add more sample works for testing
-- ============================================

DO $$
DECLARE
  author_id_var BIGINT;
  genre_id_var BIGINT;
  work_id_var BIGINT;
BEGIN
  -- Get author and genre IDs
  SELECT id INTO author_id_var FROM authors WHERE name = 'Thiên Phi' LIMIT 1;
  SELECT id INTO genre_id_var FROM genres WHERE name = 'Đam Mỹ' LIMIT 1;
  
  -- Insert sample work 2
  INSERT INTO works (
    title, 
    author_id, 
    summary, 
    background, 
    main_genre_id, 
    status,
    chapter_count,
    translator_name,
    translation_platform,
    translation_url
  ) VALUES (
    'Chim Hoàng Yến',
    author_id_var,
    'Một câu chuyện tình cảm đầy cảm động về hai chàng trai trong bối cảnh cổ trang.',
    'Triều đại giả tưởng, thời kỳ loạn lạc',
    genre_id_var,
    'completed',
    120,
    'Dịch Giả ABC',
    'WordPress',
    'https://example.wordpress.com/chim-hoang-yen'
  ) RETURNING id INTO work_id_var;
  
  -- Add tags
  INSERT INTO work_tags (work_id, tag_name) VALUES
    (work_id_var, 'Cổ trang'),
    (work_id_var, 'Ngọt ngào'),
    (work_id_var, 'HE');
    
  RAISE NOTICE 'Created work: Chim Hoàng Yến (ID: %)', work_id_var;
  
  -- Insert sample work 3
  INSERT INTO works (
    title, 
    author_id, 
    summary, 
    background, 
    main_genre_id, 
    status,
    chapter_count,
    translator_name,
    translation_platform,
    translation_url
  ) VALUES (
    'Ánh Trăng Soi Rọi',
    author_id_var,
    'Câu chuyện về một thiếu niên xuyên không về thời cổ đại và gặp gỡ định mệnh của mình.',
    'Xuyên không, cổ đại',
    genre_id_var,
    'ongoing',
    78,
    'Nhóm Dịch XYZ',
    'Wattpad',
    'https://www.wattpad.com/story/anh-trang-soi-roi'
  ) RETURNING id INTO work_id_var;
  
  -- Add tags
  INSERT INTO work_tags (work_id, tag_name) VALUES
    (work_id_var, 'Xuyên không'),
    (work_id_var, 'Cổ trang'),
    (work_id_var, 'Ngọt ngào'),
    (work_id_var, 'Sủng'),
    (work_id_var, '1v1');
    
  RAISE NOTICE 'Created work: Ánh Trăng Soi Rọi (ID: %)', work_id_var;
END $$;

-- ============================================
-- 5. Verification queries
-- ============================================

-- Show all works with their complete information
SELECT 
  w.id,
  w.title,
  a.name as author,
  g.name as genre,
  w.status,
  w.chapter_count,
  w.translator_name,
  w.translation_platform,
  w.translation_url,
  (SELECT COUNT(*) FROM work_tags WHERE work_id = w.id) as tag_count
FROM works w
LEFT JOIN authors a ON w.author_id = a.id
LEFT JOIN genres g ON w.main_genre_id = g.id
ORDER BY w.title;

-- Show all tags for each work
SELECT 
  w.title,
  STRING_AGG(wt.tag_name, ', ') as tags
FROM works w
LEFT JOIN work_tags wt ON w.id = wt.work_id
GROUP BY w.id, w.title
ORDER BY w.title;

-- Summary
SELECT 
  'Sample data added successfully!' as status,
  (SELECT COUNT(*) FROM works) as total_works,
  (SELECT COUNT(*) FROM authors) as total_authors,
  (SELECT COUNT(*) FROM genres) as total_genres,
  (SELECT COUNT(*) FROM work_tags) as total_tags;

