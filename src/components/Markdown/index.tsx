import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface MarkdownRendererProps {
  children: string;
}

export function Markdown({ children }: MarkdownRendererProps) {
  const fixedMarkdown = children
    .replace(/\\\[(.*?)\\\]/gs, "$$$1$$") // display math
    .replace(/\\\((.*?)\\\)/gs, "$$$1$"); // inline math

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeKatex]}
      components={{
        pre: ({ node, ...props }) => (
          <pre {...props} className="whitespace-pre-wrap break-words" />
        ),
        code: ({ node, ...props }) => (
          <code {...props} className="whitespace-pre-wrap break-words" />
        ),
      }}
    >
      {fixedMarkdown}
    </ReactMarkdown>
  );
}
