import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { Cloud, X } from 'lucide-react'
import { cn } from '~/lib/utils/utils'
import { Button } from './button/button'

interface ImageUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  onImageUpload?: (file: File) => void
  maxSize?: number // in bytes
  className?: string
}

export function ImageUploader({
  onImageUpload,
  maxSize = 5 * 1024 * 1024, // 5MB default
  className,
  ...props
}: ImageUploaderProps) {
  const [preview, setPreview] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const error = rejectedFiles[0].errors[0]
        if (error.code === 'file-too-large') {
          setError(`File is too large. Max size is ${maxSize / (1024 * 1024)}MB`)
        } else if (error.code === 'file-invalid-type') {
          setError('Please upload an image file (SVG, PNG, JPG or GIF)')
        } else {
          setError('Error uploading file')
        }
        return
      }

      // Handle accepted files
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setError(null)

        // Create preview using FileReader
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Call the callback if provided
        if (onImageUpload) {
          onImageUpload(file)
        }
      }
    },
    [maxSize, onImageUpload],
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/svg+xml': ['.svg'],
    },
    maxSize,
    multiple: false,
    noClick: true, // Disable click on the root element
  })

  // Clear preview and error
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    setError(null)
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          'border-gray-300 relative cursor-default rounded-lg border-2 border-dashed transition-colors',
          isDragActive && 'border-primary bg-muted/50',
          error && 'border-red-500',
          className,
        )}
        {...props}
      >
        <input {...getInputProps()} />

        <div className="flex min-h-[160px] items-center justify-center p-4 sm:min-h-[200px]">
          {preview ? (
            <div className="relative aspect-video w-full max-w-[400px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview || '/placeholder.svg'}
                alt="Preview"
                className="h-full w-full rounded-lg object-contain"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full bg-muted p-4">
                <Cloud className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-base">
                <Button variant="link" className="h-auto p-0 text-primary" onClick={open}>
                  Click to upload
                </Button>
                {' or drag and drop'}
              </div>
              <p className="text-sm text-muted-foreground">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
