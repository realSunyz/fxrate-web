declare module "*.mdx" {
  import type { ComponentType, ReactNode } from "react";

  const MDXComponent: ComponentType<{ children?: ReactNode }>;
  export default MDXComponent;
}
