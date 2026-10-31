export interface Event {
  id: number
  name: string
  location: string
  price: number
  description: string
  capacity: number
  image_url: string | null
  user_id: number
}