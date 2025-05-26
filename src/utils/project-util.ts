import { calculatingMissedDays, getMonthlyTargetCount, getTotalStreaks } from "./project-by-id-util"


export const sessionsStatsCalc = (sessions: {
    project_id: number,
    created_at: string,
    stopped_at: string | null,
}[], projects: {
    id: number,
    name: string,
    created_at: Date,
    updated_at: Date,
    user_id: number,
    description: string,
    target_minutes: number,
    weekday: string
}[]) => {

    // project to target minutes and week days map 


    const project2TargetMinutesMap: {
        [key: number]: {
            target_minutes: number,
            weekDays: string
        }
    } = {}


    for (let i = 0; i < projects.length; i++) {
        project2TargetMinutesMap[projects[i].id] ={
            target_minutes: projects[i].target_minutes,
            weekDays: projects[i].weekday
        }
    }

    const project2SessionsMap: {
        [key: number]: {
            project_id: number,
            created_at: string,
            stopped_at: string | null,
        }[]
    } = {}

    // initialisation for project in which doesn't have any session
    for (let i = 0; i < projects.length; i++) {
        project2SessionsMap[projects[i].id] = []
    }

    for (let i = 0; i < sessions.length; i++) {
        const project_id = sessions[i].project_id
        project2SessionsMap[project_id] = project2SessionsMap[project_id] || []
        project2SessionsMap[project_id].push({
            project_id: project_id,
            created_at: sessions[i].created_at,
            stopped_at: sessions[i].stopped_at
        })
    }


    const projectStats: {
        [key: number]: {
            monthlyAchievementCount: number,
            targetStreaksCount: number,
            missedDays: {
                count: number,
                from: number
            },
            weekDays: string[],
            targetHours: number, 
            targetMinutes: number
        }
    } = {}


    for (const project_id in project2SessionsMap) {
        const projectSessionPerProject = project2SessionsMap[project_id] || []

        const missedDays = calculatingMissedDays(projectSessionPerProject, 
            project2TargetMinutesMap[project_id].target_minutes, 
           project2TargetMinutesMap[project_id].weekDays
        )

        const totalStreaks = getTotalStreaks(projectSessionPerProject, 
            project2TargetMinutesMap[project_id].target_minutes, 
            project2TargetMinutesMap[project_id].weekDays
        )

        const monthlyTargetCount = getMonthlyTargetCount(projectSessionPerProject, 
            project2TargetMinutesMap[project_id].target_minutes, 
            project2TargetMinutesMap[project_id].weekDays
        )

        projectStats[project_id] = {
            monthlyAchievementCount: monthlyTargetCount,
            targetStreaksCount: totalStreaks,
            missedDays: {
                count: missedDays,
                from: JSON.parse(project2TargetMinutesMap[project_id].weekDays).length
            },
            weekDays:JSON.parse(project2TargetMinutesMap[project_id].weekDays),
            targetHours: project2TargetMinutesMap[project_id].target_minutes / 60,
            targetMinutes: project2TargetMinutesMap[project_id].target_minutes
        }

        // projectSessions = projectSessions.concat(project2SessionsMap[project_id])
    }

    return projectStats
}