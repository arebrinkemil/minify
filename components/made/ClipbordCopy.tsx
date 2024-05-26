'use client'

import { FC, useState } from 'react'
import { Button } from '../ui/button'
import { Check, Copy } from 'lucide-react'

type ClipbordCopyProps = {
  url: string
}

const ClipbordCopy: FC<ClipbordCopyProps> = ({ url }) => {
  const [isCopy, setIsCopy] = useState(false)

  const copyLink = () => {
    setIsCopy(true)

    navigator.clipboard.writeText(url)

    setTimeout(() => setIsCopy(false), 2000)
  }

  return (
    <div className='flex items-center justify-between gap-4 rounded-md bg-accent p-2'>
      <p className='overflow-hidden text-ellipsis text-nowrap'>{url}</p>
      <Button onClick={copyLink}>
        {!isCopy ? <Copy size={20} /> : <Check size={20} />}
      </Button>
    </div>
  )
}

export default ClipbordCopy
