import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import '../styles/SearchTab.css'

export default function SearchTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('title')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [availableTags, setAvailableTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [genreFilter, setGenreFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [availableGenres, setAvailableGenres] = useState([])

  // Fetch available tags and genres on mount
  useEffect(() => {
    const fetchTagsAndGenres = async () => {
      try {
        // Fetch unique tags
        const { data: tagsData, error: tagsError } = await supabase
          .from('work_tags')
          .select('tag_name')
          .order('tag_name')

        if (!tagsError && tagsData) {
          const uniqueTags = [...new Set(tagsData.map(t => t.tag_name))]
          setAvailableTags(uniqueTags)
        }

        // Fetch genres
        const { data: genresData, error: genresError } = await supabase
          .from('genres')
          .select('name')
          .order('name')

        if (!genresError && genresData) {
          setAvailableGenres(genresData.map(g => g.name))
        }
      } catch (err) {
        console.error('Error fetching tags and genres:', err)
      }
    }

    fetchTagsAndGenres()
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim() && selectedTags.length === 0 && !genreFilter && !statusFilter) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      let query = supabase.from('works').select('*, authors(name), genres(name), work_tags(tag_name)')

      // Apply search query
      if (searchQuery.trim()) {
        if (searchType === 'title') {
          query = query.ilike('title', `%${searchQuery}%`)
        } else if (searchType === 'author') {
          query = query.ilike('authors.name', `%${searchQuery}%`)
        }
      }

      // Apply genre filter
      if (genreFilter) {
        query = query.eq('genres.name', genreFilter)
      }

      // Apply status filter
      if (statusFilter) {
        query = query.eq('status', statusFilter)
      }

      let { data, error: err } = await query

      if (err) throw err

      // Apply tag filters (client-side filtering)
      if (selectedTags.length > 0 && data) {
        data = data.filter(work => {
          const workTags = work.work_tags?.map(t => t.tag_name) || []
          return selectedTags.some(tag => workTags.includes(tag))
        })
      }

      setResults(data || [])
    } catch (err) {
      setError('Lỗi tìm kiếm: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
    setGenreFilter('')
    setStatusFilter('')
    setResults([])
  }

  return (
    <div className="search-tab">
      <div className="search-header">
        <h2>🔍 Tìm Kiếm Truyện</h2>
        <button
          className="advanced-toggle-btn"
          onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
        >
          {showAdvancedSearch ? '▼ Ẩn Tìm Kiếm Nâng Cao' : '▶ Tìm Kiếm Nâng Cao'}
        </button>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-controls">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-type-select"
          >
            <option value="title">Tên Tác Phẩm</option>
            <option value="author">Tác Giả</option>
          </select>

          <input
            type="text"
            placeholder={`Tìm kiếm theo ${searchType === 'title' ? 'tên tác phẩm' : 'tác giả'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />

          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Đang tìm...' : 'Tìm Kiếm'}
          </button>
        </div>
      </form>

      {showAdvancedSearch && (
        <div className="advanced-search">
          <div className="filter-section">
            <h3>Lọc Theo Thẻ</h3>
            <div className="tags-container">
              {availableTags.length === 0 ? (
                <p className="no-tags">Không có thẻ nào</p>
              ) : (
                availableTags.map(tag => (
                  <button
                    key={tag}
                    className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => toggleTag(tag)}
                    type="button"
                  >
                    {tag}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="filter-section">
            <h3>Lọc Theo Thể Loại</h3>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="genre-select"
            >
              <option value="">Tất cả thể loại</option>
              {availableGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h3>Lọc Theo Trạng Thái</h3>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-select"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ongoing">Đang tiến hành</option>
              <option value="completed">Hoàn thành</option>
              <option value="hiatus">Tạm dừng</option>
            </select>
          </div>

          <div className="filter-actions">
            <button
              type="button"
              onClick={() => handleSearch({ preventDefault: () => {} })}
              className="apply-filters-btn"
              disabled={loading}
            >
              {loading ? 'Đang tìm...' : 'Áp Dụng Bộ Lọc'}
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="clear-filters-btn"
            >
              Xóa Bộ Lọc
            </button>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="search-results">
        {results.length === 0 && !loading && (searchQuery || selectedTags.length > 0 || genreFilter || statusFilter) && (
          <p className="no-results">Không tìm thấy kết quả</p>
        )}

        {results.length > 0 && (
          <p className="results-count">Tìm thấy {results.length} kết quả</p>
        )}

        {results.map((work) => (
          <div key={work.id} className="work-card">
            <h3>{work.title}</h3>
            <p className="author">Tác Giả: {work.authors?.name || 'N/A'}</p>
            <p className="genre">Thể Loại: {work.genres?.name || 'N/A'}</p>
            {work.work_tags && work.work_tags.length > 0 && (
              <div className="tags">
                {work.work_tags.map((tag, idx) => (
                  <span key={idx} className="tag">{tag.tag_name}</span>
                ))}
              </div>
            )}
            <p className="summary">{work.summary}</p>
            <p className="status">Trạng Thái: {work.status === 'ongoing' ? 'Đang tiến hành' : work.status === 'completed' ? 'Hoàn thành' : 'Tạm dừng'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

