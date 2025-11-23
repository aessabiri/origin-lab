import React, { useRef, useCallback } from 'react';
import { useStore } from '../store';
import ChemistryPalette from './ChemistryPalette';
import { CHEMICAL_INFO, CHEMICAL_TYPES } from '../constants/chemicalInfo';
import { useSprings, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { useChemistry } from '../hooks/useChemistry';

const ChemistryLab = () => {
  const { chemicals, setChemicals, showMessage } = useStore();
  const canvasRef = useRef(null);
  const { handleMixing } = useChemistry();

  const [springs, api] = useSprings(chemicals.length, i => ({
    x: chemicals[i]?.x ?? 0,
    y: chemicals[i]?.y ?? 0,
    scale: 1,
  }), [chemicals]);

  const bind = useDrag(({ args: [index], active, offset: [ox, oy], tap }) => {
    if (tap) return;

    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const chemical = chemicals[index];
    const chemicalSize = CHEMICAL_INFO[chemical.type]?.size || 64;

    const clampedX = Math.max(0, Math.min(ox, canvasBounds.width - chemicalSize));
    const clampedY = Math.max(0, Math.min(oy, canvasBounds.height - chemicalSize));

    api.start(i => {
      if (i === index) {
        return {
          x: clampedX,
          y: clampedY,
          scale: active ? 1.1 : 1,
          immediate: active,
        };
      }
    });

    if (!active) {
      setChemicals(chemicals.map((c, i) => i === index ? { ...c, x: clampedX, y: clampedY } : c));
    }
  }, {
    from: ({ args: [index] }) => [springs[index].x.get(), springs[index].y.get()],
    filterTaps: true,
    pointer: { touch: true },
  });

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (!data.type) return;

      const canvasBounds = canvasRef.current.getBoundingClientRect();
      const dropX = e.clientX - canvasBounds.left;
      const dropY = e.clientY - canvasBounds.top;

      // Check if dropping on a flask
      const flask = chemicals.find(c => {
        if (c.type !== CHEMICAL_TYPES.FLASK) return false;
        const flaskSize = CHEMICAL_INFO[c.type].size;
        return dropX >= c.x && dropX <= c.x + flaskSize && dropY >= c.y && dropY <= c.y + flaskSize;
      });

      if (flask && data.type !== CHEMICAL_TYPES.FLASK) {
        const newContents = [...(flask.contents || []), data.type];
        const reactionResult = handleMixing(newContents);
        const updatedChemicals = chemicals.map(c => c.id === flask.id ? { ...c, contents: reactionResult } : c);
        setChemicals(updatedChemicals);
        
        if (reactionResult.length === 1 && reactionResult[0] !== newContents[0]) {
          showMessage(`Created ${CHEMICAL_INFO[reactionResult[0]].name}!`);
        } else {
          showMessage(`Added ${CHEMICAL_INFO[data.type].name} to the flask!`);
        }

      } else if (data.type !== CHEMICAL_TYPES.FLASK || !flask) {
        const newChemical = {
          id: `${data.type}-${Date.now()}`,
          type: data.type,
          x: dropX - (CHEMICAL_INFO[data.type].size / 2),
          y: dropY - (CHEMICAL_INFO[data.type].size / 2),
          ...(data.type === CHEMICAL_TYPES.FLASK && { contents: [] }),
        };
        setChemicals([...chemicals, newChemical]);
        showMessage(`Added ${CHEMICAL_INFO[data.type].name} to the lab!`);
      }

    } catch (err) {
      console.error('drop parse failed', err);
    }
  }, [chemicals, setChemicals, showMessage, handleMixing]);

  const handleDragOver = (e) => { e.preventDefault(); };

  const getEmoji = (type) => {
    switch (type) {
      case CHEMICAL_TYPES.FLASK:
        return '🧪';
      case CHEMICAL_TYPES.WATER:
        return '💧';
      case CHEMICAL_TYPES.SALT:
        return '🧂';
      case CHEMICAL_TYPES.SALT_WATER:
        return '🌊';
      default:
        return '🧪';
    }
  };

  return (
    <div className="flex flex-row h-full p-4 gap-4">
      <div
        ref={canvasRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative flex-1 bg-gray-800 border-4 border-dashed border-gray-700 rounded-2xl shadow-xl overflow-hidden touch-none"
      >
        {springs.map((props, i) => {
          const chemical = chemicals[i];
          return (
            <animated.div
              {...bind(i)}
              key={chemical.id}
              style={{
                position: 'absolute',
                x: props.x,
                y: props.y,
                scale: props.scale,
                width: `${CHEMICAL_INFO[chemical.type].size}px`,
                height: `${CHEMICAL_INFO[chemical.type].size}px`,
                touchAction: 'none',
              }}
              className="flex items-center justify-center cursor-grab"
            >
              <div className="text-4xl">
                {getEmoji(chemical.type)}
              </div>
              <div className="absolute top-full text-center">
                <p className="text-sm font-semibold text-gray-300">
                  {CHEMICAL_INFO[chemical.type].name}
                </p>
                {chemical.type === CHEMICAL_TYPES.FLASK && chemical.contents && (
                  <div className="text-xs text-gray-400">
                    {chemical.contents.map((content, i) => (
                      <span key={i}>{CHEMICAL_INFO[content].name} </span>
                    ))}
                  </div>
                )}
              </div>
            </animated.div>
          );
        })}
      </div>
      <div className="w-80">
        <ChemistryPalette />
      </div>
    </div>
  );
};

export default ChemistryLab;
