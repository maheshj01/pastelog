import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../utils/firebase';

class FeatureService {
    private featureCollection = `${process.env.NEXT_PUBLIC_FIREBASE_CONFIG_COLLECTION}`;
    private bannerDocument = `${process.env.NEXT_PUBLIC_FIREBASE_FEATURE_BANNER}`;
    updateBannerState = async (show: boolean, message: string) => {
        try {
            await updateDoc(doc(db, this.featureCollection ?? 'config', this.bannerDocument ?? 'banner'), { show, message });
        } catch (error) {
        }
    };
}