import type { ClientModel } from './client.model'
import type { ModelModel } from './model.model'

export interface VehicleModel {
  vehicleId: number
  modelId: number
  clientId: number
  regPlate: string
  vin: string
  year: number
  model: ModelModel
  client: ClientModel
}
