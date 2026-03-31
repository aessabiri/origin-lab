import React from 'react';
import { PARTICLE_COLOR_MAP } from '../../../../constants/particles.js';
import { PngIcon } from '../Base.jsx';

import membraneImg from '../../../../icons/cell_membrane.png';
import nucleusImg from '../../../../icons/cell_nucleus.png';
import mitochondriaImg from '../../../../icons/mitochondria.png';
import ribosomeImg from '../../../../icons/ribosome.png';

export const MembranePngIcon = () => <PngIcon src={membraneImg} alt="Membrane" />;
export const NucleusPngIcon = () => <PngIcon src={nucleusImg} alt="Nucleus" />;
export const MitochondriaPngIcon = () => <PngIcon src={mitochondriaImg} alt="Mitochondria" />;
export const RibosomePngIcon = () => <PngIcon src={ribosomeImg} alt="Ribosome" />;

