import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createSubject } from '../api/courses'

const CATEGORIES = ['CS Core', 'GATE Prep', 'Programming']

export default function AdminAddSubject() {
  const navigate = useNavigate()

  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])
  const [form, setForm] = useState({
    name: '',
    shortName: '',
    description: '',
    category: CATEGORIES[0],
  })
  const [videos, setVideos] = useState([{ title: '', youtubeId: '', duration: '' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFieldChange = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  const handleVideoChange = (index, key, value) => {
    setVideos(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [key]: value }
      return next
    })
  }

  const addVideoField = (e) => {
    e.preventDefault()
    setVideos(prev => [...prev, { title: '', youtubeId: '', duration: '' }])
  }

  const removeVideoField = (index) => {
    if (videos.length === 1) return
    const newVideos = [...videos]
    newVideos.splice(index, 1)
    setVideos(newVideos)
  }

  const handleTabClick = (cat) => {
    setActiveCategory(cat)
    setForm(p => ({ ...p, category: cat }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name || !form.shortName || !form.description || !form.category) {
      setError('Please fill in all subject details.')
      return
    }

    const processedVideos = videos
      .filter(v => v.title && v.youtubeId)
      .map(v => ({
        ...v,
        duration: parseInt(v.duration, 10) || 10
      }))

    if (processedVideos.length === 0) {
      setError('Please add at least one valid video to the playlist.')
      return
    }

    setLoading(true)
    try {
      await createSubject({ ...form, videos: processedVideos })
      setSuccess(`${form.name} successfully created!`)
      setTimeout(() => navigate('/educator/subjects'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create subject.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page theme-auth border-t border-border bg-bg">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/educator/subjects" className="text-text3 hover:text-accent flex items-center gap-2 font-medium w-fit transition-colors bg-bg2 px-4 py-2 rounded-full border border-border shadow-sm text-sm mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Manage Subjects
          </Link>
          <h1 className="page-title text-2xl font-extrabold font-heading text-text">Add New Subject</h1>
          <p className="text-sm text-text2 mt-1">Select a category, fill in the details, and add the YouTube playlist.</p>
        </div>

        <div className="card max-w-4xl mx-auto shadow-sm">
          {/* Categories Tabs */}
          <div className="mb-8 overflow-hidden rounded-xl border border-border bg-bg2 flex flex-col sm:flex-row">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => handleTabClick(cat)}
                className={`flex-1 py-3.5 px-2 text-sm font-bold text-center transition-colors border-r last:border-r-0 border-border ${activeCategory === cat ? 'bg-accent text-white' : 'text-text2 hover:bg-bg3 hover:text-text'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="form-group">
                <label className="label">Subject Name</label>
                <input className="input" placeholder="e.g. Advanced Operating Systems" value={form.name} onChange={handleFieldChange('name')} required />
              </div>
              <div className="form-group">
                <label className="label">Short Name / Abbreviation</label>
                <input className="input" placeholder="e.g. Adv OS" value={form.shortName} onChange={handleFieldChange('shortName')} required />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="form-group">
                <label className="label">Selected Category</label>
                <div className="input bg-bg2 text-text2 flex items-center border border-border opacity-70 pointer-events-none select-none">{activeCategory}</div>
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea className="input min-h-[42px] py-2" placeholder="Brief subject description" value={form.description} onChange={handleFieldChange('description')} required />
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-border bg-bg3/50 p-5">
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-bold text-text">Subject Playlist (YouTube Videos)</h3>
                <button type="button" onClick={addVideoField} className="btn bg-bg2 text-xs font-bold uppercase tracking-wider text-text border border-border shadow-sm hover:border-accent hover:text-accent transition-colors">
                  + Add Video Row
                </button>
              </div>

              <div className="space-y-4">
                {videos.map((vid, idx) => (
                  <div key={idx} className="flex flex-col gap-3 rounded-lg border border-border bg-bg2 p-4 shadow-sm sm:flex-row sm:items-start relative group transition-colors">
                    {videos.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeVideoField(idx)}
                        className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 border border-red-100 dark:border-red-800/50 shadow-sm transition hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remove Video"
                      >
                        ×
                      </button>
                    )}
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex-1">
                          <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-text3">Video Title</label>
                          <input className="input py-2 text-[13px] font-medium" placeholder="e.g. Introduction to Process Schedulers" value={vid.title} onChange={(e) => handleVideoChange(idx, 'title', e.target.value)} required />
                        </div>
                        <div className="sm:w-1/3">
                          <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-text3">YouTube ID</label>
                          <input className="input py-2 text-[13px] font-mono text-accent" placeholder="e.g. dQw4w9WgXcQ" value={vid.youtubeId} onChange={(e) => handleVideoChange(idx, 'youtubeId', e.target.value)} required />
                        </div>
                        <div className="w-24">
                          <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-text3">Minutes</label>
                          <input className="input py-2 text-[13px]" type="number" placeholder="45" value={vid.duration} onChange={(e) => handleVideoChange(idx, 'duration', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Link to="/educator/subjects" className="btn bg-bg2 text-text2 hover:text-red-500 px-4 py-2 shadow-sm border border-border text-xs uppercase font-bold tracking-wider rounded-lg transition-colors">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary px-8 shadow-md text-sm font-bold uppercase tracking-widest" disabled={loading}>
                {loading ? 'Saving...' : `Publish to ${form.category || 'Category'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
