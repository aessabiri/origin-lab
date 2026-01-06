import React from 'react';
import Vessel from './Vessel';

const Workstation = () => {
  return (
    <div className="flex-1 bg-slate-800 p-8 flex items-center justify-center overflow-hidden relative">
       {/* Background Lab Accents */}
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
       
       {/* Table Surface */}
       <div className="relative bg-slate-700/30 p-12 rounded-3xl border-b-8 border-slate-600 shadow-2xl flex gap-12 items-end min-h-[400px] backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 opacity-50 rounded-t-3xl"></div>
          
          <Vessel id="beaker" />
          <Vessel id="flask" hasTempControl />
          <Vessel id="chamber" hasTempControl hasPressureControl />
       </div>
    </div>
  );
};

export default Workstation;
