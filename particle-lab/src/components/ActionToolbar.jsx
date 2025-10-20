import React from 'react';

const ActionToolbar = ({
  onAssemble,
  onDisassemble,
  onRevert,
  onRemoveSelected,
  onBreakBonds,
  onAddSingleBond,
  onAddDoubleBond,
  onAddPeptideBond,
  canAssemble,
  canDisassemble,
  canRevert,
  canRemove,
  canBreakBonds,
  canAddBond,
  canAddPeptideBond,
}) => {
  return (
    <div className="flex items-center flex-wrap gap-2 bg-gray-900/50 p-2 rounded-xl border border-gray-700">
      {/* Transformation Group */}
      {canAssemble && (
        <button onClick={onAssemble} className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-green-500 to-green-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          Assemble
        </button>
      )}
      {canDisassemble && (
        <button onClick={onDisassemble} className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4a1 1 0 00-2 0v2a1 1 0 002 0V4zm11 1a1 1 0 100-2h-2a1 1 0 100 2h2zm-4 0a1 1 0 100-2h-2a1 1 0 100 2h2zM9 9a1 1 0 100-2H7a1 1 0 100 2h2zm4-1a1 1 0 10-2 0v2a1 1 0 102 0V8z" clipRule="evenodd" /></svg>
          Disassemble
        </button>
      )}
      {canRevert && (
        <button onClick={onRevert} className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-red-500 to-red-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
          Revert
        </button>
      )}
      {/* Bonding Group */}
      {canAddBond && (
        <>
          <div className="h-6 w-px bg-gray-600 mx-2"></div>
          <button onClick={onAddSingleBond} title="Create a single bond" className="px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-sky-600 hover:bg-sky-700">Single Bond</button>
          <button onClick={onAddDoubleBond} title="Create a double bond" className="px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-sky-600 hover:bg-sky-700">Double Bond</button>
        </>
      )}
      {canAddPeptideBond && (
        <>
          <div className="h-6 w-px bg-gray-600 mx-2"></div>
          <button onClick={onAddPeptideBond} title="Form a peptide bond" className="px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-pink-600 hover:bg-pink-700">Peptide Bond</button>
        </>
      )}
      {canBreakBonds && (
        <>
          <div className="h-6 w-px bg-gray-600 mx-2"></div>
          <button onClick={onBreakBonds} title="Break bonds" className="px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-purple-600 hover:bg-purple-700">Break Bonds</button>
        </>
      )}
      {canRemove && (
        <>
          <div className="h-6 w-px bg-gray-600 mx-2"></div>
          <button onClick={onRemoveSelected} className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-orange-500 to-orange-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            Remove
          </button>
        </>
      )}
    </div>
  );
};

export default ActionToolbar;