import React from 'react'

export default function Win({win, resetGame}) {

  if (!win) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
        <div className='bg-[#242424] px-28 py-16 rounded-2xl flex flex-col items-center gap-5'>
            <p className='text-xl font-semibold'>Congratulations! You won!</p>
            <button onClick={resetGame}>Play Again</button>
        </div>
    </div>
  )
}
