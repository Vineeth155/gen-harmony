// schemas/audio.js
export const audio = {
  name: 'audio',
  title: 'Audio',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'audioUrl',
      title: 'Audio URL',
      type: 'url', // You can store the URL of the uploaded audio here
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'generatedAt',
      title: 'Generated At',
      type: 'datetime',
    },
    {
      name: 'generationTime',
      title: 'Generation Time (seconds)',
      type: 'number',
    },
    {
      name: 'userId',
      title: 'User ID',
      type: 'string',
    },
    {
      name: 'userMail',
      title: 'User Mail',
      type: 'string',
    },
  ],
}
