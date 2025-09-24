import React from 'react';

const ActionToolbar = ({
  onAssemble,
  onDisassemble,
  onRevert,
  onRemoveSelected,
  onEmptyCanvas,
  onBreakBonds,
  onAddSingleBond,
  onAddDoubleBond,
  onAddPeptideBond,
  canAssemble,
  canDisassemble,
  canRevert,
  canRemove,
  canEmpty,
  canBreakBonds,
  canAddBond,
  canAddPeptideBond,
}) => {
  return (
    <div className="flex items-center flex-wrap gap-2 bg-gray-900/50 p-2 rounded-xl border border-gray-700">
      {/* Transformation Group */}
      <button
        onClick={onAssemble}
        disabled={!canAssemble}
        className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-green-500 to-green-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      ><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        Assemble</button>
      <button
        onClick={onDisassemble}
        disabled={!canDisassemble}
        className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      ><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4a1 1 0 00-2 0v2a1 1 0 002 0V4zm11 1a1 1 0 100-2h-2a1 1 0 100 2h2zm-4 0a1 1 0 100-2h-2a1 1 0 100 2h2zM9 9a1 1 0 100-2H7a1 1 0 100 2h2zm4-1a1 1 0 10-2 0v2a1 1 0 102 0V8z" clipRule="evenodd" /></svg>
        Disassemble</button>
      <button
        onClick={onRevert}
        disabled={!canRevert}
        className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-red-500 to-red-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      ><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
        Revert</button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-600 mx-2"></div>

      {/* Bonding Group */}
      <button
        onClick={onAddSingleBond}
        disabled={!canAddBond}
        title="Create a single bond between two selected particles"
        className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-sky-500 to-sky-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        Single Bond
      </button>
      <button
        onClick={onAddDoubleBond}
        disabled={!canAddBond}
        title="Create a double bond between two selected particles"
        className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-sky-500 to-sky-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        Double Bond
      </button>
      <button
        onClick={onAddPeptideBond}
        disabled={!canAddPeptideBond}
        title="Form a peptide bond between two amino acids"
        className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-pink-500 to-pink-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        Peptide Bond
      </button>
      <button
        onClick={onBreakBonds}
        disabled={!canBreakBonds}
        title="Break all bonds connected to the selected particle(s)"
        className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-purple-500 to-purple-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        Break Bonds
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-600 mx-2"></div>

      {/* Deletion Group */}
      <button
        onClick={onRemoveSelected}
        disabled={!canRemove}
        className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-orange-500 to-orange-700 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      ><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
        Remove</button>
      <button
        onClick={onEmptyCanvas}
        disabled={!canEmpty}
        className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-lg bg-gradient-to-br from-gray-600 to-gray-800 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      ><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        Empty Canvas</button>
    </div>
  );
};

export default ActionToolbar;