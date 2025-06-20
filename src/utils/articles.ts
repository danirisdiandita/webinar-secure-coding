import glob from 'fast-glob'

export interface Article {
  title: string
  excerpt: string
  author: string
  date: string
  categories: {label: string, value: string, selected?: boolean}[]
  tags: {label: string, value: string, selected?: boolean}[]
  imageUrl: string 
}

export interface ArticleWithSlug extends Article {
  slug?: string
}

async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { article } = (await import(`../app/articles/${articleFilename}`)) as {
    default: React.ComponentType
    article: Article
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    ...article,
  }
}

export async function getAllArticles() {
  let articleFilenames = await glob('*/page.mdx', {
    cwd: './src/app/articles',
  })

  let articles = await Promise.all(articleFilenames.map(importArticle))

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
