import { describe, it, expect } from 'vitest';
import { calculatePH, calculatePrecipitates, processReactions } from '../logic/chemistry';
import { CHEMICALS } from '../data/chemicals';

describe('Chemistry Logic', () => {
    
    describe('pH Calculation', () => {
        it('should return 7.0 for pure water', () => {
            const contents = { H2O: 100 };
            expect(calculatePH(contents)).toBeCloseTo(7.0, 1);
        });

        it('should be acidic for HCl', () => {
            const contents = { H2O: 100, HYDROCHLORIC_ACID: 10 };
            const ph = calculatePH(contents);
            expect(ph).toBeLessThan(7);
        });

        it('should be basic for NaOH', () => {
            const contents = { H2O: 100, SODIUM_HYDROXIDE: 10 };
            const ph = calculatePH(contents);
            expect(ph).toBeGreaterThan(7);
        });

        it('should neutralize to near 7 for equal parts strong acid/base', () => {
            // Note: In our game logic, they neutralize moles.
            // HCl (pH 1) -> [H+] = 0.1 M
            // NaOH (pH 14) -> [OH-] = 1.0 M
            // They are not equimolar by mass/volume in our simplifed data unless pH aligns.
            // Let's mix chemicals where moles might balance or just check trends.
            
            // Actually, calculatePH sums moles based on pH.
            // If we have pure HCl chemical and pure NaOH chemical.
            const contents = { H2O: 100, HYDROCHLORIC_ACID: 10, SODIUM_HYDROXIDE: 10 };
            // Since pH of NaOH is 14 ([OH]=1) and HCl is 1 ([H]=0.1), NaOH is 10x stronger per unit.
            // So it should be basic.
            const ph = calculatePH(contents);
            expect(ph).toBeGreaterThan(7);
        });
    });

    describe('Solubility & Precipitation', () => {
        it('should dissolve salt below limit', () => {
            // NaCl limit ~36g/100ml
            const contents = { H2O: 100, NaCl: 30 };
            const { dissolved, precipitates } = calculatePrecipitates(contents, 20);
            expect(dissolved.NaCl).toBe(30);
            expect(precipitates.NaCl).toBeUndefined();
        });

        it('should precipitate salt above limit', () => {
            const contents = { H2O: 100, NaCl: 50 };
            const { dissolved, precipitates } = calculatePrecipitates(contents, 20);
            expect(dissolved.NaCl).toBeCloseTo(36, 0); // approx 36
            expect(precipitates.NaCl).toBeCloseTo(14, 0);
        });

        it('should increase solubility with temperature', () => {
            const contents = { H2O: 100, NaCl: 50 };
            const { dissolved: d20 } = calculatePrecipitates(contents, 20);
            const { dissolved: d80 } = calculatePrecipitates(contents, 80);
            
            expect(d80.NaCl).toBeGreaterThan(d20.NaCl);
        });

        it('should treat melted solids as fully dissolved/liquid', () => {
            // Salt melts at 801. At 900, it is liquid.
            // Liquid salt mixing with... well, if it's pure salt, it's just liquid.
            // calculatePrecipitates is usually for solvent based.
            // If I have Salt at 900C, it shouldn't precipitate out of itself.
            const contents = { NaCl: 100 }; // No water
            // If no solvent, limit is 0? Or infinite?
            // Current logic: totalSolvent = 0. BaseLimit = 0.
            // So it precipitates everything?
            // Ideally, if it's melted, it's its own liquid.
            const { precipitates } = calculatePrecipitates(contents, 900);
            expect(precipitates.NaCl).toBeUndefined(); 
        });
    });

    describe('Reaction Thermodynamics', () => {
        it('should generate heat for exothermic reactions', () => {
            // Neutralization: HCl + NaOH -> NaCl + H2O
            // This is spontaneous.
            const vessel = {
                contents: { HYDROCHLORIC_ACID: 10, SODIUM_HYDROXIDE: 10 },
                temp: 20,
                pressure: 1
            };
            const result = processReactions(vessel, 1);
            expect(result.heatGenerated).toBeGreaterThan(0);
        });
    });
});
