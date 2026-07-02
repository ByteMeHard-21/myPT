export function formatDuration(
    totalSeconds: number
): string {

    if (totalSeconds < 60) {
        return "Less than 1 min";
    }

    const totalMinutes = Math.floor(totalSeconds / 60);

    if (totalMinutes < 60) {
        return `${totalMinutes} min`;
    }

    const hours = Math.floor(totalMinutes / 60);

    const minutes = totalMinutes % 60;

    if (minutes === 0) {
        return `${hours} hr`;
    }

    return `${hours} hr ${minutes} min`;

}

export function formatVolume(volume: number) {

    return `${volume.toLocaleString()} kg`;

}

export function formatCalories(calories: number) {

    return `${Math.round(calories)} kcal`;

}

export function formatXP(xp: number) {

    return `+${xp} XP`;

}