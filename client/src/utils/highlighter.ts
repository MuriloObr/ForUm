import hljs from 'highlight.js'

export function highlight(container?: HTMLElement) {
  const scope = container ?? document
  scope.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block as HTMLElement)
  })
}
