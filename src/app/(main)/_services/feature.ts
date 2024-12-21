import { collection, doc, getDocs, runTransaction, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../utils/firebase';

class FeatureService {
    private configCollection = collection(db, `${process.env.NEXT_PUBLIC_FIREBASE_CONFIG_COLLECTION}`);
    private bannerDocument = `${process.env.NEXT_PUBLIC_FIREBASE_FEATURE_BANNER}`;

    updateBannerState = async (show: boolean, message: string) => {
        try {
            await updateDoc(doc(this.configCollection, this.bannerDocument), {
                show,
                message,
            });
        } catch (error) {
        }
    };

    async shouldDeleteExpired(): Promise<boolean> {
        const querySnapshot = await getDocs(this.configCollection);
        const notesFeature = querySnapshot.docs.find(doc => doc.id === 'notes');
        if (notesFeature) {
            const data = notesFeature.data();
            const lastExpiryCheck = data.lastExpiryCheck?.toDate();
            if (!lastExpiryCheck || await this.isMoreThan24HoursAgo(lastExpiryCheck)) {
                // Use a transaction to ensure atomic read-write operation
                await runTransaction(db, async (transaction) => {
                    const docRef = notesFeature.ref;
                    const doc = await transaction.get(docRef);

                    if (doc.exists()) {
                        const currentData = doc.data();
                        const currentLastCheck = currentData.lastExpiryCheck?.toDate();
                        if (!currentLastCheck || await this.isMoreThan24HoursAgo(currentLastCheck)) {
                            transaction.update(docRef, {
                                lastExpiryCheck: serverTimestamp()
                            });
                            return true;
                        }
                    }
                    return false;
                });
            }
        }
        return false;
    }

    async isMoreThan24HoursAgo(date: Date): Promise<boolean> {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return date < twentyFourHoursAgo;
    }
}

export default FeatureService;