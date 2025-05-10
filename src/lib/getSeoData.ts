import { API_BASE_URL } from "./apiConfig";

export async function getSeoData() {
    try {
        const response = await fetch(`${API_BASE_URL}/landing/home/seo`, {
            headers: { 'Content-Type': 'application/json', lang: 'ar' },
            cache: 'no-store', // Ensures fresh data every request
        });

        if (!response.ok) throw new Error('Failed to fetch SEO data');

        const seoData = await response.json();        
        return seoData?.data;
    } catch (error) {
        console.error('Error fetching SEO data:', error);
        return null;
    }

}
