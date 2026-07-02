export function getWorkoutElapsedSeconds(
    elapsedSeconds: number,
    runningSince: string | null
) {
    if (!runningSince) {
        return elapsedSeconds;
    }

    const now = Date.now();

    const started =
        new Date(runningSince).getTime();

    return (
        elapsedSeconds +
        Math.floor(
            (now - started) / 1000
        )
    );
}