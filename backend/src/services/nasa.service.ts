import { cached } from '../lib/redis'

const NASA_API_KEY = process.env.NASA_API_KEY ?? 'DEMO_KEY'
const NASA_BASE    = 'https://api.nasa.gov'

export class NasaService {
  /** Astronomy Picture of the Day — cached 1 hour */
  async getApod() {
    return cached('nasa:apod', 3600, async () => {
      const res = await fetch(`${NASA_BASE}/planetary/apod?api_key=${NASA_API_KEY}`)
      if (!res.ok) throw new Error(`NASA API error: ${res.status}`)
      return res.json()
    })
  }

  /** Mars Rover Photos — cached 10 minutes */
  async getMarsPhotos(sol = 1000) {
    return cached(`nasa:mars:${sol}`, 600, async () => {
      const url = `${NASA_BASE}/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&api_key=${NASA_API_KEY}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`NASA API error: ${res.status}`)
      return res.json()
    })
  }

  /** Near Earth Objects — cached 15 minutes */
  async getNeoFeed(startDate: string, endDate: string) {
    return cached(`nasa:neo:${startDate}:${endDate}`, 900, async () => {
      const url = `${NASA_BASE}/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`NASA API error: ${res.status}`)
      return res.json()
    })
  }
}
