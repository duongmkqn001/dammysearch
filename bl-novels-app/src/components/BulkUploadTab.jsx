import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import '../styles/BulkUploadTab.css'

export default function BulkUploadTab() {
  const { currentUser } = useAuth()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState(null)
  const [authors, setAuthors] = useState([])
  const [genres, setGenres] = useState([])

  useEffect(() => {
    fetchAuthorsAndGenres()
  }, [])

  const fetchAuthorsAndGenres = async () => {
    try {
      const [authorsData, genresData] = await Promise.all([
        supabase.from('authors').select('id, name'),
        supabase.from('genres').select('id, name')
      ])

      setAuthors(authorsData.data || [])
      setGenres(genresData.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const generateCSVTemplate = () => {
    const headers = [
      'title',
      'author_name',
      'main_genre_name',
      'summary',
      'cover_image_url',
      'chapter_count',
      'story_status',
      'translator_name',
      'translation_platform',
      'translation_url',
      'tags'
    ]

    const exampleRow = [
      'Tên Truyện Mẫu',
      'Tên Tác Giả',
      'Đam Mỹ',
      'Tóm tắt nội dung truyện...',
      'https://example.com/cover.jpg',
      '45',
      'ongoing',
      'Tên Người Dịch',
      'wattpad',
      'https://wattpad.com/story/...',
      'Tag1, Tag2, Tag3'
    ]

    const csvContent = [
      headers.join(','),
      exampleRow.map(cell => `"${cell}"`).join(',')
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'bulk_upload_template.csv'
    link.click()
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      setResults(null)
    } else {
      alert('Vui lòng chọn file CSV')
      e.target.value = ''
    }
  }

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    
    const rows = []
    for (let i = 1; i < lines.length; i++) {
      const values = []
      let currentValue = ''
      let insideQuotes = false
      
      for (let char of lines[i]) {
        if (char === '"') {
          insideQuotes = !insideQuotes
        } else if (char === ',' && !insideQuotes) {
          values.push(currentValue.trim())
          currentValue = ''
        } else {
          currentValue += char
        }
      }
      values.push(currentValue.trim())
      
      const row = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      rows.push(row)
    }
    
    return rows
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Vui lòng chọn file CSV')
      return
    }

    try {
      setUploading(true)
      setProgress(0)
      setResults({ success: [], errors: [] })

      const text = await file.text()
      const rows = parseCSV(text)

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        
        try {
          // Find or create author
          let authorId = null
          if (row.author_name) {
            let author = authors.find(a => a.name.toLowerCase() === row.author_name.toLowerCase())
            
            if (!author) {
              const { data, error } = await supabase
                .from('authors')
                .insert([{ name: row.author_name }])
                .select()
                .single()
              
              if (error) throw error
              author = data
              setAuthors(prev => [...prev, author])
            }
            
            authorId = author.id
          }

          // Find genre
          let genreId = null
          if (row.main_genre_name) {
            const genre = genres.find(g => g.name.toLowerCase() === row.main_genre_name.toLowerCase())
            if (genre) {
              genreId = genre.id
            }
          }

          // Insert work
          const workData = {
            title: row.title,
            author_id: authorId,
            main_genre_id: genreId,
            summary: row.summary || null,
            cover_image_url: row.cover_image_url || null,
            chapter_count: row.chapter_count ? parseInt(row.chapter_count) : null,
            story_status: row.story_status || 'ongoing',
            translator_name: row.translator_name || null,
            translation_platform: row.translation_platform || null,
            translation_url: row.translation_url || null,
            status: 'active'
          }

          const { data: work, error: workError } = await supabase
            .from('works')
            .insert([workData])
            .select()
            .single()

          if (workError) throw workError

          // Insert tags if provided
          if (row.tags && work) {
            const tagNames = row.tags.split(',').map(t => t.trim()).filter(t => t)
            
            for (const tagName of tagNames) {
              await supabase
                .from('work_tags')
                .insert([{
                  work_id: work.id,
                  tag_name: tagName
                }])
            }
          }

          setResults(prev => ({
            ...prev,
            success: [...prev.success, { row: i + 1, title: row.title }]
          }))
        } catch (error) {
          console.error(`Error processing row ${i + 1}:`, error)
          setResults(prev => ({
            ...prev,
            errors: [...prev.errors, { row: i + 1, title: row.title, error: error.message }]
          }))
        }

        setProgress(Math.round(((i + 1) / rows.length) * 100))
      }
    } catch (error) {
      console.error('Error uploading:', error)
      alert('Có lỗi xảy ra khi tải lên: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bulk-upload-tab">
      <div className="upload-header">
        <h2>📤 Tải Lên Hàng Loạt</h2>
        <button onClick={generateCSVTemplate} className="btn-download-template">
          📥 Tải Template CSV
        </button>
      </div>

      <div className="upload-instructions">
        <h3>📋 Hướng Dẫn:</h3>
        <ol>
          <li>Tải xuống file template CSV bằng nút bên trên</li>
          <li>Mở file bằng Excel hoặc Google Sheets</li>
          <li>Điền thông tin truyện vào các cột (xóa dòng mẫu)</li>
          <li>Lưu file dưới định dạng CSV (UTF-8)</li>
          <li>Chọn file và nhấn "Tải Lên"</li>
        </ol>

        <div className="field-info">
          <h4>Thông tin các trường:</h4>
          <ul>
            <li><strong>title:</strong> Tên truyện (bắt buộc)</li>
            <li><strong>author_name:</strong> Tên tác giả</li>
            <li><strong>main_genre_name:</strong> Thể loại chính (ví dụ: Đam Mỹ, Ngôn Tình)</li>
            <li><strong>summary:</strong> Tóm tắt nội dung</li>
            <li><strong>cover_image_url:</strong> Link ảnh bìa</li>
            <li><strong>chapter_count:</strong> Số chương (số nguyên)</li>
            <li><strong>story_status:</strong> Trạng thái (ongoing/completed/paused)</li>
            <li><strong>translator_name:</strong> Tên người dịch</li>
            <li><strong>translation_platform:</strong> Nền tảng (wattpad/wordpress/ao3/other)</li>
            <li><strong>translation_url:</strong> Link đọc truyện</li>
            <li><strong>tags:</strong> Các tag, phân cách bằng dấu phẩy</li>
          </ul>
        </div>
      </div>

      <div className="upload-section">
        <div className="file-input-wrapper">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={uploading}
            id="csv-file-input"
          />
          <label htmlFor="csv-file-input" className="file-input-label">
            {file ? `📄 ${file.name}` : '📁 Chọn File CSV'}
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn-upload"
        >
          {uploading ? `⏳ Đang tải lên... ${progress}%` : '🚀 Tải Lên'}
        </button>
      </div>

      {uploading && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {results && (
        <div className="upload-results">
          <h3>📊 Kết Quả Tải Lên</h3>
          
          <div className="results-summary">
            <div className="summary-card success">
              <div className="summary-number">{results.success.length}</div>
              <div className="summary-label">Thành công</div>
            </div>
            <div className="summary-card error">
              <div className="summary-number">{results.errors.length}</div>
              <div className="summary-label">Lỗi</div>
            </div>
          </div>

          {results.errors.length > 0 && (
            <div className="errors-list">
              <h4>❌ Các dòng bị lỗi:</h4>
              <table>
                <thead>
                  <tr>
                    <th>Dòng</th>
                    <th>Tên Truyện</th>
                    <th>Lỗi</th>
                  </tr>
                </thead>
                <tbody>
                  {results.errors.map((err, idx) => (
                    <tr key={idx}>
                      <td>{err.row}</td>
                      <td>{err.title}</td>
                      <td>{err.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

