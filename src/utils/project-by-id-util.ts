
// import { SessionActivityCalendar } from "@/app/store/project-store"

import { getStartOfWeek } from "./date_util";

// const data = {
//     "project": {
//         "id": 1,
//         "name": "Side Hustles",
//         "description": "This is my side hustles tracker",
//         "target_minutes": 120,
//         "weekday": "[0,1,2,3,4,5,6]"
//     },
//     "sessions": [
//         {
//             "id": 1,
//             "created_at": "2025-01-29T05:43:21.051Z",
//             "stopped_at": "2025-01-29T05:50:44.894Z"
//         },
//         {
//             "id": 2,
//             "created_at": "2025-01-29T06:20:33.491Z",
//             "stopped_at": "2025-01-29T06:51:50.270Z"
//         },
//         {
//             "id": 3,
//             "created_at": "2025-01-29T10:20:41.367Z",
//             "stopped_at": "2025-01-29T10:22:44.774Z"
//         },
//         {
//             "id": 4,
//             "created_at": "2025-01-29T10:29:37.136Z",
//             "stopped_at": "2025-01-29T10:40:47.082Z"
//         },
//         {
//             "id": 5,
//             "created_at": "2025-01-29T12:50:42.830Z",
//             "stopped_at": "2025-01-29T13:01:38.021Z"
//         },
//         {
//             "id": 6,
//             "created_at": "2025-01-29T13:34:42.976Z",
//             "stopped_at": "2025-01-29T15:41:40.989Z"
//         },
//         {
//             "id": 9,
//             "created_at": "2025-01-29T22:20:14.794Z",
//             "stopped_at": null
//         }
//     ]
// }



export interface ProjectSessionInput {
    project: {
        id: number,
        name: string,
        description: string,
        target_minutes: number,
        weekday: number[]
    },
    sessions: {
        id: number,
        created_at: string,
        stopped_at: string | null
    }[]
}

export const padZero = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
}


export const getSessionActivity = (data: ProjectSessionInput, year: number | "latest") => {

    const target_minutes = data.project.target_minutes

    const now = new Date()
    let one_year_ago = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    // if year is "latest", set today as the last day and reduce to 365 days ago
    const sessions = year === "latest" ? [...data.sessions]
        .filter((session) => new Date(session.created_at).getTime() >= one_year_ago.getTime()).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        : [...data.sessions]
            .filter((session) => new Date(session.created_at).getFullYear() === year)
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    const date_aggregation_dict: { [key: string]: number } = {};
    for (let i = 0; i < sessions.length; i++) {
        const date_ = new Date(sessions[i].created_at)
        const date_string = `${date_.getFullYear()}-${padZero(date_.getMonth() + 1)}-${padZero(date_.getDate())}`
        const stopped_at = sessions[i].stopped_at ? new Date(sessions[i].stopped_at as string) : new Date(sessions[i].created_at)
        // const count = Math.floor(((stopped_at.getTime() - date_.getTime()) / (1000 * 60)) * 4 / target_minutes)

        const total_minutes_in_a_day = Math.floor(((stopped_at.getTime() - date_.getTime()) / (1000 * 60)))

        date_aggregation_dict[date_string] = date_aggregation_dict[date_string] || 0
        date_aggregation_dict[date_string] += total_minutes_in_a_day
    }


    let session_activity = []

    // padding start of the activity and the end of the activity (for latest, it is now and one year ago)
    // for specific year, it is 1st of January and the last day of the year, for chosing year, you don't need to pad through weekly boundary


    if (year === "latest") {
        const now_day = `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())}`
        date_aggregation_dict[now_day] = date_aggregation_dict[now_day] || 0 // padding for default 
        one_year_ago = new Date(getStartOfWeek(one_year_ago).getTime() - 24 * 60 * 60 * 1000)
        const one_year_ago_day = `${one_year_ago.getFullYear()}-${padZero(one_year_ago.getMonth() + 1)}-${padZero(one_year_ago.getDate())}`
        date_aggregation_dict[one_year_ago_day] = date_aggregation_dict[one_year_ago_day] || 0 // padding for default
    } else {
        const start_of_year = `${year}-01-01`
        date_aggregation_dict[start_of_year] = date_aggregation_dict[start_of_year] || 0 // padding for default 
        const end_of_year = `${year}-12-31`
        date_aggregation_dict[end_of_year] = date_aggregation_dict[end_of_year] || 0 // padding for default
    }
    for (const [key, value] of Object.entries(date_aggregation_dict)) {
        const level = Math.min(4, Math.floor(value * 4 / target_minutes))
        session_activity.push({
            date: key,
            count: value,
            level: level
        })
    }

    session_activity = session_activity.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // const count = Math.floor(((stopped_at.getTime() - date_.getTime()) / (1000 * 60)) * 4 / target_minutes)
    return session_activity
}

