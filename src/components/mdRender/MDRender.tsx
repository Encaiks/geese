import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark, vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import clsxm from '@/lib/clsxm';

type MDRenderProps = {
  mdString?: any; // markdown 格式的字符串
} & React.ComponentPropsWithoutRef<'div'>;

export default function MDRender({
  className,
  mdString,
  children,
  ...rest
}: MDRenderProps) {
  return (
    <div className={clsxm('', className)} {...rest}>
      <ReactMarkdown components={Code}>{mdString || children}</ReactMarkdown>
    </div>
  );
}

const Code = {
  code({ node: _node, codeStyle, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '') || 'shell';
    children = String(children).replace(/\n$/, '');
    if (codeStyle != 'dark') {
      return !inline && match ? (
        <SyntaxHighlighter
          style={vs}
          language={match[1]}
          PreTag='div'
          {...props}
        >
          {children}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props} />
      );
    } else {
      return !inline && match ? (
        <SyntaxHighlighter
          style={dark}
          language={match[1]}
          PreTag='div'
          {...props}
        >
          {children}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props} />
      );
    }
  },
};
