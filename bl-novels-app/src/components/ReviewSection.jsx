import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import '../styles/ReviewSection.css'

export default function ReviewSection({ workId }) {
  const { currentUser, isLoggedIn } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)
  const [userReview, setUserReview] = useState(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportingReview, setReportingReview] = useState(null)
  const [reportReason, setReportReason] = useState('spam')
  const [reportDescription, setReportDescription] = useState('')

  useEffect(() => {
    if (workId) {
      fetchReviews()
    }
  }, [workId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('work_id', workId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error

      setReviews(data || [])

      // Check if current user has already reviewed
      if (isLoggedIn && currentUser) {
        const userReviewData = data?.find(r => r.user_account_id === currentUser.id)
        setUserReview(userReviewData || null)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để viết đánh giá')
      return
    }

    if (!reviewText.trim()) {
      alert('Vui lòng nhập nội dung đánh giá')
      return
    }

    try {
      setSubmitting(true)

      const { error } = await supabase
        .from('user_reviews')
        .insert([{
          work_id: workId,
          user_account_id: currentUser.id,
          username: currentUser.username,
          rating: rating,
          review_text: reviewText,
          status: 'active'
        }])

      if (error) throw error

      setReviewText('')
      setRating(5)
      setShowReviewForm(false)
      await fetchReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
      if (error.code === '23505') {
        alert('Bạn đã đánh giá truyện này rồi!')
      } else {
        alert('Có lỗi xảy ra khi gửi đánh giá')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleReaction = async (reviewId, reactionType) => {
    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để thích/không thích đánh giá')
      return
    }

    try {
      // Check if user already reacted
      const { data: existingReaction } = await supabase
        .from('review_reactions')
        .select('*')
        .eq('review_id', reviewId)
        .eq('user_account_id', currentUser.id)
        .single()

      if (existingReaction) {
        if (existingReaction.reaction_type === reactionType) {
          // Remove reaction if clicking the same button
          await supabase
            .from('review_reactions')
            .delete()
            .eq('id', existingReaction.id)
        } else {
          // Update reaction if clicking different button
          await supabase
            .from('review_reactions')
            .update({ reaction_type: reactionType })
            .eq('id', existingReaction.id)
        }
      } else {
        // Add new reaction
        await supabase
          .from('review_reactions')
          .insert([{
            review_id: reviewId,
            user_account_id: currentUser.id,
            reaction_type: reactionType
          }])
      }

      await fetchReviews()
    } catch (error) {
      console.error('Error handling reaction:', error)
    }
  }

  const handleReportReview = async (e) => {
    e.preventDefault()

    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để báo cáo đánh giá')
      return
    }

    try {
      const { error } = await supabase
        .from('review_reports')
        .insert([{
          review_id: reportingReview.id,
          reporter_id: currentUser.id,
          reason: reportReason,
          description: reportDescription,
          status: 'pending'
        }])

      if (error) throw error

      alert('Đã gửi báo cáo thành công. Admin sẽ xem xét sớm nhất.')
      setShowReportModal(false)
      setReportingReview(null)
      setReportReason('spam')
      setReportDescription('')
    } catch (error) {
      console.error('Error reporting review:', error)
      alert('Có lỗi xảy ra khi gửi báo cáo')
    }
  }

  return (
    <div className="review-section">
      <div className="review-header">
        <h3>💬 Đánh Giá ({reviews.length})</h3>
        {isLoggedIn && !userReview && (
          <button
            className="btn-write-review"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? '✕ Hủy' : '✍️ Viết Đánh Giá'}
          </button>
        )}
      </div>

      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="review-form">
          <div className="rating-input">
            <label>Đánh giá:</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`star ${star <= rating ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Chia sẻ suy nghĩ của bạn về truyện này..."
            rows="4"
            required
          />

          <button type="submit" className="btn-submit-review" disabled={submitting}>
            {submitting ? 'Đang gửi...' : 'Gửi Đánh Giá'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading">Đang tải đánh giá...</div>
      ) : reviews.length === 0 ? (
        <div className="no-reviews">
          <p>📭 Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header-info">
                <div className="reviewer-info">
                  <span className="reviewer-name">{review.username}</span>
                  {review.rating && (
                    <div className="review-rating">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  )}
                </div>
                <span className="review-date">
                  {new Date(review.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>

              <p className="review-text">{review.review_text}</p>

              <div className="review-actions">
                <button
                  className="btn-reaction"
                  onClick={() => handleReaction(review.id, 'like')}
                  title="Thích"
                >
                  👍 {review.likes_count || 0}
                </button>
                <button
                  className="btn-reaction"
                  onClick={() => handleReaction(review.id, 'dislike')}
                  title="Không thích"
                >
                  👎 {review.dislikes_count || 0}
                </button>
                {isLoggedIn && currentUser?.id !== review.user_account_id && (
                  <button
                    className="btn-report"
                    onClick={() => {
                      setReportingReview(review)
                      setShowReportModal(true)
                    }}
                    title="Báo cáo vi phạm"
                  >
                    🚩 Báo Cáo
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowReportModal(false)}>✕</button>
            
            <h3>🚩 Báo Cáo Đánh Giá</h3>
            
            <form onSubmit={handleReportReview} className="report-form">
              <div className="form-group">
                <label>Lý do báo cáo:</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                >
                  <option value="spam">Spam</option>
                  <option value="offensive">Ngôn từ xúc phạm</option>
                  <option value="inappropriate">Nội dung không phù hợp</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div className="form-group">
                <label>Mô tả chi tiết (tùy chọn):</label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Mô tả thêm về vi phạm..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowReportModal(false)} className="btn-cancel">
                  Hủy
                </button>
                <button type="submit" className="btn-submit">
                  Gửi Báo Cáo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

