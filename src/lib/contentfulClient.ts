import { createClient } from 'contentful';

// Initialize the Contentful client
const contentfulClient = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID as string,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN as string,
    environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master',
});

export default contentfulClient;
