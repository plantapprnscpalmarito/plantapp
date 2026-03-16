'use client'

import React from 'react'
import MobileLayout from '@/components/mobile/MobileLayout'
import { ActivityForm } from '@/components/mobile/ActivityForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ActivitiesPage() {
  return (
    <MobileLayout title="Actividades">
      <div className="mb-4">
        <Link href="/field/hub" className="text-slate-400 flex items-center text-xs font-bold uppercase tracking-widest">
           <ArrowLeft size={16} className="mr-1" /> Volver al Hub
        </Link>
      </div>
      <ActivityForm />
    </MobileLayout>
  )
}
