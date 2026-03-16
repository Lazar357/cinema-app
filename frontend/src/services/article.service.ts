import { MainService } from './main.service'

export class ArticleService {
  static async getArticles(search: string = '') {
    return await MainService.useAxios(`/article?search=${search}`)
  }

  static async getArticleById(id: number) {
    return await MainService.useAxios(`/article/${id}`)
  }

  static async createArticle(model: any) {
    return await MainService.useAxios(`/article`, 'post', model)
  }

  static async updateArticle(id: number, model: any) {
    return await MainService.useAxios(`/article/${id}`, 'put', model)
  }

  static async deleteArticle(id: number) {
    return await MainService.useAxios(`/article/${id}`, 'delete')
  }
}
