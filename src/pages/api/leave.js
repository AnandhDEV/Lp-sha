import { endpoints } from 'src/store/endpoints/endpoints'
import instance from 'src/store/endpoints/interceptor'

export default function handler(req, res) {
  // Fetch data dynamically here (e.g., using an access token)
  const data = instance.get(endpoints.getLeavePolicies)

  res.status(200).json({ data })
}
