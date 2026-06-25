/**
 * units.ts
 * -----------------------------------------------------------------------
 * Canonical storage is always metric (cm for height, kg for weight).
 * Everything else — display strings, wheel ranges, imperial values — is
 * derived from that single source of truth so toggling units never
 * mutates stored state, only how it's read and rendered.
 */

export type HeightUnit = "cm" | "ft";
export type WeightUnit = "kg" | "lb";

// ---------------------------------------------------------------------------
// Height
// ---------------------------------------------------------------------------

const CM_PER_INCH = 2.54;
const IN_PER_FOOT = 12;

/** Whole-cm range used to build the metric wheel. */
export const HEIGHT_CM_RANGE = { min: 120, max: 220 };

/** Whole-inch range used to build the imperial wheel (≈3'11" to 7'3"). */
export const HEIGHT_IN_RANGE = {
    min: Math.round(HEIGHT_CM_RANGE.min / CM_PER_INCH),
    max: Math.round(HEIGHT_CM_RANGE.max / CM_PER_INCH),
};

export function cmToInches(cm: number): number {
    return cm / CM_PER_INCH;
}

export function inchesToCm(inches: number): number {
    return inches * CM_PER_INCH;
}

export function formatFeetInches(totalInches: number): string {
    const rounded = Math.round(totalInches);
    const feet = Math.floor(rounded / IN_PER_FOOT);
    const inches = rounded % IN_PER_FOOT;
    return `${feet}'${inches}"`;
}

/**
 * Builds the list of wheel values for the active height unit.
 * Metric: whole centimeters. Imperial: whole inches (displayed as ft/in).
 */
export function buildHeightWheelValues(unit: HeightUnit): number[] {
    const range = unit === "cm" ? HEIGHT_CM_RANGE : HEIGHT_IN_RANGE;
    const values: number[] = [];
    for (let v = range.min; v <= range.max; v += 1) values.push(v);
    return values;
}

/** Converts a canonical cm value to the wheel's native unit value. */
export function cmToWheelValue(cm: number, unit: HeightUnit): number {
    if (unit === "cm") return Math.round(cm);
    return Math.round(cmToInches(cm));
}

/** Converts a wheel value back to canonical cm for storage. */
export function wheelValueToCm(value: number, unit: HeightUnit): number {
    if (unit === "cm") return value;
    return Math.round(inchesToCm(value));
}

export function formatHeightDisplay(cm: number, unit: HeightUnit): string {
    if (unit === "cm") return `${Math.round(cm)}`;
    return formatFeetInches(cmToInches(cm));
}

export function heightUnitSuffix(unit: HeightUnit): string {
    return unit === "cm" ? "cm" : "";
}

// ---------------------------------------------------------------------------
// Weight
// ---------------------------------------------------------------------------

const KG_PER_LB = 0.45359237;

/** Whole-kg range used to build the metric wheel. */
export const WEIGHT_KG_RANGE = { min: 30, max: 200 };

/** Whole-lb range used to build the imperial wheel (≈66 to 440 lb). */
export const WEIGHT_LB_RANGE = {
    min: Math.round(WEIGHT_KG_RANGE.min / KG_PER_LB),
    max: Math.round(WEIGHT_KG_RANGE.max / KG_PER_LB),
};

export function kgToLb(kg: number): number {
    return kg / KG_PER_LB;
}

export function lbToKg(lb: number): number {
    return lb * KG_PER_LB;
}

export function buildWeightWheelValues(unit: WeightUnit): number[] {
    const range = unit === "kg" ? WEIGHT_KG_RANGE : WEIGHT_LB_RANGE;
    const values: number[] = [];
    for (let v = range.min; v <= range.max; v += 1) values.push(v);
    return values;
}

export function kgToWheelValue(kg: number, unit: WeightUnit): number {
    if (unit === "kg") return Math.round(kg);
    return Math.round(kgToLb(kg));
}

export function wheelValueToKg(value: number, unit: WeightUnit): number {
    if (unit === "kg") return value;
    return Math.round(lbToKg(value));
}

export function formatWeightDisplay(kg: number, unit: WeightUnit): string {
    if (unit === "kg") return `${Math.round(kg)}`;
    return `${Math.round(kgToLb(kg))}`;
}

export function weightUnitSuffix(unit: WeightUnit): string {
    return unit;
}