// const res = getSessionActivity(data, 2025)
// console.log(res)


export const totalHoursStringInSessionActivity = (data: {
    date: string,
    count: number,
    level: number
}[]) => {

    const totalByYear: { [key: string]: number } = {}
    data.forEach((item) => {
        // total += item.count
        const year = item.date.split("-")[0]
        totalByYear[year] = totalByYear[year] || 0
        totalByYear[year] += item.count

    })

    const totalHHMM: { [key: string]: string } = {}
    for (const [key, value] of Object.entries(totalByYear)) {
        const hours = Math.floor(value / 60)
        const minutes = value % 60
        if (hours === 0) {
            totalHHMM[key] = `${minutes} minutes`
        } else if (hours === 1) {
            totalHHMM[key] = `${hours} hour and ${minutes} minutes`
        } else {
            totalHHMM[key] = `${hours} hours and ${minutes} minutes`
        }
    }

    let string_activity = '';
    for (const [key, value] of Object.entries(totalHHMM)) {
        string_activity += `${value} in ${key}.\n`
    }

    return string_activity
}



export const getListOfYearsForSessionActivity = (data: {
    id: string,
    created_at: string,
    stopped_at: string | null
}[]) => {
    const years: Set<number | "latest"> = new Set(data.map((item) => new Date(item.created_at).getFullYear()))
    years.add("latest")
    return Array.from(years)
}


export const getMonthlyTargetCount = (data: {
    project_id?: number,
    id?: string,
    created_at: string,
    stopped_at: string | null
}[], target: number, weekDaysSelection: string) => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const sessionsInCurrentMonth = data.filter((item) => new Date(item.created_at).getMonth() === currentMonth && new Date(item.created_at).getFullYear() === currentYear)

    const totalHourPerDayMap: { [key: string]: number } = {}

    for (let i = 0; i < sessionsInCurrentMonth.length; i++) {
        const date_ = new Date(sessionsInCurrentMonth[i].created_at)
        const date_string = `${date_.getFullYear()}-${padZero(date_.getMonth() + 1)}-${padZero(date_.getDate())}`
        const stopped_at = sessionsInCurrentMonth[i].stopped_at ? new Date(sessionsInCurrentMonth[i].stopped_at as string) : new Date(sessionsInCurrentMonth[i].created_at)
        const totalMinutes = Math.floor(((stopped_at.getTime() - date_.getTime()) / (1000 * 60)))
        totalHourPerDayMap[date_string] = totalHourPerDayMap[date_string] || 0
        totalHourPerDayMap[date_string] += totalMinutes
    }

    let totalCount = 0

    for (const [key, value] of Object.entries(totalHourPerDayMap)) {
        if (value >= target && JSON.parse(weekDaysSelection).includes(new Date(key).getDay())) {
            totalCount += 1
        }
    }
    return totalCount
}

export const getTotalDaysInCurrentMonth = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    return new Date(currentYear, currentMonth + 1, 0).getDate()
}


export const getTotalStreaks = (data: {
    project_id?: number,
    id?: string,
    created_at: string,
    stopped_at: string | null,
}[], target_minutes: number, weekDaysSelection: string) => {
    // grouping by days 

    const totalHourPerDayMap: { [key: string]: number } = {}

    let min_date_ = new Date()
    const start_of_today = new Date(new Date().setHours(0, 0, 0, 0))
    for (let i = 0; i < data.length; i++) {
        const date_ = new Date(data[i].created_at)
        if (date_.getTime() < min_date_.getTime()) {
            min_date_ = date_
        }
        const date_string = `${date_.getFullYear()}-${padZero(date_.getMonth() + 1)}-${padZero(date_.getDate())}`
        const stopped_at = data[i].stopped_at ? new Date(data[i].stopped_at as string) : new Date(data[i].created_at)
        const totalMinutes = Math.floor(((stopped_at.getTime() - date_.getTime()) / (1000 * 60)))
        totalHourPerDayMap[date_string] = totalHourPerDayMap[date_string] || 0
        totalHourPerDayMap[date_string] += totalMinutes
    }

    const weekdays = JSON.parse(weekDaysSelection)
    let streaks = 0 // streaks = 1 if the previous day a user successfully finished more than or equal to specific target minutes
    for (let d = new Date(min_date_.getFullYear(), min_date_.getMonth(), min_date_.getDate(), 0, 0, 0, 0); d.getTime() <= start_of_today.getTime(); d.setDate(d.getDate() + 1)) {
        const date_string = `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`
        const total_minutes_current = totalHourPerDayMap[date_string] || 0
        if (weekdays.includes(d.getDay())) {
            if (total_minutes_current >= target_minutes) {
                streaks += 1
            } else if (total_minutes_current < target_minutes && d.getTime() !== start_of_today.getTime()) {
                streaks = 0
            }
        }
    }
    return streaks

}


