'use server'

import { auth } from '@clerk/nextjs/server';

export async function getAuthToken() {
    try {
        const { getToken } = auth();
        const token = await getToken();
        if (!token) {
            throw new Error('No authentication token available');
        }
        return token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        throw error;
    }
}