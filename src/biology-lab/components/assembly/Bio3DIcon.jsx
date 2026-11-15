import React, { useMemo } from 'react';
import { renderElement3DIcon } from '../../utils/elementIconRenderer';

/**
 * Renders a cached 256x256 WebGL 3D snapshot icon for any biology element or organelle,
 * falling back gracefully to an emoji/symbol when WebGL is unavailable (e.g. JSDOM tests).
 */
const Bio3DIcon = ({ id, color = '#38bdf8', fallback = '🧬', alt = '', className = 'w-5 h-5' }) => {
  const iconUrl = useMemo(() => renderElement3DIcon(id, color), [id, color]);

  if (!iconUrl) {
    return <span className="leading-none">{fallback}</span>;
  }

  return (
    <img
      src={iconUrl}
      alt={alt || id}
      className={`${className} object-contain shrink-0 drop-shadow-[0_2px_6px_rgba(34,211,238,0.32)]`}
      draggable={false}
    />
  );
};

export default Bio3DIcon;