export const calculatingMissedDays = (sessionData: {
    project_id?: number,
    id?: string,
    created_at: string,
    stopped_at: string | null,
}[], target_minutes: number, weekDaysSelection: string) => {
    const weekDays = JSON.parse(weekDaysSelection)

    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const startOfWeek = getStartOfWeek(now)
    // const endOfWeek = getOneSecondBeforeEndOfWeek(now)

    // group by day
    const totalHourPerDayMap: { [key: string]: number } = {}

    for (let i = 0; i < sessionData.length; i++) {
        const date_ = new Date(sessionData[i].created_at)
        const date_string = `${date_.getFullYear()}-${padZero(date_.getMonth() + 1)}-${padZero(date_.getDate())}`
        const stopped_at = sessionData[i].stopped_at ? new Date(sessionData[i].stopped_at as string) : new Date(sessionData[i].created_at)
        const totalMinutes = Math.floor(((stopped_at.getTime() - date_.getTime()) / (1000 * 60)))
        totalHourPerDayMap[date_string] = totalHourPerDayMap[date_string] || 0
        totalHourPerDayMap[date_string] += totalMinutes
    }

    let missed_days = 0

    for (let d = new Date(startOfWeek); d.getTime() < now.getTime(); d.setDate(d.getDate() + 1)) {
        if (weekDays.includes(d.getDay())) {
            const total_minutes_work = totalHourPerDayMap[`${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`] = totalHourPerDayMap[`${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`] || 0

            if (total_minutes_work < target_minutes) {
                missed_days += 1
            }
        }
    }

    return missed_days
}



// SESSION HISTORY 

// session_history = [
//     {
//         "id": 22,
//         "created_at": "2025-02-01T15:45:57.997Z",
//         "updated_at": "2025-02-01T15:45:57.997Z",
//         "user_id": 1,
//         "description": "Daily work",
//         "project_id": 1,
//         "stopped_at": null
//     },
//     {
//         "id": 21,
//         "created_at": "2025-02-01T14:45:14.102Z",
//         "updated_at": "2025-02-01T14:59:25.477Z",
//         "user_id": 1,
//         "description": "session section",
//         "project_id": 1,
//         "stopped_at": "2025-02-01T14:59:25.474Z"
//     },
//     {
//         "id": 20,
//         "created_at": "2025-02-01T14:11:53.970Z",
//         "updated_at": "2025-02-01T14:24:10.549Z",
//         "user_id": 1,
//         "description": "Working on the last session",
//         "project_id": 1,
//         "stopped_at": "2025-02-01T14:24:10.449Z"
//     },
//     {
//         "id": 19,
//         "created_at": "2025-02-01T10:31:14.029Z",
//         "updated_at": "2025-02-01T11:25:29.711Z",
//         "user_id": 1,
//         "description": "working on target streaks",
//         "project_id": 1,
//         "stopped_at": "2025-02-01T11:25:29.709Z"
//     },
//     {
//         "id": 18,
//         "created_at": "2025-02-01T09:39:43.444Z",
//         "updated_at": "2025-02-01T10:00:30.306Z",
//         "user_id": 1,
//         "description": "Working on target streaks",
//         "project_id": 1,
//         "stopped_at": "2025-02-01T10:00:30.286Z"
//     }
// ]

export const parseSessionHistory = (session_history: {
    id: number,
    created_at: string,
    updated_at: string,
    user_id: number,
    description: string,
    project_id: number,
    stopped_at: string | null
}[]) => {

    const session_history_: {
        durationDescription: string,
        timeAgoDescription: string,
        date: string,
        description: string,
        id: number,
    }[] = []

    for (let i = 0; i < session_history.length; i++) {
        const session_ = session_history[i]
        if (session_.stopped_at) {
            // do something only when stopped_at is not null
            const date_ = new Date(session_.stopped_at as string)
            const creation_date = new Date(session_.created_at)
            const now = new Date()

            // calculate difference between now and the date of creation 
            const difference_ = now.getTime() - date_.getTime()
            const hours_for_diff = Math.floor(difference_ / (1000 * 60 * 60))
            const minutes_for_diff = Math.floor((difference_ % (1000 * 60 * 60)) / (1000 * 60))

            let timeAgo = ""

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


            let durationDescription = ""
            // let timeAgoDescription = ""

            // calculate the duration in hours and minutes
            const duration = new Date(session_.stopped_at).getTime() - new Date(session_.created_at).getTime()
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

            session_history_.push({
                durationDescription: durationDescription,
                timeAgoDescription: timeAgo,
                date: creation_date.toLocaleDateString(),
                description: session_.description,
                id: session_.id,
            })
        }
    }

    return session_history_

}