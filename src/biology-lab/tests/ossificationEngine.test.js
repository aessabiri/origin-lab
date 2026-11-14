import { describe, it, expect } from 'vitest';
import {
  createInitialOssificationState,
  stepOssification,
  evaluateMechanicalStressTest,
  getOssificationPhase,
} from '../utils/ossificationEngine';

describe('ossificationEngine', () => {
  it('progresses through all 6 endochondral ossification phases when biological switches are activated', () => {
    let state = createInitialOssificationState('endochondral');
    expect(getOssificationPhase(state).index).toBe(1);

    // 1. Condense + SOX9 -> Cartilage template
    state.sox9Active = true;
    for (let i = 0; i < 16; i++) state = stepOssification(state, 0.25);
    expect(state.condensation).toBeGreaterThan(50);
    expect(state.cartilageTemplate).toBeGreaterThan(50);
    expect(getOssificationPhase(state).index).toBe(2);

    // 2. VEGF-A Angiogenesis -> Vascular invasion
    state.vegfTriggered = true;
    for (let i = 0; i < 10; i++) state = stepOssification(state, 0.25);
    expect(state.vascularization).toBeGreaterThan(40);

    // 3. RUNX2 -> Osteoid + Hydroxyapatite Mineralization
    state.runx2Active = true;
    for (let i = 0; i < 20; i++) state = stepOssification(state, 0.25);
    expect(state.osteoidCollagen).toBeGreaterThan(70);
    expect(state.mineralization).toBeGreaterThan(75);

    // 4. Osteoclasts -> Hollow Medullary Cavity + Wolff's Law
    state.osteoclastsActive = true;
    for (let i = 0; i < 15; i++) state = stepOssification(state, 0.25);
    expect(state.marrowCavity).toBeGreaterThan(60);
    expect(getOssificationPhase(state).index).toBe(6);
    expect(evaluateMechanicalStressTest(state).status).toBe('CERTIFIED');
  });

  it('stalls vascularization & osteoid if O2 perfusion is hypoxic (<12%)', () => {
    let state = createInitialOssificationState('endochondral');
    state.sox9Active = true;
    state.o2Perfusion = 4; // Severe hypoxia
    for (let i = 0; i < 12; i++) state = stepOssification(state, 0.25);
    state.vegfTriggered = true;
    for (let i = 0; i < 12; i++) state = stepOssification(state, 0.25);
    expect(state.vascularization).toBe(0);
  });

  it('models rubber-bend vs chalk-shatter vs composite strength accurately', () => {
    const osteoidOnly = {
      ...createInitialOssificationState('endochondral'),
      osteoidCollagen: 80,
      mineralization: 10,
    };
    expect(evaluateMechanicalStressTest(osteoidOnly).status).toBe('BENDS_RUBBER');

    const mineralOnly = {
      ...createInitialOssificationState('endochondral'),
      osteoidCollagen: 10,
      mineralization: 80,
    };
    expect(evaluateMechanicalStressTest(mineralOnly).status).toBe('BRITTLE_SHATTER');

    const composite = {
      ...createInitialOssificationState('endochondral'),
      osteoidCollagen: 85,
      mineralization: 90,
      marrowCavity: 70,
    };
    expect(evaluateMechanicalStressTest(composite).status).toBe('CERTIFIED');
  });
});
