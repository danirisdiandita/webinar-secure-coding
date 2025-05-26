export const diffTimeHHMMSS = (startTime: Date, endTime: Date) => {
    const diff = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


export const MinutesToMM = (minutes: number) => {
    return `${minutes.toString().padStart(2, '0')}`;
}

export const HoursToHH = (hours: number) => {
    return `${hours.toString().padStart(2, '0')}`;
}

export const totalMinutesToHHMM = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const minutes_ = minutes % 60;
    if (hours === 0) {
        return `${minutes_} minutes`;
    } else if (hours === 1) {
        return `${hours} hour and ${minutes_} minutes`;
    } else {
        return `${hours} hours and ${minutes_} minutes`;
    }
}