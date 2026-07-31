import DOMPurify from 'dompurify'
import { marked } from 'marked'

export const markdownPurifiedStr = async (str: string) => {
  const markdownStr = await marked.parse(str ?? '')
  console.log('making markdown')
  return DOMPurify.sanitize(markdownStr)
}
