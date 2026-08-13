import { SAFETY_CONSTANTS } from '../data/constants';

export const checkSafety = (vessel, isFumeHoodOn) => {
    if (vessel.isOpen && !isFumeHoodOn) {
        const hasToxic = Object.keys(vessel.contents).some(id => SAFETY_CONSTANTS.TOXIC_GASES.includes(id));
        if (hasToxic) {
            return '⚠️ TOXIC GAS ESCAPING! Turn on Fume Hood!';
        }
    }
    return null;
};
