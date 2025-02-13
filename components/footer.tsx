export function Footer() {
  return (
    <footer className="flex w-full mt-6 mb-10 px-4">
      <div className="container mx-auto text-center text-sm text-gray-500">
        <div>fxRate Web (build {process.env.COMMIT_ID})</div>
        <div>
          外汇牌价仅供参考，不构成投资建议。
          <br />
          数据更新可能有延迟。
        </div>
      </div>
    </footer>
  );
}
