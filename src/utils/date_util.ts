export const getTimeOffset = (timezone: string): string => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'short'
    });

    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find(part => part.type === 'timeZoneName');

    if (!offsetPart) {
        throw new Error(`Could not determine offset for timezone: ${timezone}`);
    }

    const offsetString = offsetPart.value;
    return offsetString
}


export const getOurTimezoneFormat = (timezone: string, timezone_offset: number): string => {
    const timezone_name = timezone.split("/")[1]
    return `${timezone_name} (GMT${timezone_offset > 0 ? "+" : "-"}${timezone_offset})`
}


export const getStartOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export const getOneSecondBeforeEndOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1); // next month, at 00:00:00
}

export const getStartOfWeek = (date: Date): Date => {
    const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = day === 0 ? 6 : day - 1;

    const start = new Date(date);
    start.setDate(date.getDate() - diff);
    start.setHours(0, 0, 0, 0);
    return start;
}

export const getOneSecondBeforeEndOfWeek = (date: Date): Date => {
    const endOfWeek = getStartOfWeek(date)
    const end = new Date(endOfWeek);
    end.setDate(endOfWeek.getDate() + 7);
    end.setHours(0, 0, 0, 0);
    return end;
}

export const getStartOfYear = (date: Date): Date => {
    return new Date(date.getFullYear(), 0, 1);
}

export const getOneSecondBeforeEndOfYear = (date: Date): Date => {
    return new Date(date.getFullYear() + 1, 0, 1); // next year, at 00:00:00
}


// [
//     {
//         "type": "month",
//         "value": "1"
//     },
//     {
//         "type": "literal",
//         "value": "/"
//     },
//     {
//         "type": "day",
//         "value": "19"
//     },
//     {
//         "type": "literal",
//         "value": "/"
//     },
//     {
//         "type": "year",
//         "value": "2025"
//     },
//     {
//         "type": "literal",
//         "value": ", "
//     },
//     {
//         "type": "timeZoneName",
//         "value": "GMT+7"
//     }
// ]

export const getHumanReadableDate = (date: Date): string => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let dayString: string;
    switch (day % 10) {
        case 1:
            dayString = `${day}st`;
            break;
        case 2:
            dayString = `${day}nd`;
            break;
        default:
            dayString = `${day}th`;
    }
    return `${month} ${dayString}, ${year}`;
}

export const getHumanReadablePrice = (price: string | number): string => {
    if (typeof price === "string") price = Number(price);
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });
    return formatter.format(price / 100);
}


export const getStartOfToday = () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
}

export const getEndOfToday = () => {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date;
}


export const convertSecondsToHHMMSS = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const seconds_ = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds_.toString().padStart(2, '0')}`;
}

export function getStartOfDateWithOffset(date: Date, timezoneOffset: number): Date {
    const utcDate = new Date(date);
    const localTime = utcDate.getTime() + timezoneOffset * 60 * 1000; // Adjust to the desired timezone
    const localDate = new Date(localTime);

    // Reset to start of the day in the given timezone
    localDate.setUTCHours(0, 0, 0, 0);

    return new Date(localDate.getTime() - timezoneOffset * 60 * 1000); // Convert back to UTC
}

export function getEndOfDateWithOffset(date: Date, timezoneOffset: number): Date {
    const start = getStartOfDateWithOffset(date, timezoneOffset);
    start.setHours(23, 59, 59, 999);
    return start;
}