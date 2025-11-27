import Head from 'next/head'
import React, { useCallback, useMemo, useState } from 'react'

type Q = {
  id: number
  text: string
  options: string[]
  answer: number
}

const QUESTIONS: Q[] = [
  { id: 1, text: 'Which animal says "Meow"?', options: ['Dog', 'Cat', 'Cow'], answer: 1 },
  { id: 2, text: 'What color is the sky on a clear day?', options: ['Green', 'Blue', 'Yellow'], answer: 1 },
  { id: 3, text: 'Which fruit is yellow?', options: ['Apple', 'Banana', 'Grapes'], answer: 1 },
]

export default function Home() {
  const total = QUESTIONS.length
  const [index, setIndex] = useState<number>(0)
  const [selected, setSelected] = useState<Array<number | null>>(() => Array(total).fill(null))
  const [submitted, setSubmitted] = useState(false)

  const q = QUESTIONS[index]

  const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: '', visible: false })

  const showToast = useCallback((msg: string) => {
    setToast({ msg, visible: true })
    window.clearTimeout((showToast as any)._t)
    ;(showToast as any)._t = window.setTimeout(() => setToast({ msg: '', visible: false }), 3000)
  }, [])

  const select = useCallback((opt: number) => {
    setSelected(prev => {
      const copy = prev.slice()
      copy[index] = opt
      return copy
    })
  }, [index])

  const next = useCallback(() => {
    // prevent moving forward if current question not answered
    if (selected[index] === null) {
      showToast('Please select an option before continuing')
      return
    }
    setIndex(i => Math.min(i + 1, total - 1))
  }, [index, selected, total, showToast])
  const prev = useCallback(() => setIndex(i => Math.max(i - 1, 0)), [])

  const submit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault()
    if (selected.some(v => v === null)) {
      showToast('Please answer all questions before submitting')
      return
    }
    setSubmitted(true)
  }, [selected, showToast])

  const restart = useCallback(() => {
    setIndex(0)
    setSelected(() => Array(total).fill(null))
    setSubmitted(false)
  }, [total])

  const correctCount = useMemo(() => selected.reduce<number>((acc, val, i) => (val === QUESTIONS[i].answer ? acc + 1 : acc), 0), [selected])
  const percent = useMemo(() => Math.round((correctCount / total) * 100), [correctCount, total])

  const completedCount = selected.filter(v => v !== null).length

  return (
    <>
      <Head>
        <title>Quick Quiz</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex items-center justify-center japan-bg relative">
        <div className="hinomaru" aria-hidden />
        <svg className="sakura" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <g opacity="0.9">
            <path d="M10 30c8-8 20-10 28-4 8 6 12 18 4 26-8 8-20 10-28 4-8-6-12-18-4-26z" fill="#ffd7dd" />
            <path d="M60 18c6-6 16-8 22-3 6 5 9 14 3 20-6 6-16 8-22 3-6-5-9-14-3-20z" fill="#ffeef0" />
            <path d="M120 10c5-5 12-6 17-2 5 4 8 11 2 15-6 5-12 6-17 2-5-4-8-11-2-15z" fill="#ffd7dd" />
          </g>
        </svg>

        <main className="w-full max-w-2xl p-6 z-10">
          {/* Decorative SVG overlay: subtle lines, circles and shapes for visual interest */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 800 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
              <linearGradient id="gA" x1="0" x2="1">
                <stop offset="0%" stopColor="#ffb4b4" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#ffd7dd" stopOpacity="0.04" />
              </linearGradient>
              <linearGradient id="gB" x1="0" x2="1">
                <stop offset="0%" stopColor="#2b2e4a" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#2b2e4a" stopOpacity="0" />
              </linearGradient>
            </defs>

            <circle cx="80" cy="500" r="120" fill="url(#gA)" />
            <rect x="560" y="40" width="160" height="160" rx="18" fill="none" stroke="#2b2e4a" strokeWidth="1" opacity="0.06" transform="rotate(12 640 120)" />
            <path d="M0,200 C120,140 220,260 360,220 C520,172 620,300 800,240" stroke="url(#gB)" strokeWidth="1.4" fill="none" opacity="0.06" />
            <g transform="translate(600,420) rotate(-18)">
              <ellipse cx="0" cy="0" rx="42" ry="22" fill="#ffeef0" opacity="0.7" />
            </g>
          </svg>
          {!submitted ? (
            <form onSubmit={submit} className="device-frame p-6 rounded-xl">
              <div className="inner-panel relative">
                {/* decorative orb */}
                <div className="absolute -left-12 -top-12 w-28 h-28 bg-gradient-to-br from-red-100 to-transparent rounded-full opacity-30 pointer-events-none transform rotate-12" />
                {/* thin decorative vertical accent */}
                <div className="absolute left-0 top-8 h-3/4 w-0.5 bg-gradient-to-b from-red-300 to-transparent opacity-60 rounded-r" />
                <h1 className="display-heading text-3xl mb-4">Quick Quiz</h1>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-700">Question {index + 1} of {total}</div>
                  <div className="text-sm text-gray-500">Answered: {completedCount}/{total}</div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div className="h-2 bg-red-600 rounded-full" style={{ width: `${Math.round((completedCount/total)*100)}%` }} />
                </div>

                <div className="mb-6">
                  <div className="text-lg font-semibold mb-3">{index + 1}. {q.text}</div>
                  <div className="grid gap-3">
                    {q.options.map((opt, i) => {
                      const isSel = selected[index] === i
                      return (
                        <button
                          type="button"
                          key={i}
                          onClick={() => select(i)}
                          className={`option-tile w-full text-left px-4 py-3 rounded-md transition transform duration-150 ${isSel ? 'border-2 border-red-500 bg-red-50 shadow-lg scale-105' : 'border hover:shadow-md'}`}
                        >
                          <div className="flex items-center">
                            <div className={`w-4 h-4 mr-3 rounded-full ${isSel ? 'bg-red-500' : 'bg-gray-300'}`} />
                            <div>{opt}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div>
                    <button type="button" onClick={prev} className="btn-ghost px-4 py-2 mr-2"> 
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path d="M15 18l-6-6 6-6" stroke="#2b2e4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Previous
                    </button>
                    <button type="button" onClick={next} className="btn-ghost px-4 py-2">Next
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path d="M9 18l6-6-6-6" stroke="#2b2e4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    {index === total - 1 ? (
                      <button type="submit" className="btn-primary" aria-label="Submit quiz">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <path d="M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Submit</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="device-frame p-6 rounded-xl">
              <div className="inner-panel text-center">
                <h2 className="display-heading text-2xl mb-4">Results</h2>
                <div className="text-6xl font-extrabold text-red-600 mb-2">{percent}%</div>
                <div className="text-sm text-gray-600 mb-6">You got {correctCount} out of {total} correct</div>
                <button onClick={restart} className="btn-primary" aria-label="Try again">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M21 12a9 9 0 1 1-3.16-6.36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 3v6h-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Toast popup for errors */}
      <div aria-live="polite">
        <div className={`fixed right-6 bottom-6 z-50 transition-transform ${toast.visible ? 'translate-y-0' : 'translate-y-6'} `}>
          <div className="bg-red-600 text-white px-4 py-2 rounded shadow">{toast.msg}</div>
        </div>
      </div>
    </>
  )
}
