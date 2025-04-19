export function PdfStatusBar({
  currentPage,
  totalPages,
  zoom,
}: {
  currentPage: number
  totalPages: number
  zoom: number
}) {
  return (
    <div className="bg-gray-100 border-t px-4 py-1 text-sm text-gray-500 flex items-center justify-between">
      <div>
        Page {currentPage} of {totalPages}
      </div>
      <div>Zoom: {zoom}%</div>
    </div>
  )
}
