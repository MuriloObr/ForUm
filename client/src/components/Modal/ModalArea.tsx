import { forwardRef, useRef, useState } from 'react'
import { AddModalProps } from '@mytypes/typesComponents'
import { markdownPurifiedStr } from '../../utils/MDpurifiedHelper'
import { highlight } from '../../utils/highlighter'

export const ModalArea = forwardRef<HTMLTextAreaElement, AddModalProps['area']>(
  function Area({ label, withMD }, ref) {
    const [viewClasses, setViewClasses] = useState({
      editor: 'block',
      preview: 'hidden',
    })
    const [previewHtml, setPreviewHtml] = useState(
      'Escreva seu texto para ver a preview aqui, se precisar saber sobre markdown entre [aqui](https://github.com/luong-komorebi/Markdown-Tutorial)',
    )
    const previewDivRef = useRef<HTMLDivElement>(null)

    async function renderPreview() {
      const purifiedHtml = await markdownPurifiedStr(previewHtml)
      setPreviewHtml(purifiedHtml)
    }

    return (
      <label className="flex flex-col text-black text-2xl">
        {label}↴
        <textarea
          ref={ref}
          rows={10}
          onChange={(ev) => {
            if (!withMD) return
            setPreviewHtml(ev.target.value)
          }}
          className={`w-full px-2 bg-transparent border-b-2 border-black text-2xl leading-8 font-normal outline-none ${viewClasses.editor}`}
        />
        {withMD ? (
          <>
            <pre className="font-[inherit]">
              <div
                ref={previewDivRef}
                className={`markdown ${viewClasses.preview}`}
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </pre>
            <div className="text-lg rounded bg-slate-800/60 text-white w-fit p-2 flex gap-2 font-bold mt-2">
              <button
                onClick={(ev) => {
                  renderPreview()
                  highlight()
                  if (viewClasses.preview === 'hidden') {
                    setViewClasses({ editor: 'hidden', preview: 'block' })
                    ev.currentTarget.textContent = 'View'
                  } else {
                    setViewClasses({ editor: 'block', preview: 'hidden' })
                    ev.currentTarget.textContent = 'Raw'
                  }
                }}
              >
                Raw
              </button>
            </div>
          </>
        ) : (
          ''
        )}
      </label>
    )
  },
)
