import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import '../styles/ErrorReportsTab.css'

export default function ErrorReportsTab() {
  const { currentUser } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [selectedReport, setSelectedReport] = useState(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('error_reports')
        .select(`
          *,
          works(id, title, authors(name)),
          user_accounts(username, email)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReports(data || [])
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const getReportTypeLabel = (type) => {
    const labels = {
      'incorrect_info': '❌ Thông tin không chính xác',
      'missing_info': '📝 Thiếu thông tin',
      'broken_link': '🔗 Link bị hỏng',
      'other': '📋 Khác'
    }
    return labels[type] || type
  }

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Chờ xử lý',
      'in_progress': 'Đang xử lý',
      'resolved': 'Đã giải quyết',
      'rejected': 'Từ chối'
    }
    return labels[status] || status
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#FFB3D9',
      'in_progress': '#B3E5FC',
      'resolved': '#C8E6C9',
      'rejected': '#FFCCBB'
    }
    return colors[status] || '#E0E0E0'
  }

  const handleUpdateStatus = async (reportId, newStatus) => {
    try {
      setUpdating(true)
      const updateData = {
        status: newStatus,
        admin_notes: adminNotes || null,
        resolved_by: currentUser?.id,
        resolved_at: newStatus === 'resolved' || newStatus === 'rejected' ? new Date().toISOString() : null
      }

      const { error } = await supabase
        .from('error_reports')
        .update(updateData)
        .eq('id', reportId)

      if (error) throw error

      await fetchReports()
      setSelectedReport(null)
      setAdminNotes('')
    } catch (error) {
      console.error('Error updating report:', error)
      alert('Có lỗi xảy ra khi cập nhật báo cáo')
    } finally {
      setUpdating(false)
    }
  }

  const filteredReports = statusFilter === 'all' 
    ? reports 
    : reports.filter(r => r.status === statusFilter)

  if (loading) {
    return <div className="loading">Đang tải báo cáo...</div>
  }

  return (
    <div className="error-reports-tab">
      <div className="reports-header">
        <h2>🚨 Báo Cáo Lỗi Thông Tin</h2>
        <div className="filter-controls">
          <label>Lọc theo trạng thái:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
            <option value="in_progress">Đang xử lý</option>
            <option value="resolved">Đã giải quyết</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>
      </div>

      <div className="reports-stats">
        <div className="stat-card">
          <div className="stat-number">{reports.filter(r => r.status === 'pending').length}</div>
          <div className="stat-label">Chờ xử lý</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reports.filter(r => r.status === 'in_progress').length}</div>
          <div className="stat-label">Đang xử lý</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reports.filter(r => r.status === 'resolved').length}</div>
          <div className="stat-label">Đã giải quyết</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reports.length}</div>
          <div className="stat-label">Tổng số</div>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="no-reports">
          <p>📭 Không có báo cáo nào</p>
        </div>
      ) : (
        <div className="reports-table">
          <table>
            <thead>
              <tr>
                <th>Truyện</th>
                <th>Loại lỗi</th>
                <th>Người báo</th>
                <th>Trạng thái</th>
                <th>Ngày báo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <strong>{report.works?.title || 'N/A'}</strong>
                    <br />
                    <small style={{ color: '#666' }}>
                      {report.works?.authors?.name || 'N/A'}
                    </small>
                  </td>
                  <td>{getReportTypeLabel(report.report_type)}</td>
                  <td>
                    {report.user_accounts?.username || report.reporter_name || 'Ẩn danh'}
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(report.status) }}
                    >
                      {getStatusLabel(report.status)}
                    </span>
                  </td>
                  <td>{new Date(report.created_at).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedReport(report)
                        setAdminNotes(report.admin_notes || '')
                      }}
                      className="action-btn"
                    >
                      Chi Tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedReport(null)}>✕</button>
            
            <h2>Chi Tiết Báo Cáo</h2>

            <div className="report-details">
              <div className="detail-group">
                <label>Truyện:</label>
                <p><strong>{selectedReport.works?.title}</strong></p>
                <p style={{ fontSize: '0.9em', color: '#666' }}>
                  Tác giả: {selectedReport.works?.authors?.name}
                </p>
              </div>

              <div className="detail-group">
                <label>Loại lỗi:</label>
                <p>{getReportTypeLabel(selectedReport.report_type)}</p>
              </div>

              {selectedReport.field_name && (
                <div className="detail-group">
                  <label>Trường thông tin:</label>
                  <p>{selectedReport.field_name}</p>
                </div>
              )}

              <div className="detail-group">
                <label>Mô tả chi tiết:</label>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {selectedReport.description}
                </p>
              </div>

              <div className="detail-group">
                <label>Người báo:</label>
                <p>
                  {selectedReport.user_accounts?.username || selectedReport.reporter_name || 'Ẩn danh'}
                  {selectedReport.user_accounts?.email && (
                    <span style={{ fontSize: '0.9em', color: '#666' }}>
                      {' '}({selectedReport.user_accounts.email})
                    </span>
                  )}
                </p>
              </div>

              <div className="detail-group">
                <label>Trạng thái hiện tại:</label>
                <p>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedReport.status) }}
                  >
                    {getStatusLabel(selectedReport.status)}
                  </span>
                </p>
              </div>

              <div className="detail-group">
                <label>Ghi chú của Admin:</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Nhập ghi chú về cách xử lý báo cáo này..."
                  rows="4"
                />
              </div>

              <div className="action-buttons">
                <button
                  onClick={() => handleUpdateStatus(selectedReport.id, 'in_progress')}
                  className="btn-progress"
                  disabled={updating || selectedReport.status === 'in_progress'}
                >
                  🔄 Đang xử lý
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                  className="btn-resolve"
                  disabled={updating || selectedReport.status === 'resolved'}
                >
                  ✅ Đã giải quyết
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedReport.id, 'rejected')}
                  className="btn-reject"
                  disabled={updating || selectedReport.status === 'rejected'}
                >
                  ❌ Từ chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

