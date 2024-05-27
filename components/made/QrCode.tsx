'use client'

import React, { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import html2canvas from 'html2canvas'

type QRCodeDialogProps = {
  url: string
}

const QRCodeDialog: React.FC<QRCodeDialogProps> = ({ url }) => {
  const canvasRef = useRef<HTMLDivElement>(null)

  const downloadQRCode = async () => {
    const canvasElement = canvasRef.current
    if (!canvasElement) return

    try {
      const canvas = await html2canvas(canvasElement, {
        backgroundColor: 'rgba(0,0,0,0)',
        removeContainer: true,
        useCORS: true,
      })

      const pngUrl = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = 'qrcode.png'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    } catch (error) {
      console.error('Failed to capture and download QR code:', error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-full' variant='outline'>
          Get QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <div
          ref={canvasRef}
          className='flex h-full w-full items-center justify-center gap-4 py-4'
        >
          <div className='pt-4'>
            <QRCodeCanvas
              value={url}
              size={350}
              level={'H'}
              includeMargin={true}
            />
          </div>
        </div>
        <DialogFooter>
          <Button className='flex-1' variant='outline' onClick={downloadQRCode}>
            Download as Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default QRCodeDialog
