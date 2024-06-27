// utils/Analytics.ts
import { logEvent, setUserProperties } from 'firebase/analytics';
import { analytics } from '../../../utils/firebase';

class Analytics {
    private static instance: Analytics;

    private constructor() { }

    public static getInstance(): Analytics {
        if (!Analytics.instance) {
            Analytics.instance = new Analytics();
        }
        return Analytics.instance;
    }

    public logEvent(eventName: string, eventParams?: { [key: string]: any }): void {
        if (analytics) {
            logEvent(analytics, eventName, eventParams);
        } else {
            console.log('Analytics event:', eventName, eventParams);
        }
    }

    public setUserProperty(name: string, value: string): void {
        if (analytics) {
            setUserProperties(analytics, { [name]: value });
        } else {
            console.log('Set user property:', name, value);
        }
    }

    public logPageView(page_path: string, page_title: string): void {
        this.logEvent('page_view', { page_path, page_title });
    }

    // Add more custom methods as needed
    public logButtonClick(buttonName: string): void {
        this.logEvent('button_click', { button_name: buttonName });
    }

    public logSearch(searchTerm: string): void {
        this.logEvent('search', { search_term: searchTerm });
    }

    public logThemeChange(theme: string): void {
        this.logEvent('theme_change', { theme });
    }
}

export default Analytics.getInstance();