import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import '../styles/ReportButton.css'

export default function ReportButton({ work }) {
  const { currentUser, isLoggedIn } = useAuth()
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportData, setReportData] = useState({
    report_type: 'incorrect_info',
    field_name: '',
    description: '',
    reporter_name: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const reportTypes = [
    { value: 'incorrect_info', label: '❌ Thông tin không chính xác' },
    { value: 'missing_info', label: '📝 Thiếu thông tin' },
    { value: 'broken_link', label: '🔗 Link bị hỏng' },
    { value: 'other', label: '📋 Khác' }
  ]

  const fieldOptions = [
    { value: 'title', label: 'Tiêu đề' },
    { value: 'author', label: 'Tác giả' },
    { value: 'genre', label: 'Thể loại' },
    { value: 'summary', label: 'Tóm tắt' },
    { value: 'background', label: 'Bối cảnh' },
    { value: 'tags', label: 'Thẻ' },
    { value: 'chapter_count', label: 'Số chương' },
    { value: 'translator', label: 'Dịch giả' },
    { value: 'translation_link', label: 'Link dịch' },
    { value: 'other', label: 'Khác' }
  ]

  const handleOpenModal = () => {
    setShowReportModal(true)
    setSubmitSuccess(false)
    setSubmitError('')
    setReportData({
      report_type: 'incorrect_info',
      field_name: '',
      description: '',
      reporter_name: currentUser?.username || ''
    })
  }

  const handleCloseModal = () => {
    setShowReportModal(false)
    setReportData({
      report_type: 'incorrect_info',
      field_name: '',
      description: '',
      reporter_name: ''
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!reportData.description.trim()) {
      setSubmitError('Vui lòng mô tả chi tiết lỗi')
      return
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      const { error } = await supabase
        .from('error_reports')
        .insert([{
          work_id: work.id,
          user_account_id: currentUser?.id || null,
          reporter_name: reportData.reporter_name || 'Ẩn danh',
          report_type: reportData.report_type,
          field_name: reportData.field_name || null,
          description: reportData.description,
          status: 'pending'
        }])

      if (error) throw error

      setSubmitSuccess(true)
      setTimeout(() => {
        handleCloseModal()
      }, 2000)
    } catch (error) {
      console.error('Error submitting report:', error)
      setSubmitError('Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button className="report-button" onClick={handleOpenModal} title="Báo lỗi thông tin">
        🚨 Báo Lỗi
      </button>

      {showReportModal && (
        <div className="report-modal-overlay" onClick={handleCloseModal}>
          <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="report-modal-close" onClick={handleCloseModal}>✕</button>
            
            <h2>🚨 Báo Lỗi Thông Tin</h2>
            <p className="report-modal-subtitle">Truyện: <strong>{work.title}</strong></p>

            {submitSuccess ? (
              <div className="report-success-message">
                <div className="success-icon">✅</div>
                <h3>Gửi báo cáo thành công!</h3>
                <p>Cảm ơn bạn đã giúp chúng tôi cải thiện thông tin. Admin sẽ xem xét báo cáo của bạn sớm nhất.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="report-form">
                <div className="form-group">
                  <label>Loại lỗi: <span className="required">*</span></label>
                  <select
                    value={reportData.report_type}
                    onChange={(e) => setReportData({ ...reportData, report_type: e.target.value })}
                    required
                  >
                    {reportTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Trường thông tin có lỗi:</label>
                  <select
                    value={reportData.field_name}
                    onChange={(e) => setReportData({ ...reportData, field_name: e.target.value })}
                  >
                    <option value="">-- Chọn trường (tùy chọn) --</option>
                    {fieldOptions.map(field => (
                      <option key={field.value} value={field.value}>{field.label}</option>
                    ))}
                  </select>
                </div>

                {!isLoggedIn && (
                  <div className="form-group">
                    <label>Tên của bạn (tùy chọn):</label>
                    <input
                      type="text"
                      value={reportData.reporter_name}
                      onChange={(e) => setReportData({ ...reportData, reporter_name: e.target.value })}
                      placeholder="Để trống nếu muốn ẩn danh"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Mô tả chi tiết lỗi: <span className="required">*</span></label>
                  <textarea
                    value={reportData.description}
                    onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                    placeholder="Vui lòng mô tả chi tiết lỗi bạn phát hiện. Ví dụ: Tên tác giả sai, link dịch không hoạt động, thiếu thông tin về số chương..."
                    rows="5"
                    required
                  />
                </div>

                {submitError && (
                  <div className="error-message">{submitError}</div>
                )}

                <div className="form-actions">
                  <button type="button" onClick={handleCloseModal} className="btn-cancel">
                    Hủy
                  </button>
                  <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? 'Đang gửi...' : 'Gửi Báo Cáo'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

