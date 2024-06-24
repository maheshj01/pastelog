import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import { Log } from '../_models/Log';

class FeatureService {
    private featureCollection = `${process.env.NEXT_PUBLIC_FIREBASE_FEATURE_COLLECTION}`;
    private bannerDocument = `${process.env.NEXT_PUBLIC_FIREBASE_FEATURE_BANNER}`;
    updateBannerState = async (show: boolean, message: string) => {
        try {
            await updateDoc(doc(db, this.featureCollection ?? 'feature', this.bannerDocument ?? 'banner'), { show, message });
        } catch (error) {
        }
    };
}