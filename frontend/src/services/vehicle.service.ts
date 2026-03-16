import { MainService } from './main.service'

export class VehicleService {
  static async getVehicleByClientId(id: number, search: string = '') {
    return await MainService.useAxios(`/vehicle/client/${id}?search=${search}`)
  }

  static async getVehicleById(id: number) {
    return await MainService.useAxios(`/vehicle/${id}`)
  }

  static async getVehicleModels() {
    return await MainService.useAxios('/model')
  }

  static async createVehicle(model: any) {
    return await MainService.useAxios('/vehicle', 'post', model)
  }

  static async updateVehicle(id: number, model: any) {
    return await MainService.useAxios(`/vehicle/${id}`, 'put', model)
  }

  static async deleteVehicle(id: number) {
    return await MainService.useAxios(`/vehicle/${id}`, 'delete')
  }
}
