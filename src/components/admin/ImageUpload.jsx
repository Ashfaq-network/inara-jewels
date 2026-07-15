import { useState, useRef } from 'react'
import { supabase } from '@lib/supabase'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'

export default function ImageUpload({ bucket = 'products', onUpload, multiple = false, existingImages = [] }) {
  const [uploading, setUploading] = useState(false)
  const [previews, setPreviews] = useState(existingImages || [])
  const fileRef = useRef()

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setUploading(true)
    const uploaded = []

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const filePath = `${fileName}`

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true })

      if (!error) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
        uploaded.push(data.publicUrl)
      }
    }

    const allImages = [...previews, ...uploaded]
    setPreviews(allImages)
    onUpload(allImages)
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeImage = (index) => {
    const updated = previews.filter((_, i) => i !== index)
    setPreviews(updated)
    onUpload(updated)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rosegold-50 border border-rosegold-200 text-rosegold-600 rounded-xl text-sm font-medium hover:bg-rosegold-100 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        {multiple && (
          <span className="text-xs text-gray-400">You can select multiple images</span>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleUpload}
        className="hidden"
      />

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previews.map((url, i) => (
            <div key={i} className="relative group">
              <img
                src={url}
                alt={`Upload ${i + 1}`}
                className="w-20 h-20 rounded-xl object-cover border border-rosegold-200"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
