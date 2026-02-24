import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  TrendingUp, 
  Shield, 
  Users, 
  ArrowRight, 
  Info, 
  Maximize2, 
  Home, 
  DollarSign, 
  Clock, 
  BarChart3,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Constants & Data ---
const PROPERTY_DATA = {
  address: "Jr. Noruega - Cercado de Lima",
  owners: ["César Augusto Flores Díaz", "Juan Carlos Flores Díaz", "Roxana Meliza Flores Díaz"],
  landArea: 160.00,
  builtArea: 244.24,
  recommendedValue: 285000,
  constructionValue: 89060,
  mapsUrl: "https://maps.app.goo.gl/sE9D94bfv67fAyUb7",
  scenarios: [
    { name: "Zona 1 Pura", total: 247460, color: "#94a3b8" },
    { name: "Zona 1 Ampliada", total: 277060, color: "#64748b" },
    { name: "Zona 1 Ampliada + Parque", total: 286500, color: "#10b981" },
    { name: "Zona 2 (Referencial Sup.)", total: 329860, color: "#3b82f6" },
    { name: "Zona 3 (Referencial Premium)", total: 339620, color: "#6366f1" },
    { name: "Zona 4 (Mercado Competitivo)", total: 298180, color: "#f59e0b" },
  ],
  porter: {
    rivalry: "Alta en Cercado; mayor presión en zonas colindantes.",
    substitutes: "Breña, Pueblo Libre y San Miguel.",
    buyerPower: "Alto – mercado altamente informado.",
    barriers: "Limitadas por percepción urbana y entorno."
  }
};

// --- Components ---

