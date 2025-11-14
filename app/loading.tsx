export default function Loading() {
  return (
    <div className="page flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
        <p className="text-sm text-gray-600">加载中...</p>
      </div>
    </div>
  )
}
