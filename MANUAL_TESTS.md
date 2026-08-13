# Chemistry Lab - Manual Test Scenarios

Use these scenarios to verify the realism and functionality of the simulation. Ensure you are in **Sandbox Mode** to access all materials.

## 🧪 1. The Acid-Base Rainbow (pH & Visuals)
**Goal:** Test dynamic pH calculation and color blending.
1.  **Setup:** Add **100ml Water** to a Beaker. (Monitor: pH 7.00).
2.  **Indicator:** Add **5ml Universal Indicator**. (Visual: Liquid turns Green).
3.  **Acidify:** Add **10ml Hydrochloric Acid**.
    *   *Result:* pH drops (< 2.0). Liquid turns **Red**.
4.  **Neutralize:** Slowly add **Sodium Hydroxide** (Strong Base).
    *   *Result:* pH rises. Color transitions: Red → Orange → Green (Neutral) → Blue → **Purple** (Basic).
    *   *Note:* The reaction is Exothermic, so temperature may rise slightly.

## ❄️ 2. The Snow Globe (Solubility & Saturation)
**Goal:** Test precipitation limits and temperature-dependent solubility.
1.  **Setup:** Add **100ml Water** to a Beaker at 20°C.
2.  **Saturate:** Add **50g Salt (NaCl)**.
    *   *Result:* Solubility is ~36g. A white **sediment layer** appears at the bottom. Monitor reports "Saturated".
3.  **Heat:** Turn Heater to **100°C**.
    *   *Result:* As temp rises, solubility increases. The sediment should shrink and eventually disappear as it dissolves.
4.  **Cool:** Turn Heater OFF or set to 0°C.
    *   *Result:* As it cools, the salt precipitates back out, reforming the sediment (Crystallization).

## 🧊 3. The Cold Fizz (Endothermic Reactions)
**Goal:** Test thermodynamic feedback.
1.  **Setup:** Add **50ml Vinegar** to a Beaker. Note the temperature (e.g., 20°C).
2.  **React:** Add **20g Baking Soda**.
    *   *Result:* Intense bubbling (CO2). The temperature monitor should **drop** (e.g., to 10-15°C) because the reaction absorbs heat.

## 💣 4. The Pressure Cooker (Gas Laws & Synthesis)
**Goal:** Test the Physics Engine (PV=nRT) and industrial synthesis.
1.  **Setup:** Use the **High-Pressure Reactor**.
2.  **Fill:** Add **Hydrogen** and **Nitrogen** (Ratio 3:1).
3.  **Seal:** Click "CLOSE LID".
4.  **Energize:** Turn Heater to **300°C**.
    *   *Result:* Pressure dial climbs due to heat (Gay-Lussac's Law). Once Temp > 200°C and Pressure > 50atm, **Ammonia** begins to form (Haber Process).

## ⚗️ 5. The Distiller (Phase Changes)
**Goal:** Test boiling, venting, and condensation.
1.  **Setup:** Use the **Reaction Flask** (which has a Condenser attached).
2.  **Fill:** Add **Ethanol** (BP 78°C).
3.  **Configure:** Set Condenser Valve to **ON**.
4.  **Boil:** Heat flask to **85°C**.
    *   *Result:* Bubbles appear. "Steam" visual active. Volume in flask decreases. Liquid accumulates in the Condenser's collection vial.

## ☠️ 6. Safety First (Toxic Gas & Ventilation)
**Goal:** Test the Fume Hood mechanics.
1.  **Setup:** Use an **Open Beaker**. Ensure Fume Hood is **OFF**.
2.  **React:** Create Chlorine Gas (e.g., add **HCl** and **Sodium Hydroxide**... wait, that makes Salt. Add **Hydrogen** + **Chlorine**? No, Chlorine is the hazard. Just add **Chlorine** gas directly or generate it via Chloralkali process: **Water + Salt + Heat > 100C**).
3.  **Hazard:** Chlorine is generated/released.
    *   *Result:* Warning Message: "TOXIC FUMES DETECTED!". Health/Safety alert.
4.  **Mitigate:** Turn Fume Hood **ON**.
    *   *Result:* The warning clears as the system vents the gas.

## 🧱 7. The Blacksmith (State Changes: Solid <-> Liquid)
**Goal:** Test melting points.
1.  **Setup:** Use a **Crucible** (Ceramic Vessel).
2.  **Fill:** Add **Iron** (Solid).
3.  **Heat:** Crank heater to **2000°C** (Iron MP is ~1538°C).
4.  **Melt:** Wait for temp to cross threshold.
    *   *Result:* The "Bar" icon changes to a molten liquid visual. The state description changes to "Molten Iron".
5.  **Cast:** (Future feature) Pouring it into a mold would create a shape. For now, verify it behaves as a liquid.
