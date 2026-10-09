// Preserve language boundaries in prose that mixes English with Tibetan.
export default function ScriptText({ children }) {
  if (typeof children !== 'string') return children;
  return children.split(/([\u0f00-\u0fff]+)/u).map((text,i) => /[\u0f00-\u0fff]/u.test(text) ? <span className="ti" lang="bo" key={i}>{text}</span> : text);
}
