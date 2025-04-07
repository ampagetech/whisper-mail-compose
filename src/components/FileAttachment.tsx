
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileAttachmentProps {
  file: File;
  onRemove: () => void;
  className?: string;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({ file, onRemove, className }) => {
  // Format file size to be human-readable
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-2 rounded-md bg-secondary text-sm mb-2 group",
      className
    )}>
      <div className="flex items-center overflow-hidden">
        <span className="truncate max-w-[200px]">{file.name}</span>
        <span className="ml-2 text-muted-foreground text-xs">
          ({formatFileSize(file.size)})
        </span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="ml-2 p-1 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
        aria-label="Remove file"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default FileAttachment;
