import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import '../styles/WorksListTab.css'

export default function WorksListTab() {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('title')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedWork, setSelectedWork] = useState(null)

  useEffect(() => {
    fetchWorks()
  }, [sortBy, filterStatus])

  const fetchWorks = async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('works')
        .select('*, authors(name), genres(name), work_tags(tag_name)')

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }

      const orderColumn = sortBy === 'title' ? 'title' : 'created_at'
      const { data, error: err } = await query.order(orderColumn, { ascending: true })

      if (err) throw err
      setWorks(data || [])
    } catch (err) {
      setError('Lỗi tải danh sách tác phẩm: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Đang tải...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="works-list-tab">
      <div className="filters">
        <div className="filter-group">
          <label>Sắp xếp theo:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="title">Tên Tác Phẩm</option>
            <option value="date">Ngày Thêm</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Trạng Thái:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tất Cả</option>
            <option value="ongoing">Đang Cập Nhật</option>
            <option value="completed">Hoàn Thành</option>
            <option value="hiatus">Tạm Dừng</option>
          </select>
        </div>
      </div>

      <div className="works-grid">
        {works.length === 0 ? (
          <p className="no-works">Không có tác phẩm nào</p>
        ) : (
          works.map((work) => (
            <div
              key={work.id}
              className="work-card"
              onClick={() => setSelectedWork(work)}
              style={{ cursor: 'pointer' }}
            >
              <h3>{work.title}</h3>
              <p className="author">👤 {work.authors?.name || 'N/A'}</p>
              <p className="genre">📚 {work.genres?.name || 'N/A'}</p>
              <div className="work-footer">
                <span className={`status ${work.status}`}>
                  {work.status === 'ongoing' && '🔄 Đang Cập Nhật'}
                  {work.status === 'completed' && '✅ Hoàn Thành'}
                  {work.status === 'hiatus' && '⏸️ Tạm Dừng'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedWork && (
        <div className="modal-overlay" onClick={() => setSelectedWork(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setSelectedWork(null)}
            >
              ✕
            </button>
            <h2>{selectedWork.title}</h2>
            <div className="modal-body">
              <p><strong>👤 Tác Giả:</strong> {selectedWork.authors?.name || 'N/A'}</p>
              <p><strong>📚 Thể Loại:</strong> {selectedWork.genres?.name || 'N/A'}</p>
              <p><strong>📊 Trạng Thái:</strong> {selectedWork.status === 'ongoing' ? '🔄 Đang Cập Nhật' : selectedWork.status === 'completed' ? '✅ Hoàn Thành' : '⏸️ Tạm Dừng'}</p>
              {selectedWork.chapter_count > 0 && (
                <p><strong>📖 Số Chương:</strong> {selectedWork.chapter_count} chương</p>
              )}

              {selectedWork.work_tags && selectedWork.work_tags.length > 0 && (
                <div className="modal-tags">
                  <strong>🏷️ Thẻ:</strong>
                  <div className="tags">
                    {selectedWork.work_tags.map((tag, idx) => (
                      <span key={idx} className="tag">{tag.tag_name}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedWork.background && (
                <div className="modal-background">
                  <strong>📝 Bối Cảnh:</strong>
                  <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {selectedWork.background}
                  </p>
                </div>
              )}

              <div className="modal-summary">
                <strong>📄 Tóm Tắt:</strong>
                <p style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {selectedWork.summary || 'Không có tóm tắt'}
                </p>
              </div>

              {selectedWork.translator_name && (
                <p><strong>✏️ Dịch Giả:</strong> {selectedWork.translator_name}</p>
              )}

              {selectedWork.translation_platform && (
                <p>
                  <strong>
                    {selectedWork.translation_platform.toLowerCase().includes('wattpad') ? '📱' :
                     selectedWork.translation_platform.toLowerCase().includes('wordpress') ? '📝' :
                     selectedWork.translation_platform.toLowerCase().includes('web') ? '🌐' : '📖'}
                    {' '}Nền Tảng:
                  </strong> {selectedWork.translation_platform}
                </p>
              )}

              {selectedWork.translation_url && (
                <p>
                  <strong>🔗 Link Đọc Truyện:</strong>{' '}
                  <a
                    href={selectedWork.translation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="translation-link"
                  >
                    {selectedWork.translation_url}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

