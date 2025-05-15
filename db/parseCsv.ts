// function to convert csv into json
// only run in server-side components
import csv from 'csv-parser'
import fs from 'fs'

export default async function csvParser(file: string): Promise<any[]> {
    const results: any[] = []

    return new Promise((resolve, reject) => {
         fs.createReadStream(file)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            resolve(results)
        })
        .on('error', (error) => {
            reject(error)
        })
    })
}
    
   