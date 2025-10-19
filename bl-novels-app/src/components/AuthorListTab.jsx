import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import '../styles/AuthorListTab.css'

export default function AuthorListTab() {
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [authorWorks, setAuthorWorks] = useState([])

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
                <div key={work.id} className="work-item">
                  <h4>{work.title}</h4>
                  <p className="summary">{work.summary}</p>
                  <p className="status">Trạng Thái: {work.status}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

