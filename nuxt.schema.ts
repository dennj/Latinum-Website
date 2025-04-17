import { field, group } from '@nuxt/content/preview'

export default defineNuxtSchema({
  appConfig: {
    global: group({
      title: 'Website',
      description: 'Global website configuration',
      icon: 'lucide:settings',
      fields: {
      },
    }),
    profile: group({
      title: 'Personal information',
      description: 'Personal information configuration',
      icon: 'lucide:user',
      fields: {
        name: field({
          type: 'string',
          title: 'Name',
          description: 'Dennj Osele',
          icon: 'lucide:user',
        }),
        job: field({
          type: 'string',
          title: 'Job',
          description: 'Your job.',
          icon: 'lucide:briefcase',
          default: 'AI Engineer, CTO',
        }),
        email: field({
          type: 'string',
          title: 'Email',
          description: 'Your email.',
          icon: 'lucide:mail',
          default: 'dennj.osele@gmail.com',
        }),
      },
    }),
    seo: group({
      title: 'SEO',
      description: 'SEO configuration',
      icon: 'lucide:search',
      fields: {
        title: field({
          type: 'string',
          title: 'Title',
          description: 'Title of your website (used in the preview of your website).',
          icon: 'lucide:title',
          default: 'Latinum AI',
        }),
        description: field({
          type: 'string',
          title: 'Description',
          description: 'Latinum is the middleware between AI agents and the real-world economy',
          icon: 'lucide:description',
          default: 'My website description',
        }),
        url: field({
          type: 'string',
          title: 'URL',
          description: 'Public URL of your website.',
          icon: 'lucide:link',
          default: 'https://latinum.ai',
        }),
      },
    }),
  },
})
