'use client'

import React from 'react'
import MobileLayout from '@/components/mobile/MobileLayout'
import { TreeRecordForm } from '@/components/mobile/TreeRecordForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TreePage() {
  return (
    <MobileLayout title="Registro de Árbol">
      <div className="mb-4">
        <Link href="/field/hub" className="text-slate-400 flex items-center text-xs font-bold uppercase tracking-widest">
           <ArrowLeft size={16} className="mr-1" /> Volver al Hub
        </Link>
      </div>
      <TreeRecordForm />
    </MobileLayout>
  )
}
