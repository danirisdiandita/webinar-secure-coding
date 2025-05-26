import { ProjectSeconds } from "@/app/store/project-store"

export const sumOverDuration = (sessions: {
    id: number,
    created_at: string,
    project_id: number,
    stopped_at: string | null
}[]) => {
    let total_seconds = 0
    for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].stopped_at) {
            total_seconds += (new Date(sessions[i].stopped_at as string).getTime() - new Date(sessions[i].created_at).getTime())
        }
    }
    return Math.floor(total_seconds / 1000)
}

export const getTotalAchievedProjects = (sessions: {
    id: number,
    created_at: string,
    project_id: number,
    stopped_at: string | null
}[], projects: {
    id: number,
    name: string,
    target_minutes: number,
}[]) => {

    const project2TargetMinutesMap: {
        [key: number]: number
    } = {}

    for (let i = 0; i < projects.length; i++) {
        project2TargetMinutesMap[projects[i].id] = projects[i].target_minutes
    }


    const project2TotalSecondsMap: {
        [key: number]: number
    } = {}

    for (let i = 0; i < sessions.length; i++) {
        project2TotalSecondsMap[sessions[i].project_id] = (project2TotalSecondsMap[sessions[i].project_id] || 0) + Math.floor((sessions[i].stopped_at ? (new Date(sessions[i].stopped_at as string).getTime() - new Date(sessions[i].created_at).getTime()) : 0) / 1000)
    }

    let total_achieved_projects = 0

    for (let i = 0; i < projects.length; i++) {
        const total_seconds = project2TotalSecondsMap[projects[i].id] ? project2TotalSecondsMap[projects[i].id] : 0
        const target_minutes = project2TargetMinutesMap[projects[i].id] ? project2TargetMinutesMap[projects[i].id] : 0

        if (Math.floor(total_seconds / 60) >= target_minutes && target_minutes > 0) {
            total_achieved_projects++
        }
    }

    return total_achieved_projects
}

const getRandomColor = (idx?: number) => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#33FFF5"];
    if (idx !== undefined && idx < colors.length) {
        return colors[idx]
    }
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
};

export const getProjectTotalSeconds = (sessions: {
    id: number,
    created_at: string,
    project_id: number,
    stopped_at: string | null
}[], projects: {
    id: number,
    name: string,
    target_minutes: number,
}[]) => {
    const project2TotalSecondsMap: {
        [key: number]: number
    } = {}

    const projectId2NameMap: {
        [key: number]: string
    } = {}

    for (let i = 0; i < projects.length; i++) {
        projectId2NameMap[projects[i].id] = projects[i].name
    }

    for (let i = 0; i < sessions.length; i++) {
        project2TotalSecondsMap[sessions[i].project_id] = (project2TotalSecondsMap[sessions[i].project_id] || 0) + Math.floor((sessions[i].stopped_at ? (new Date(sessions[i].stopped_at as string).getTime() - new Date(sessions[i].created_at).getTime()) : 0) / 1000)
    }

    const output: ProjectSeconds[] = []

    let idx = 0
    for (const project_id in project2TotalSecondsMap) {
        const total_seconds = project2TotalSecondsMap[project_id]
        const name = projectId2NameMap[project_id]
        const randomColor = getRandomColor(idx)
        output.push({
            projectId: parseInt(project_id),
            projectName: name + "  ",
            totalSeconds: total_seconds,
            fill: randomColor
        })
        idx++
    }
    return output
}