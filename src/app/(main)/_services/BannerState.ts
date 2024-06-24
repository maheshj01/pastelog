// useBannerState.ts
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../../utils/firebase';

interface BannerState {
    show: boolean;
    message: string;
}

export const useBannerState = () => {
    const [bannerState, setBannerState] = useState<BannerState>({ show: false, message: '' });
    const featureCollection = `${process.env.NEXT_PUBLIC_FIREBASE_FEATURE_COLLECTION}`;
    const bannerDocument = `${process.env.NEXT_PUBLIC_FIREBASE_FEATURE_BANNER}`;
    useEffect(() => {
        console.log('Setting up Firestore listener for banner state');
        const unsubscribe = onSnapshot(doc(db, featureCollection ?? 'feature', bannerDocument ?? 'banner'),
            (doc) => {
                console.log('Received Firestore update:', doc.data());
                if (doc.exists()) {
                    const data = doc.data() as BannerState;
                    console.log('Updating banner state:', data);
                    setBannerState(data);
                } else {
                    console.log('Banner document does not exist');
                }
            },
            (error) => {
                console.error('Error listening to banner state:', error);
            }
        );

        return () => {
            console.log('Unsubscribing from Firestore listener');
            unsubscribe();
        };
    }, []);

    return bannerState;
};

export default useBannerState;