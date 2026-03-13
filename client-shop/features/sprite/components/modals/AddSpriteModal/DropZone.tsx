"use client";

import { useRef } from "react";

interface DropZoneProps {
  onFiles: (files: File[]) => void
}

export function DropZone({ onFiles }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    onFiles(Array.from(files).filter(f => f.type.startsWith('image/')))
  }

  return (
    <div
      onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
      onDragOver={e => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      className='mx-6 mt-5 border-2 border-dashed border-neutral-700 hover:border-green-400/50 rounded-xl py-8 flex flex-col items-center gap-2 cursor-pointer transition-colors duration-200 group'
    >
      <p className='text-neutral-400 text-sm group-hover:text-neutral-200 transition-colors'>
        Drop relics here or{' '}
        <span className='text-green-400 underline'>summon from device</span>
      </p>
      <p className='text-neutral-600 text-xs'>PNG, JPG, WEBP, GIF</p>
      <input
        ref={inputRef}
        type='file'
        multiple
        accept='image/*'
        className='hidden'
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  )
}