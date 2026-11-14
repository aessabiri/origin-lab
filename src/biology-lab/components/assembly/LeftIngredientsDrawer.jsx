import React from 'react';

/**
 * Shared Left Ingredients Drawer for all 5 Bio-Assembly stops.
 * Supports HTML5 drag-and-drop onto the 3D canvas, click-to-load,
 * Demiurge Survival stock indicators, and quick-load target blueprints.
 */
const LeftIngredientsDrawer = ({
  title = 'Ingredients',
  subtitle = 'Drag onto canvas or click +',
  items = [],
  loadedIds = [],
  dragKind = 'ingredient',
  onAddItem,
  demiurgeSurvivalMode = false,
  recipes = [],
  recipeSectionTitle = 'Target Blueprints',
  footerNote = null,
}) => {
  return (
    <div className="col-span-3 flex flex-col bg-[#0b1220] rounded-2xl border border-white/10 p-3 min-h-0 overflow-hidden">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div>
          <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase block">
            {title}
          </span>
          <span className="text-[10px] text-slate-400">{subtitle}</span>
        </div>
        <span className="text-[9px] font-mono text-slate-500">
          {loadedIds.length} on canvas
        </span>
      </div>

      {/* Draggable Ingredient Cards */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {items.map((item) => {
          const isOnCanvas = loadedIds.includes(item.id);
          const isBlocked = demiurgeSurvivalMode && item.available === false;
          return (
            <div
              key={item.id}
              draggable={!isBlocked}
              onDragStart={(e) => {
                if (isBlocked) {
                  e.preventDefault();
                  return;
                }
                e.dataTransfer.setData(
                  'application/json',
                  JSON.stringify({ kind: dragKind, id: item.id })
                );
                e.dataTransfer.effectAllowed = 'copy';
              }}
              onClick={() => {
                if (!isBlocked && onAddItem) onAddItem(item.id);
              }}
              className={`p-2 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                isBlocked
                  ? 'bg-[#080d18]/60 border-rose-500/20 opacity-50 cursor-not-allowed'
                  : isOnCanvas
                  ? 'bg-cyan-500/15 border-cyan-400/60 cursor-grab active:cursor-grabbing'
                  : 'bg-[#080d18] border-white/10 hover:border-cyan-400/40 cursor-grab active:cursor-grabbing'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 border border-white/10"
                  style={{ backgroundColor: `${item.color || '#38bdf8'}22` }}
                >
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-[10.5px] font-bold text-white truncate">
                    {item.name}
                  </div>
                  <div className="text-[8.5px] font-mono text-slate-400 truncate">
                    {item.formula || item.subtitle}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {demiurgeSurvivalMode && item.stockCount !== undefined && (
                  <span
                    className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded ${
                      isBlocked
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-emerald-500/15 text-emerald-300'
                    }`}
                  >
                    {item.stockCount}
                  </span>
                )}
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isBlocked
                      ? 'bg-rose-500/20 text-rose-300'
                      : isOnCanvas
                      ? 'bg-cyan-500/25 text-cyan-200'
                      : 'bg-white/5 text-slate-300'
                  }`}
                >
                  {isBlocked ? '0' : isOnCanvas ? '✓' : '+'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Target Blueprints / Quick-Load Recipes */}
      {recipes.length > 0 && (
        <div className="mt-2 pt-2 border-t border-white/10 shrink-0">
          <div className="text-[8.5px] font-mono font-bold text-slate-400 uppercase mb-1.5">
            {recipeSectionTitle}
          </div>
          <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
            {recipes.map((rec) => (
              <button
                key={rec.id}
                onClick={rec.onSelect}
                className={`w-full px-2 py-1.5 rounded-lg border text-left font-mono text-[9px] flex items-center justify-between gap-1 cursor-pointer transition-all ${
                  rec.isActive
                    ? 'bg-cyan-500/20 border-cyan-400/70 text-white'
                    : rec.isBuilt
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-[#080d18] border-white/10 hover:border-cyan-400/40 text-slate-200'
                }`}
              >
                <span className="truncate">
                  {rec.icon} {rec.name}
                </span>
                <span className="text-[8px] text-cyan-300 shrink-0">
                  {rec.badge || (rec.isBuilt ? '✓' : 'Load')}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {footerNote && (
        <div className="mt-2 pt-1.5 border-t border-white/5 text-[8.5px] font-mono text-slate-400 shrink-0">
          {footerNote}
        </div>
      )}
    </div>
  );
};

export default LeftIngredientsDrawer;
