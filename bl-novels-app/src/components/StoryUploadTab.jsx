import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { formatTitle, formatAuthor, formatGenre, formatTag, formatContext } from '../utils/textFormatter';
import '../styles/StoryUploadTab.css';

export default function StoryUploadTab() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploads, setUploads] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author_name: '',
    summary: '',
    background: '',
    main_genre: '',
    source_url: '',
    source_platform: '',
    tags: '',
    translator_editor_name: '',
    is_translator_editor: false
  });

  // Duplicate check state
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  // Fetch user's story uploads
  useEffect(() => {
    if (currentUser) {
      fetchUploads();
    }
  }, [currentUser]);

  const fetchUploads = async () => {
    try {
      const { data, error } = await supabase
        .from('story_upload_requests')
        .select('*')
        .eq('user_account_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch tags for each upload
      const uploadsWithTags = await Promise.all(
        (data || []).map(async (upload) => {
          const { data: tagsData } = await supabase
            .from('upload_tags')
            .select('tag_name')
            .eq('upload_id', upload.id);

          return {
            ...upload,
            tags: tagsData ? tagsData.map(t => t.tag_name) : []
          };
        })
      );

      setUploads(uploadsWithTags);
    } catch (error) {
      console.error('Error fetching uploads:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check for duplicates when title or author changes
    if (name === 'title' || name === 'author_name') {
      checkForDuplicates(name === 'title' ? value : formData.title, name === 'author_name' ? value : formData.author_name);
    }
  };

  // Check for duplicate stories in the database
  const checkForDuplicates = async (title, authorName) => {
    if (!title.trim() || !authorName.trim()) {
      setDuplicateWarning(null);
      return;
    }

    try {
      const formattedTitle = formatTitle(title);
      const formattedAuthor = formatAuthor(authorName);

      // Check in works table
      const { data: existingWorks, error: worksError } = await supabase
        .from('works')
        .select('id, title, authors(name)')
        .ilike('title', `%${formattedTitle}%`);

      if (worksError) throw worksError;

      // Check in story_upload_requests table
      const { data: existingUploads, error: uploadsError } = await supabase
        .from('story_upload_requests')
        .select('id, title, author_name')
        .ilike('title', `%${formattedTitle}%`);

      if (uploadsError) throw uploadsError;

      // Check in story_import_requests table
      const { data: existingImports, error: importsError } = await supabase
        .from('story_import_requests')
        .select('id, title, author_name')
        .ilike('title', `%${formattedTitle}%`);

      if (importsError) throw importsError;

      // Filter by author name as well
      const matchingWorks = existingWorks?.filter(w =>
        w.authors?.name?.toLowerCase().includes(formattedAuthor.toLowerCase())
      ) || [];

      const matchingUploads = existingUploads?.filter(u =>
        u.author_name?.toLowerCase().includes(formattedAuthor.toLowerCase())
      ) || [];

      const matchingImports = existingImports?.filter(i =>
        i.author_name?.toLowerCase().includes(formattedAuthor.toLowerCase())
      ) || [];

      const totalMatches = matchingWorks.length + matchingUploads.length + matchingImports.length;

      if (totalMatches > 0) {
        setDuplicateWarning({
          count: totalMatches,
          works: matchingWorks.length,
          uploads: matchingUploads.length,
          imports: matchingImports.length
        });
      } else {
        setDuplicateWarning(null);
      }
    } catch (error) {
      console.error('Error checking for duplicates:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!formData.title || !formData.author_name) {
        throw new Error('Vui lòng điền đầy đủ tiêu đề và tên tác giả');
      }

      // Parse tags from comma-separated string and format them
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .map(tag => formatTag(tag));

      // Prepare upload data with formatted fields
      const uploadData = {
        user_account_id: currentUser.id,
        title: formatTitle(formData.title),
        author_name: formatAuthor(formData.author_name),
        summary: formatContext(formData.summary),
        background: formatContext(formData.background),
        main_genre: formatGenre(formData.main_genre),
        source_url: formData.source_url,
        source_platform: formData.source_platform,
        translator_editor_name: formData.is_translator_editor ? formatAuthor(formData.translator_editor_name) : null,
        is_translator_editor: formData.is_translator_editor,
        status: 'pending'
      };

      // Insert story upload request
      const { data, error } = await supabase
        .from('story_upload_requests')
        .insert([uploadData])
        .select();

      if (error) throw error;

      const uploadId = data[0].id;

      // Insert tags if any
      if (tagsArray.length > 0) {
        const tagsData = tagsArray.map(tag => ({
          upload_id: uploadId,
          tag_name: tag
        }));

        const { error: tagsError } = await supabase
          .from('upload_tags')
          .insert(tagsData);

        if (tagsError) console.error('Error inserting tags:', tagsError);
      }

      setMessage('Tải lên thành công! Đang chờ phê duyệt từ quản trị viên.');
      setFormData({
        title: '',
        author_name: '',
        summary: '',
        background: '',
        main_genre: '',
        source_url: '',
        source_platform: '',
        tags: '',
        translator_editor_name: '',
        is_translator_editor: false
      });

      // Refresh uploads list
      await fetchUploads();
      setActiveTab('history');
    } catch (error) {
      setMessage('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-pending">Chờ xử lý</span>;
      case 'approved':
        return <span className="badge badge-approved">Phê duyệt</span>;
      case 'rejected':
        return <span className="badge badge-rejected">Từ chối</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="story-upload-container">
      <div className="upload-tabs">
        <button
          className={`upload-tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Tải Lên Truyện
        </button>
        <button
          className={`upload-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📋 Lịch Sử Tải Lên
        </button>
      </div>

      {activeTab === 'upload' && (
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label>Tiêu đề truyện *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Nhập tiêu đề truyện"
            />
          </div>

          <div className="form-group">
            <label>Tên tác giả *</label>
            <input
              type="text"
              name="author_name"
              value={formData.author_name}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Nhập tên tác giả"
            />
          </div>

          {duplicateWarning && (
            <div className="duplicate-warning">
              <strong>⚠️ Cảnh báo trùng lặp:</strong>
              <p>Đã tìm thấy {duplicateWarning.count} truyện có tiêu đề hoặc tác giả tương tự:</p>
              <ul>
                {duplicateWarning.works > 0 && <li>📚 {duplicateWarning.works} trong thư viện chính</li>}
                {duplicateWarning.uploads > 0 && <li>📤 {duplicateWarning.uploads} trong yêu cầu tải lên</li>}
                {duplicateWarning.imports > 0 && <li>✏️ {duplicateWarning.imports} trong yêu cầu nhập</li>}
              </ul>
              <p style={{ fontSize: '0.9em', marginTop: '8px' }}>Vui lòng kiểm tra trước khi gửi để tránh trùng lặp.</p>
            </div>
          )}

          <div className="form-group">
            <label>Thể loại chính</label>
            <input
              type="text"
              name="main_genre"
              value={formData.main_genre}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Ví dụ: Đam Mỹ, Ngôn Tình, v.v."
            />
          </div>

          <div className="form-group">
            <label>Tóm tắt</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Nhập tóm tắt truyện"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Bối cảnh</label>
            <textarea
              name="background"
              value={formData.background}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Nhập bối cảnh truyện"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Nền tảng nguồn</label>
            <input
              type="text"
              name="source_platform"
              value={formData.source_platform}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Ví dụ: Wattpad, Web, v.v."
            />
          </div>

          <div className="form-group">
            <label>URL nguồn</label>
            <input
              type="url"
              name="source_url"
              value={formData.source_url}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label>Thẻ (Tags) - Cách nhau bằng dấu phẩy</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Ví dụ: Đam Mỹ, Hiện Đại, Hành Động, Lãng Mạn"
            />
            <small>Nhập các thẻ cách nhau bằng dấu phẩy (,). Ví dụ: Đam Mỹ, Hiện Đại, Hành Động</small>
          </div>

          {/* Translator/Editor Section */}
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="is_translator_editor"
                checked={formData.is_translator_editor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  is_translator_editor: e.target.checked
                }))}
                disabled={loading}
              />
              Tôi là dịch giả/biên tập viên
            </label>
          </div>

          {formData.is_translator_editor && (
            <div className="form-group">
              <label>Tên dịch giả/biên tập viên</label>
              <input
                type="text"
                name="translator_editor_name"
                value={formData.translator_editor_name}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="Nhập tên dịch giả/biên tập viên"
              />
            </div>
          )}

          <button
            type="submit"
            className="upload-submit-btn"
            disabled={loading}
          >
            {loading ? 'Đang tải lên...' : 'Tải Lên Truyện'}
          </button>

          {message && (
            <div className={`message ${message.includes('Lỗi') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </form>
      )}

      {activeTab === 'history' && (
        <div className="uploads-history">
          {uploads.length === 0 ? (
            <p className="no-uploads">Bạn chưa tải lên truyện nào.</p>
          ) : (
            <div className="uploads-list">
              {uploads.map(upload => (
                <div key={upload.id} className="upload-item">
                  <div className="upload-header">
                    <h3>{upload.title}</h3>
                    {getStatusBadge(upload.status)}
                  </div>
                  <p><strong>Tác giả:</strong> {upload.author_name}</p>
                  <p><strong>Thể loại:</strong> {upload.main_genre || 'Chưa xác định'}</p>
                  {upload.tags && upload.tags.length > 0 && (
                    <p className="upload-tags">
                      <strong>Thẻ:</strong>
                      <span className="tags-list">
                        {upload.tags.map((tag, idx) => (
                          <span key={idx} className="tag-badge">{tag}</span>
                        ))}
                      </span>
                    </p>
                  )}
                  <p><strong>Ngày tải lên:</strong> {new Date(upload.created_at).toLocaleDateString('vi-VN')}</p>
                  {upload.admin_notes && (
                    <p className="admin-notes"><strong>Ghi chú từ quản trị viên:</strong> {upload.admin_notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

