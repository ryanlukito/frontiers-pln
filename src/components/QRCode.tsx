"use client"

import React from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { QRCodeProps } from '@/types/utils'

const QRCode: React.FC<QRCodeProps> = ({id}) => {

  const url = `${window.location.origin}/InspectionHistoryPage/${id}`;
  return (
    <div className='flex flex-col items-center gap-4'>
        <QRCodeCanvas value={url} size={200}/>
        {/* <p className='text-sm text-gray-600'>{url}</p> */}
    </div>
  )
}

export default QRCode