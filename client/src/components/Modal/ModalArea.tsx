import { forwardRef, useEffect, useRef, useState } from 'react'
import { AddModalProps } from '@mytypes/typesComponents'
import { markdownPurifiedStr } from '../../utils/MDpurifiedHelper'
import { highlight } from '../../utils/highlighter'

const PREVIEW_HINT =
  'Escreva seu texto para ver a preview aqui, se precisar saber sobre markdown entre [aqui](https://github.com/luong-komorebi/Markdown-Tutorial)'

export const ModalArea = forwardRef<HTMLTextAreaElement, AddModalProps['area']>(
  function Area({ label, withMD, onChange }, ref) {
    const [view, setView] = useState<'raw' | 'preview'>('raw')
    const [markdown, setMarkdown] = useState('')
    const [previewHtml, setPreviewHtml] = useState(PREVIEW_HINT)
    const previewDivRef = useRef<HTMLDivElement>(null)
    const isPreview = view === 'preview'

    useEffect(() => {
      if (isPreview && previewDivRef.current) highlight(previewDivRef.current)
    }, [isPreview, previewHtml])

    async function switchToPreview() {
      const source = markdown.trim()
      const html = source ? await markdownPurifiedStr(source) : PREVIEW_HINT
      setPreviewHtml(html)
      setView('preview')
    }

    function switchToRaw() {
      setView('raw')
    }

    return (
      <div className="flex flex-col gap-2 text-black text-2xl">
        <label className="flex flex-col">
          {label}↴
          <textarea
            ref={ref}
            rows={10}
            onChange={(ev) => {
              onChange?.(ev.target.value)
              setMarkdown(ev.target.value)
            }}
            className={`w-full px-2 bg-transparent border-b-2 border-black text-2xl leading-8 font-normal outline-none focus:border-blue-700 transition-colors duration-150 ${isPreview ? 'hidden' : 'block'}`}
          />
        </label>
        {withMD ? (
          <>
            <div
              ref={previewDivRef}
              className={`markdown whitespace-normal break-words ${isPreview ? 'block' : 'hidden'}`}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
            <div className="relative grid w-fit grid-cols-2 rounded-md bg-zinc-200/80 p-1 text-sm font-medium">
              <span
                aria-hidden
                className="pointer-events-none absolute left-1 top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-md bg-white transition-transform duration-200 ease-out"
                style={{
                  transform: isPreview ? 'translateX(100%)' : 'translateX(0)',
                }}
              />
              <button
                type="button"
                aria-pressed={!isPreview}
                onClick={switchToRaw}
                className={`relative z-10 rounded-md px-4 py-1.5 transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 ${
                  isPreview
                    ? 'text-zinc-500 hover:text-zinc-700'
                    : 'text-blue-700'
                }`}
              >
                Raw
              </button>
              <button
                type="button"
                aria-pressed={isPreview}
                onClick={switchToPreview}
                className={`relative z-10 rounded-md px-4 py-1.5 transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 ${
                  isPreview
                    ? 'text-blue-700'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                Preview
              </button>
            </div>
          </>
        ) : (
          ''
        )}
      </div>
    )
  },
)
