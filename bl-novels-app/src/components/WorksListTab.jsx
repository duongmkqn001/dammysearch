import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import '../styles/WorksListTab.css'

export default function WorksListTab() {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('title')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchWorks()
  }, [sortBy, filterStatus])

  const fetchWorks = async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('works')
        .select('*, authors(name), genres(name)')

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
            <div key={work.id} className="work-card">
              <h3>{work.title}</h3>
              <p className="author">👤 {work.authors?.name || 'N/A'}</p>
              <p className="genre">📚 {work.genres?.name || 'N/A'}</p>
              <p className="summary">{work.summary}</p>
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
    </div>
  )
}

