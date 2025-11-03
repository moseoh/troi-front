export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-6">
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm text-gray-600">
            마지막 업데이트: {new Date().toLocaleTimeString('ko-KR')}
          </div>
        </div>
      </div>
    </header>
  );
}
