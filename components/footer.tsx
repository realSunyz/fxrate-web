export function Footer() {
  return (
    <footer className="flex w-full mt-6 mb-10 px-4">
      <div className="container mx-auto text-center text-sm text-gray-500">
        <div>fxRate Web (build {process.env.COMMIT_ID})</div>
        <div>Copyright © 2025 Yanzheng Sun. All rights reserved.</div>
        <div>汇率牌价仅供参考，数据刷新可能有延迟。</div>
      </div>
    </footer>
  );
}
