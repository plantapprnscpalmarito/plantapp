import { TreeRecordForm } from '@/components/mobile/TreeRecordForm'
import { 
  Wifi, 
  WifiOff, 
  CloudSync, 
  History, 
  ArrowLeft,
  Bird,
  NotebookTabs,
  MapPin
} from 'lucide-react'
import Link from 'next/link'

export default function FieldPage() {
  const isOnline = true 

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:hidden animate-in fade-in duration-700">
      {/* Mobile Header */}
      <header className="bg-slate-900 text-white p-5 sticky top-0 z-50 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 -ml-2 text-slate-400">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="text-center">
            <h1 className="text-sm font-black tracking-[0.3em] text-emerald-400 leading-tight">PLANTAPP</h1>
            <p className="text-[8px] uppercase tracking-[0.4em] text-slate-500 font-bold">Field Engine v2</p>
          </div>
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-rose-500" />
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-8">
        {/* Quick Hub Grid */}
        <div className="grid grid-cols-2 gap-4">
           <Link href="/field/hub" className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center group active:scale-95 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3 group-hover:bg-emerald-500 transition-colors">
                 <CloudSync className="h-6 w-6 text-emerald-600 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Registrar</span>
           </Link>
           <Link href="/field/map" className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center group active:scale-95 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-500 transition-colors">
                 <MapPin className="h-6 w-6 text-blue-600 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Mapa</span>
           </Link>
        </div>

        {/* Sync Status Info */}
        <div className="bg-slate-900 p-6 rounded-[2.5rem] flex items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="font-black text-white text-xs uppercase tracking-widest mb-1">Sincronización</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase">3 Registros Pendientes</p>
          </div>
          <button className="relative z-10 bg-emerald-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest active:bg-emerald-600 transition-all shadow-lg shadow-emerald-900/40">
            Sync Now
          </button>
          <div className="absolute -right-4 -top-4 opacity-10">
             <CloudSync size={80} className="text-emerald-400" />
          </div>
        </div>

        {/* Current Module (Default: Tree Form) */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <History className="mr-2 h-4 w-4" />
                Colección Activa
              </h4>
           </div>
           <TreeRecordForm />
        </div>

        {/* Minimal History List */}
        <div className="space-y-3 pb-24">
          {[
            { tag: '#042', species: 'Saladillo', time: '10:45 AM', synced: true },
            { tag: '#043', species: 'Alcornoque', time: '11:12 AM', synced: false },
          ].map((item, i) => (
            <div key={i} className="bg-white px-6 py-4 rounded-[1.8rem] border border-slate-100 flex items-center justify-between shadow-sm active:bg-slate-50 transition-colors">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-4 ${item.synced ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.species} <span className="text-slate-300 font-bold ml-1">{item.tag}</span></p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{item.time}</p>
                </div>
              </div>
              <ArrowLeft className="h-4 w-4 text-slate-200 rotate-180" />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-8 left-6 right-6 h-20 bg-white/80 backdrop-blur-2xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] flex items-center justify-around px-8 z-[100]">
        <Link href="/field">
          <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-100">
            <NotebookTabs className="h-6 w-6 text-white" />
          </div>
        </Link>
        <Link href="/field/map">
          <MapPin className="h-6 w-6 text-slate-400 hover:text-emerald-500 transition-colors" />
        </Link>
        <button>
          <History className="h-6 w-6 text-slate-400 hover:text-emerald-500 transition-colors" />
        </button>
      </div>
    </div>
  )
}

function PlusSquare({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
  )
}
