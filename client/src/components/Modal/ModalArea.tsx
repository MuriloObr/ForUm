import { forwardRef, useEffect, useRef, useState } from 'react'
import { AddModalProps } from '@mytypes/typesComponents'
import { markdownPurifiedStr } from '../../utils/MDpurifiedHelper'
import { highlight } from '../../utils/highlighter'

export const ModalArea = forwardRef<HTMLTextAreaElement, AddModalProps['area']>(
  function Area({ label, withMD }, ref) {
    const [mdView, setMdView] = useState({ raw: 'block', view: 'hidden' })
    const [MDstr, setMDstr] = useState(
      'Escreva seu texto para ver a preview aqui, se precisar saber sobre markdown entre [aqui](https://github.com/luong-komorebi/Markdown-Tutorial)',
    )
    const previewDivRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      console.log('effect')
    }, [MDstr])

    async function markedParse() {
      const finalStr = await markdownPurifiedStr(MDstr)
      setMDstr(finalStr)
    }

    return (
      <label className="flex flex-col text-black text-2xl">
        {label}↴
        <textarea
          ref={ref}
          rows={10}
          onChange={(ev) => {
            if (!withMD) return
            setMDstr(ev.target.value)
          }}
          className={`w-full px-2 bg-transparent border-b-2 border-black text-2xl leading-8 font-normal outline-none ${mdView.raw}`}
        />
        {withMD ? (
          <>
            <pre className="font-[inherit]">
              <div
                ref={previewDivRef}
                className={`markdown ${mdView.view}`}
                dangerouslySetInnerHTML={{ __html: MDstr }}
              />
            </pre>
            <div className="text-lg rounded bg-slate-800/60 text-white w-fit p-2 flex gap-2 font-bold mt-2">
              <button
                onClick={(ev) => {
                  markedParse()
                  highlight()
                  if (mdView.view === 'hidden') {
                    setMdView({ raw: 'hidden', view: 'block' })
                    ev.currentTarget.textContent = 'View'
                  } else {
                    setMdView({ raw: 'block', view: 'hidden' })
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
