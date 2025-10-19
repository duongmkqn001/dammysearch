import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import '../styles/AuthorListTab.css'

export default function AuthorListTab() {
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [authorWorks, setAuthorWorks] = useState([])
  const [selectedWork, setSelectedWork] = useState(null)

  useEffect(() => {
    fetchAuthors()
  }, [])

  const fetchAuthors = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('authors')
        .select('*')
        .order('name', { ascending: true })

      if (err) throw err
      setAuthors(data || [])
    } catch (err) {
      setError('Lỗi tải danh sách tác giả: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAuthorClick = async (author) => {
    setSelectedAuthor(author)
    try {
      const { data, error: err } = await supabase
        .from('works')
        .select('*')
        .eq('author_id', author.id)
        .order('title', { ascending: true })

      if (err) throw err
      setAuthorWorks(data || [])
    } catch (err) {
      console.error('Lỗi tải tác phẩm:', err)
    }
  }

  if (loading) return <div className="loading">Đang tải...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="author-list-tab">
      <div className="authors-container">
        <h2>Danh Sách Tác Giả</h2>
        <div className="authors-list">
          {authors.map((author) => (
            <button
              key={author.id}
              className={`author-item ${selectedAuthor?.id === author.id ? 'active' : ''}`}
              onClick={() => handleAuthorClick(author)}
            >
              {author.name}
            </button>
          ))}
        </div>
      </div>

      {selectedAuthor && (
        <div className="author-details">
          <h2>{selectedAuthor.name}</h2>
          {selectedAuthor.bio && <p className="bio">{selectedAuthor.bio}</p>}
          
          <h3>Tác Phẩm ({authorWorks.length})</h3>
          <div className="works-list">
            {authorWorks.length === 0 ? (
              <p>Chưa có tác phẩm nào</p>
            ) : (
              authorWorks.map((work) => (
                <div
                  key={work.id}
                  className="work-item"
                  onClick={() => setSelectedWork(work)}
                  style={{ cursor: 'pointer' }}
                >
                  <h4>{work.title}</h4>
                  <p className="status">
                    {work.status === 'ongoing' ? '🔄 Đang tiến hành' : work.status === 'completed' ? '✅ Hoàn thành' : '⏸️ Tạm dừng'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {selectedWork && (
        <div className="modal-overlay" onClick={() => setSelectedWork(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedWork(null)}>✕</button>
            <h2>{selectedWork.title}</h2>
            <div className="modal-body">
              <p><strong>👤 Tác Giả:</strong> {selectedAuthor?.name || 'N/A'}</p>
              <p><strong>📚 Thể Loại:</strong> {selectedWork.genres?.name || 'N/A'}</p>
              <p><strong>Trạng Thái:</strong> {selectedWork.status === 'ongoing' ? '🔄 Đang tiến hành' : selectedWork.status === 'completed' ? '✅ Hoàn thành' : '⏸️ Tạm dừng'}</p>

              {selectedWork.translator_name && (
                <p><strong>✏️ Dịch Giả:</strong> {selectedWork.translator_name}</p>
              )}

              <div className="modal-summary">
                <strong>Tóm Tắt:</strong>
                <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {selectedWork.summary || 'Không có tóm tắt'}
                </p>
              </div>

              {selectedWork.background && (
                <div className="modal-background">
                  <strong>Bối Cảnh:</strong>
                  <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {selectedWork.background}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

