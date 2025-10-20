import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import '../styles/ReviewReportsTab.css'

export default function ReviewReportsTab() {
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
        .from('review_reports')
        .select(`
          *,
          user_reviews(id, review_text, username, work_id, works(title)),
          user_accounts!review_reports_reporter_id_fkey(username, email)
        `)
        .order('created_at', { ascending: false})

      if (error) throw error
      setReports(data || [])
    } catch (error) {
      console.error('Error fetching review reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const getReasonLabel = (reason) => {
    const labels = {
      'spam': 'Spam',
      'offensive': 'Ngôn từ xúc phạm',
      'inappropriate': 'Nội dung không phù hợp',
      'other': 'Khác'
    }
    return labels[reason] || reason
  }

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'Chờ xử lý',
      'resolved': 'Đã giải quyết',
      'rejected': 'Từ chối'
    }
    return labels[status] || status
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#FFB3D9',
      'resolved': '#C8E6C9',
      'rejected': '#FFCCBB'
    }
    return colors[status] || '#E0E0E0'
  }

  const handleUpdateStatus = async (reportId, newStatus, hideReview = false) => {
    try {
      setUpdating(true)
      
      // Update report status
      const { error: reportError } = await supabase
        .from('review_reports')
        .update({
          status: newStatus,
          admin_notes: adminNotes || null,
          resolved_by: currentUser?.id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', reportId)

      if (reportError) throw reportError

      // If hiding review, update review status
      if (hideReview && selectedReport?.user_reviews) {
        const { error: reviewError } = await supabase
          .from('user_reviews')
          .update({ status: 'hidden' })
          .eq('id', selectedReport.user_reviews.id)

        if (reviewError) throw reviewError
      }

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
    <div className="review-reports-tab">
      <div className="reports-header">
        <h2>🚩 Báo Cáo Đánh Giá Vi Phạm</h2>
        <div className="filter-controls">
          <label>Lọc theo trạng thái:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
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
                <th>Người đánh giá</th>
                <th>Lý do</th>
                <th>Người báo cáo</th>
                <th>Trạng thái</th>
                <th>Ngày báo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <strong>{report.user_reviews?.works?.title || 'N/A'}</strong>
                  </td>
                  <td>{report.user_reviews?.username || 'N/A'}</td>
                  <td>{getReasonLabel(report.reason)}</td>
                  <td>{report.user_accounts?.username || 'N/A'}</td>
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
                <p><strong>{selectedReport.user_reviews?.works?.title}</strong></p>
              </div>

              <div className="detail-group">
                <label>Nội dung đánh giá bị báo cáo:</label>
                <div className="review-preview">
                  <p><strong>Người đánh giá:</strong> {selectedReport.user_reviews?.username}</p>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', marginTop: '10px' }}>
                    {selectedReport.user_reviews?.review_text}
                  </p>
                </div>
              </div>

              <div className="detail-group">
                <label>Lý do báo cáo:</label>
                <p>{getReasonLabel(selectedReport.reason)}</p>
              </div>

              {selectedReport.description && (
                <div className="detail-group">
                  <label>Mô tả chi tiết:</label>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {selectedReport.description}
                  </p>
                </div>
              )}

              <div className="detail-group">
                <label>Người báo cáo:</label>
                <p>
                  {selectedReport.user_accounts?.username}
                  {selectedReport.user_accounts?.email && (
                    <span style={{ fontSize: '0.9em', color: '#666' }}>
                      {' '}({selectedReport.user_accounts.email})
                    </span>
                  )}
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
                  onClick={() => handleUpdateStatus(selectedReport.id, 'resolved', true)}
                  className="btn-hide-review"
                  disabled={updating}
                >
                  🚫 Ẩn Đánh Giá
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedReport.id, 'resolved', false)}
                  className="btn-resolve"
                  disabled={updating}
                >
                  ✅ Giải Quyết
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedReport.id, 'rejected', false)}
                  className="btn-reject"
                  disabled={updating}
                >
                  ❌ Từ Chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

