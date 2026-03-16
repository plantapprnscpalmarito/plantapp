'use client'

import React from 'react'
import MobileLayout from '@/components/mobile/MobileLayout'
import { ApplicationForm } from '@/components/mobile/ApplicationForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ApplicationsPage() {
  return (
    <MobileLayout title="Aplicaciones">
      <div className="mb-4">
        <Link href="/field/hub" className="text-slate-400 flex items-center text-xs font-bold uppercase tracking-widest">
           <ArrowLeft size={16} className="mr-1" /> Volver al Hub
        </Link>
      </div>
      <ApplicationForm />
    </MobileLayout>
  )
}
