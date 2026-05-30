import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// use unpkg CDN worker to ensure the exact matching version is always available
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer: React.FC<{ url: string; title?: string; className?: string }> = ({ url, title = 'PDF viewer', className }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.0);

  if (!url) return null;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPage(1);
  };

  return (
    <div className={`rounded-[1.5rem] overflow-hidden border border-[var(--border)] bg-[var(--card)] ${className || ''}`}>
      <div className="flex items-center justify-between gap-2 p-3 border-b border-[var(--border)] bg-[var(--background)]">
        <div className="text-sm font-bold">{title}</div>
        <div className="flex items-center gap-2">
          <a href={url} target="_blank" rel="noreferrer" className="rounded-full px-3 py-1 text-xs font-bold border border-[var(--border)] bg-[var(--background)]">Open</a>
          <a href={url} download className="rounded-full px-3 py-1 text-xs font-bold border border-[var(--border)] bg-[var(--background)]">Download</a>
          <div className="inline-flex items-center gap-2">
            <button onClick={() => setScale((s) => Math.max(0.5, s - 0.25))} className="rounded-full px-3 py-1 text-xs font-bold border border-[var(--border)] bg-[var(--background)]">-</button>
            <div className="text-xs">{Math.round(scale * 100)}%</div>
            <button onClick={() => setScale((s) => Math.min(2, s + 0.25))} className="rounded-full px-3 py-1 text-xs font-bold border border-[var(--border)] bg-[var(--background)]">+</button>
          </div>
        </div>
      </div>

      <div className="w-full bg-black/5 p-4 flex flex-col items-center overflow-y-auto" style={{ minHeight: 300, maxHeight: 450 }}>
        <Document file={url} onLoadSuccess={onDocumentLoadSuccess} loading={<div className="text-sm text-[var(--muted-foreground)]">Loading PDF…</div>}>
          <Page pageNumber={page} scale={scale} renderAnnotationLayer={false} renderTextLayer={true} />
        </Document>

        <div className="mt-3 flex items-center gap-3">
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-full px-3 py-1 text-xs font-bold border border-[var(--border)] bg-[var(--background)]">Prev</button>
          <div className="text-sm">Page {page}{numPages ? ` / ${numPages}` : ''}</div>
          <button disabled={numPages ? page >= numPages : false} onClick={() => setPage((p) => (numPages ? Math.min(numPages, p + 1) : p + 1))} className="rounded-full px-3 py-1 text-xs font-bold border border-[var(--border)] bg-[var(--background)]">Next</button>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
