import type { ArticleModel } from './article.model'
import type { InvoiceModel } from './invoice.model'

export interface InvoiceArticleModel {
  invoiceArticleId: number
  article: ArticleModel
  price: number
  discount: number
  invoiceId: number
  invoice: InvoiceModel
  articleId: number
  createdAt: string
  updatedAt: string
}
