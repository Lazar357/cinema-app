import { MainService } from './main.service'

export class ClientService {
  static async getClients(search: string = '') {
    return await MainService.useAxios(`/client?search=${search}`)
  }

  static async getClientById(id: number) {
    return await MainService.useAxios(`/client/${id}`)
  }

  static async createClient(model: any) {
    return await MainService.useAxios('/client', 'post', model)
  }

  static async updateClient(id: number, data: any) {
    return await MainService.useAxios(`/client/${id}`, 'put', data)
  }

  static async deleteClient(id: number) {
    return await MainService.useAxios(`/client/${id}`, 'delete')
  }
}
