// @ts-nocheck

interface HtmlBlockProps {
  html: string;
}

export function HtmlBlock({ html }: HtmlBlockProps) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
