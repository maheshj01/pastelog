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
        const unsubscribe = onSnapshot(doc(db, featureCollection ?? 'feature', bannerDocument ?? 'banner'),
            (doc) => {
                if (doc.exists()) {
                    const data = doc.data() as BannerState;
                    setBannerState(data);
                } else {
                }
            },
            (error) => {
            }
        );

        return () => {
            unsubscribe();
        };
    }, []);

    return bannerState;
};

export default useBannerState;