const Card = ({ children, className, title, icon: Icon }: { children: React.ReactNode, className?: string, title?: string, icon?: any }) => (
  <div className={cn("bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm", className)}>
    {title && (
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
        {Icon && <Icon className="w-4 h-4 text-slate-500" />}
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">{title}</h3>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

const Stat = ({ label, value, subValue, icon: Icon }: { label: string, value: string, subValue?: string, icon: any }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 rounded-xl bg-slate-100 text-slate-600">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      {subValue && <p className="text-xs text-slate-400 mt-0.5">{subValue}</p>}
    </div>
  </div>
);

export default function App() {
  const [price, setPrice] = useState(PROPERTY_DATA.recommendedValue);
  const [activeTab, setActiveTab] = useState<'overview' | 'valuation' | 'simulator' | 'strategy'>('overview');

  // Simulation Logic
  const simulationData = useMemo(() => {
    const basePrice = PROPERTY_DATA.recommendedValue;
    const steps = [];
    for (let i = 0.8; i <= 1.3; i += 0.05) {
      const p = Math.round(basePrice * i);
      // Logic: Higher price = Lower exposure, Higher time to sell
      const exposure = Math.max(5, Math.min(100, 100 - (i - 0.8) * 180));
      const months = Math.max(1, Math.round((i - 0.7) * 12));
      steps.push({
        price: p,
        exposure: Math.round(exposure),
        months: months,
        isCurrent: Math.abs(p - price) < 5000
      });
    }
    return steps;
  }, [price]);

  const currentSimulation = useMemo(() => {
    const ratio = price / PROPERTY_DATA.recommendedValue;
    const exposure = Math.max(5, Math.min(100, 100 - (ratio - 0.8) * 180));
    const months = Math.max(1, Math.round((ratio - 0.7) * 12));
    
    let competitiveness = "Alta";
    if (ratio > 1.15) competitiveness = "Baja (Fuera de mercado)";
    else if (ratio > 1.05) competitiveness = "Media (Competencia fuerte)";
    else if (ratio < 0.95) competitiveness = "Muy Alta (Oportunidad)";

    return { exposure: Math.round(exposure), months, competitiveness };
  }, [price]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex flex-col leading-none">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#D8004D] tracking-tighter">RE</span>
                  <span className="font-script text-xl text-slate-400">Real Estate</span>
                </div>
                <span className="text-[10px] font-bold text-slate-300 tracking-[0.4em] uppercase -mt-1">CENTRAL</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'overview', label: 'Resumen', icon: Home },
                { id: 'valuation', label: 'Valuación', icon: DollarSign },
                { id: 'simulator', label: 'Simulador', icon: TrendingUp },
                { id: 'strategy', label: 'Estrategia', icon: Shield },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                    activeTab === tab.id 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                      : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <a 
                href={PROPERTY_DATA.mapsUrl} 
                target="_blank" 
                rel="noreferrer"
                className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                UBICACIÓN GOOGLE MAPS
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                      Informe Integral <span className="text-slate-400">ACM</span>
                    </h2>
                    <p className="text-xl text-slate-500 max-w-2xl">
                      Análisis estratégico de mercado para la propiedad en <span className="text-slate-900 font-semibold">{PROPERTY_DATA.address}</span>.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Stat label="Área Terreno" value={`${PROPERTY_DATA.landArea} m²`} icon={Maximize2} />
                    <Stat label="Área Construida" value={`${PROPERTY_DATA.builtArea} m²`} icon={Home} />
                    <Stat label="Valor Sugerido" value={`$${PROPERTY_DATA.recommendedValue.toLocaleString()}`} subValue="USD" icon={TrendingUp} />
                  </div>

                  <Card className="bg-slate-900 text-white border-none shadow-xl shadow-slate-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                        <h3 className="text-lg font-bold mb-1">Conclusión Técnica Integral</h3>
                        <p className="text-slate-400 text-sm max-w-md">
                          Este valor equilibra el mercado directo (Zona 1) con la ventaja frente a parque y la presión competitiva de zonas colindantes.
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Valor Central Estratégico</p>
                        <p className="text-4xl font-black text-emerald-400">≈ $285,000 <span className="text-lg">USD</span></p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card title="Propietarios" icon={Users}>
                    <ul className="space-y-3">
                      {PROPERTY_DATA.owners.map((owner, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          {owner}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Estado de Conservación</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Bueno</span>
                        <span className="text-xs text-slate-500">Antigüedad: 40 años</span>
                      </div>
                    </div>
                  </Card>

                  <Card title="Ubicación Estratégica" icon={MapPin}>
                    <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden relative group">
                      <img 
                        src="https://picsum.photos/seed/map/800/450" 
                        alt="Map Preview" 
                        className="w-full h-full object-cover opacity-50 grayscale"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <a 
                          href={PROPERTY_DATA.mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-lg shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
                        >
                          Ver en Google Maps <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                      Ubicación privilegiada <span className="font-bold text-slate-700">frente a parque</span> en el distrito de Cercado de Lima, límite con Pueblo Libre.
                    </p>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'valuation' && (
            <motion.div
              key="valuation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Matriz por Zonas (Terreno)" icon={BarChart3}>
                  <div className="space-y-4">
                    {PROPERTY_DATA.scenarios.map((s, idx) => (
                      <div key={idx} className="group">
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s.name}</span>
                          <span className="text-sm font-bold text-slate-900">${s.total.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(s.total / 340000) * 100}%` }}
                            className="h-full"
                            style={{ backgroundColor: s.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 shrink-0" />
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Las Zonas 2 y 3 funcionan como techo de mercado, mientras que la Zona 1 representa la base técnica real del inmueble.
                    </p>
                  </div>
                </Card>

                <div className="space-y-6">
                  <Card title="Desglose de Valor" icon={DollarSign}>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-slate-900">Valor de Edificación</p>
                          <p className="text-xs text-slate-500">Categoría B - Depreciado (40 años)</p>
                        </div>
                        <p className="text-lg font-bold text-slate-900">${PROPERTY_DATA.constructionValue.toLocaleString()}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-slate-900">Valor de Terreno (Base)</p>
                          <p className="text-xs text-slate-500">160 m² @ $1,234/m² (Ajustado)</p>
                        </div>
                        <p className="text-lg font-bold text-slate-900">$197,440</p>
                      </div>
                      <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                        <p className="text-sm font-black text-slate-900 uppercase">Total Escenario Ampliado</p>
                        <p className="text-2xl font-black text-emerald-600">$286,500</p>
                      </div>
                    </div>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white border border-slate-200 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">VNR Categoría B</p>
                      <p className="text-xl font-bold text-slate-900">S/ 1,724.52</p>
                      <p className="text-[10px] text-slate-400">por m²</p>
                    </div>
                    <div className="p-6 bg-white border border-slate-200 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tipo de Cambio</p>
                      <p className="text-xl font-bold text-slate-900">3.3568</p>
                      <p className="text-[10px] text-slate-400">BCRP Ref.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'simulator' && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card title="Simulador de Exposición vs. Valor" icon={TrendingUp}>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={simulationData}>
                          <defs>
                            <linearGradient id="colorExposure" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="price" 
                            tickFormatter={(val) => `$${(val/1000)}k`}
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis 
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            formatter={(value, name) => [name === 'exposure' ? `${value}%` : `${value} meses`, name === 'exposure' ? 'Exposición' : 'Tiempo de Venta']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="exposure" 
                            stroke="#10b981" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorExposure)" 
                          />
                          <ReferenceLine x={price} stroke="#0f172a" strokeDasharray="3 3" label={{ position: 'top', value: 'Tu Precio', fill: '#0f172a', fontSize: 10, fontWeight: 'bold' }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-8 space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Ajustar Precio de Venta</label>
                          <span className="text-2xl font-black text-slate-900">${price.toLocaleString()} <span className="text-sm font-medium text-slate-400">USD</span></span>
                        </div>
                        <input 
                          type="range" 
                          min={220000} 
                          max={350000} 
                          step={5000}
                          value={price}
                          onChange={(e) => setPrice(parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                          <span>Liquidación</span>
                          <span>Mercado Directo</span>
                          <span>Aspiracional</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card title="Impacto en Mercado" icon={AlertCircle}>
                    <div className="space-y-8">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Exposición del Anuncio</p>
                        <div className="flex items-end gap-2">
                          <p className="text-4xl font-black text-slate-900">{currentSimulation.exposure}%</p>
                          <p className="text-xs text-slate-500 mb-1.5">de alcance potencial</p>
                        </div>
                        <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            animate={{ width: `${currentSimulation.exposure}%` }}
                            className={cn("h-full transition-colors", currentSimulation.exposure > 70 ? "bg-emerald-500" : currentSimulation.exposure > 40 ? "bg-amber-500" : "bg-red-500")}
                          />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Timeline de Venta</p>
                        <div className="flex items-end gap-2">
                          <p className="text-4xl font-black text-slate-900">{currentSimulation.months}</p>
                          <p className="text-xs text-slate-500 mb-1.5">meses estimados</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Competitividad</p>
                        <p className={cn(
                          "text-lg font-bold",
                          currentSimulation.competitiveness.includes("Alta") ? "text-emerald-600" : "text-amber-600"
                        )}>
                          {currentSimulation.competitiveness}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <h4 className="text-sm font-bold text-emerald-900 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Tip de Estrategia
                    </h4>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Al precio actual, la propiedad compite favorablemente con San Miguel, ofreciendo un metraje similar pero con la ventaja de ubicación frente a parque.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'strategy' && (
            <motion.div
              key="strategy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Cinco Fuerzas de Porter" icon={Shield} className="md:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-3">
                      <div className="p-2 w-fit bg-red-50 text-red-600 rounded-lg">
                        <Users className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900">Rivalidad</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{PROPERTY_DATA.porter.rivalry}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="p-2 w-fit bg-blue-50 text-blue-600 rounded-lg">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900">Sustitutos</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{PROPERTY_DATA.porter.substitutes}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="p-2 w-fit bg-amber-50 text-amber-600 rounded-lg">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900">Poder Comprador</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{PROPERTY_DATA.porter.buyerPower}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="p-2 w-fit bg-emerald-50 text-emerald-600 rounded-lg">
                        <Shield className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900">Barreras</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{PROPERTY_DATA.porter.barriers}</p>
                    </div>
                  </div>
                </Card>

                <Card title="Análisis Comparativo (ACM)" icon={BarChart3}>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <h5 className="text-xs font-bold text-slate-900 mb-1">San Miguel</h5>
                      <p className="text-xs text-slate-500">Mercado competitivo sustituto con parámetros mixtos.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <h5 className="text-xs font-bold text-slate-900 mb-1">Pueblo Libre / Magdalena</h5>
                      <p className="text-xs text-slate-500">Mercado premium con prima estructural consolidada.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <h5 className="text-xs font-bold text-slate-900 mb-1">Breña</h5>
                      <p className="text-xs text-slate-500">Zona de impacto directo por cercanía y precio base.</p>
                    </div>
                  </div>
                </Card>

                <Card title="Timeline de Madurez" icon={Clock}>
                  <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    <div className="relative">
                      <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                      <h5 className="text-sm font-bold text-slate-900">Lanzamiento (Mes 1)</h5>
                      <p className="text-xs text-slate-500">Máxima exposición. Foco en inversionistas de la zona.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm" />
                      <h5 className="text-sm font-bold text-slate-900">Maduración (Mes 2-4)</h5>
                      <p className="text-xs text-slate-500">Ajuste por feedback de visitas. Negociación activa.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm" />
                      <h5 className="text-sm font-bold text-slate-900">Cierre (Mes 5+)</h5>
                      <p className="text-xs text-slate-500">Consolidación de oferta final y trámites registrales.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="flex flex-col leading-none">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#D8004D] tracking-tighter">RE</span>
                  <span className="font-script text-lg text-slate-400">Real Estate</span>
                </div>
                <span className="text-[8px] font-bold text-slate-300 tracking-[0.4em] uppercase -mt-1">CENTRAL</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-4">© 2026</p>
            </div>
            <div className="flex gap-8">
              <div className="text-center md:text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha de Referencia</p>
                <p className="text-sm font-bold text-slate-900">Febrero 2026</p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Enfoque</p>
                <p className="text-sm font-bold text-slate-900">Categoría B - Residual</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
