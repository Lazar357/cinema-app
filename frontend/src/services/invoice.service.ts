import { MainService } from './main.service'

export class InvoiceService {
  static async getInvoicesForVehicleId(id: number) {
    return await MainService.useAxios(`/invoice/vehicle/${id}`)
  }

  static async getInvoiceDetailsById(id: number) {
    return await MainService.useAxios(`/invoice/${id}/details`)
  }

  static async getInvoiceArticleDetailsById(id: number) {
    return await MainService.useAxios(`/invoice/article/${id}/details`)
  }
}
