import { useState } from 'react'
import { createSubject } from '../api/courses'

export default function AdminSubjectForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    shortName: '',
    description: '',
    category: '',
  })
  const [videos, setVideos] = useState([{ title: '', youtubeId: '', duration: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFieldChange = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  const handleVideoChange = (index, key, value) => {
    const newVideos = [...videos]
    newVideos[index][key] = value
    setVideos(newVideos)
  }

  const addVideoField = () => setVideos([...videos, { title: '', youtubeId: '', duration: '' }])

  const removeVideoField = (index) => {
    if (videos.length === 1) return
    const newVideos = [...videos]
    newVideos.splice(index, 1)
    setVideos(newVideos)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name || !form.shortName || !form.description || !form.category) {
      setError('Please fill in all subject details.')
      return
    }

    // Clean up empty video entries and parse duration
    const processedVideos = videos
      .filter(v => v.title && v.youtubeId)
      .map(v => ({
        ...v,
        duration: parseInt(v.duration, 10) || 10
      }))

    setLoading(true)
    try {
      await createSubject({
        ...form,
        videos: processedVideos
      })
      
      setSuccess('Subject successfully created!')
      setForm({ name: '', shortName: '', description: '', category: '' })
      setVideos([{ title: '', youtubeId: '', duration: '' }])
      
      if (onSuccess) onSuccess()
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subject.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card mb-8 shadow-sm">
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="text-xl font-bold text-text">Add New Subject</h2>
        <p className="text-sm text-text2">Create a new course and add YouTube video modules.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="form-group">
            <label className="label">Course Name</label>
            <input className="input" placeholder="e.g. Advanced Mathematics" value={form.name} onChange={handleFieldChange('name')} required />
          </div>
          <div className="form-group">
            <label className="label">Short Name / Abbreviation</label>
            <input className="input" placeholder="e.g. Adv Math" value={form.shortName} onChange={handleFieldChange('shortName')} required />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="form-group">
            <label className="label">Category</label>
            <input className="input" placeholder="e.g. STEM, Programming" value={form.category} onChange={handleFieldChange('category')} required />
          </div>
          <div className="form-group">
            <label className="label">Description</label>
            <textarea className="input min-h-[42px] py-2" placeholder="Brief course description" value={form.description} onChange={handleFieldChange('description')} required />
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-border2 bg-bg3/50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-text">Course Videos (YouTube)</h3>
            <button type="button" onClick={addVideoField} className="btn bg-white text-xs text-text border border-border shadow-sm hover:border-accent">
              + Add Video
            </button>
          </div>

          <div className="space-y-4">
            {videos.map((vid, idx) => (
              <div key={idx} className="flex flex-col gap-3 rounded-lg border border-border bg-white p-4 shadow-sm sm:flex-row sm:items-start relative group">
                {videos.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeVideoField(idx)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm transition hover:bg-red-500 hover:text-white"
                    title="Remove Video"
                  >
                    ×
                  </button>
                )}
                
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="flex-1">
                      <label className="mb-1 block text-[11px] font-semibold uppercase text-text3">Video Title</label>
                      <input className="input py-2 text-sm" placeholder="e.g. Introduction to Algebra" value={vid.title} onChange={(e) => handleVideoChange(idx, 'title', e.target.value)} />
                    </div>
                    <div className="sm:w-1/3">
                      <label className="mb-1 block text-[11px] font-semibold uppercase text-text3">YouTube Video ID</label>
                      <input className="input py-2 text-sm font-mono text-accent" placeholder="e.g. dQw4w9WgXcQ" value={vid.youtubeId} onChange={(e) => handleVideoChange(idx, 'youtubeId', e.target.value)} />
                    </div>
                    <div className="w-24">
                      <label className="mb-1 block text-[11px] font-semibold uppercase text-text3">Mins</label>
                      <input className="input py-2 text-sm" type="number" placeholder="45" value={vid.duration} onChange={(e) => handleVideoChange(idx, 'duration', e.target.value)} />
                    </div>
                  </div>
                  <div className="text-[11px] text-text3 flex items-center gap-1.5">
                    <span className="inline-block h-3 w-3 rounded-full bg-blue-100 text-center leading-3 text-blue-600">i</span>
                    The Video ID is the 11-character code after "v=" in the YouTube URL (e.g. youtube.com/watch?v=<strong className="text-text2">ID_HERE</strong>)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="btn btn-primary px-8 shadow-md" disabled={loading}>
            {loading ? 'Publishing Course...' : 'Publish Course'}
          </button>
        </div>
      </form>
    </div>
  )
}
