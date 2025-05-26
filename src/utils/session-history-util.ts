import { SessionHistoryByDate, SessionHistoryOnProjectPage } from "@/app/store/session-history-store";


const toDateString = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;


export const groupingSessionHistoryByDate = (sessionHistory: SessionHistoryOnProjectPage[]) => {
    const grouped: SessionHistoryByDate[] = [];
    if (!sessionHistory) return []
    sessionHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).forEach(session => {
        const date = new Date(session.date);
        const date_string = toDateString(date);
        if (!grouped.some(group => toDateString(new Date(group.date)) === date_string)) {
            grouped.push({ date: date_string, sessions: [session] });
        } else {
            grouped.find(group => toDateString(new Date(group.date)) === date_string)!.sessions.push(session);
        }
    });
    return grouped;
}


export const getTimeAgo = (stopped_at: string | null) => {
    if (!stopped_at) return "just now"

    const date_ = new Date(stopped_at)
    const now = new Date()
    let timeAgo = ''
    const hours_for_diff = Math.floor(((now.getTime() - date_.getTime()) / (1000 * 60 * 60)))
    const minutes_for_diff = Math.floor(((now.getTime() - date_.getTime()) / (1000 * 60)))
    if (hours_for_diff > 24) {
        const days_ = Math.floor(hours_for_diff / 24)
        if (days_ > 1) {
            timeAgo = `${days_} days ago`
        } else {
            timeAgo = `1 day ago`
        }
    } else if (hours_for_diff > 0) {
        timeAgo = `about ${hours_for_diff} hours ago`
    } else if (minutes_for_diff > 0) {
        timeAgo = `about ${minutes_for_diff} minutes ago`
    } else {
        timeAgo = `just now`
    }
    return timeAgo
}

export const getDurationDescription = (stopped_at: string | null, created_at: string) => {
    if (!stopped_at) return "just now"

    let durationDescription = ""
    // calculate the duration in hours and minutes
    const duration = new Date(stopped_at).getTime() - new Date(created_at).getTime()
    const hours_duration = Math.floor(duration / (1000 * 60 * 60))
    const minutes_duration = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))


    if (hours_duration > 0) {
        if (hours_duration > 1) {
            if (minutes_duration > 1 && minutes_duration !== 0) {
                durationDescription = `${hours_duration} hours and ${minutes_duration} minutes`
            } else {
                durationDescription = `${hours_duration} hours and ${minutes_duration} minute`
            }

        } else {
            if (minutes_duration > 1 && minutes_duration !== 0) {
                durationDescription = `${hours_duration} hour and ${minutes_duration} minutes`
            } else {
                durationDescription = `${hours_duration} hour and ${minutes_duration} minute`
            }
        }
    } else if (minutes_duration > 0) {
        if (minutes_duration > 1 && minutes_duration !== 0) {
            durationDescription = `${minutes_duration} minutes`
        } else {
            durationDescription = `${minutes_duration} minute`
        }
    } else {
        durationDescription = "0 minutes"
    }

    return durationDescription
}



