import * as fs from 'fs/promises'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveJSONLocally = async (data: any, filename?: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataAny: any = data
    fs.mkdir('./corat-coret/temp', { recursive: true })
    const filePath = path.join("./corat-coret/temp", filename || `${uuidv4()}.json`)
    await fs.writeFile(filePath, JSON.stringify(dataAny, null, 2))
}