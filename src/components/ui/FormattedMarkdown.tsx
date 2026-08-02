import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

export function FormattedMarkdown({ content, className }: FormattedMarkdownProps) {
  if (!content) return null;

  return (
    <div className={cn("markdown-content space-y-4 text-foreground/90 leading-relaxed", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children, ...props }) => (
            <div className="my-6 w-full overflow-x-auto rounded-xl border border-border/80 bg-card shadow-xs">
              <table className="w-full text-left text-sm border-collapse min-w-[480px]" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead
              className="bg-muted/80 text-foreground font-semibold border-b border-border/80"
              {...props}
            >
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="divide-y divide-border/40 bg-card" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr
              className="transition-colors hover:bg-muted/40 odd:bg-card even:bg-muted/20"
              {...props}
            >
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th
              className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground border-r last:border-r-0 border-border/40"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="px-4 py-3 text-sm text-foreground/90 border-r last:border-r-0 border-border/40 leading-normal"
              {...props}
            >
              {children}
            </td>
          ),
          h1: ({ children, ...props }) => (
            <h1
              className="text-2xl font-bold font-display text-foreground tracking-tight mt-6 mb-3 border-b border-border/40 pb-2"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="text-xl font-semibold font-display text-foreground tracking-tight mt-5 mb-2.5"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-lg font-medium font-display text-foreground mt-4 mb-2" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="text-base font-medium text-foreground mt-3 mb-1.5" {...props}>
              {children}
            </h4>
          ),
          ul: ({ children, ...props }) => (
            <ul className="my-3 ml-6 list-disc space-y-1.5 text-foreground/90" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="my-3 ml-6 list-decimal space-y-1.5 text-foreground/90" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="pl-1 leading-relaxed" {...props}>
              {children}
            </li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="my-4 border-l-4 border-primary/70 bg-primary-soft/20 px-4 py-3 rounded-r-lg italic text-foreground/80"
              {...props}
            >
              {children}
            </blockquote>
          ),
          code: ({ inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="my-4 overflow-x-auto rounded-xl border border-border/80 bg-muted/60 p-4 font-mono text-xs text-foreground">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          hr: (props) => <hr className="my-6 border-border/60" {...props} />,
          p: ({ children, ...props }) => (
            <p className="my-2.5 leading-relaxed text-foreground/90" {...props}>
              {children}
            </p>
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-foreground" {...props}>
              {children}
            </strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
