declare module "@next/mdx" {
  type CreateMDX = (options?: Record<string, unknown>) => <T>(nextConfig: T) => T;
  const createMDX: CreateMDX;
  export default createMDX;
}
