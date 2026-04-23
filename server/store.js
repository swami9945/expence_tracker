import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInitialData } from './seed.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDirectory = path.join(__dirname, 'data')
const dataFile = path.join(dataDirectory, 'finance.json')

export async function readStore() {
  await mkdir(dataDirectory, { recursive: true })

  try {
    const rawData = await readFile(dataFile, 'utf8')
    return JSON.parse(rawData)
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }

    const initialData = createInitialData()
    await writeStore(initialData)
    return initialData
  }
}

export async function writeStore(data) {
  await mkdir(dataDirectory, { recursive: true })
  await writeFile(dataFile, JSON.stringify(data, null, 2))
  return data
}
