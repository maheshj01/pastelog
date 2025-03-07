import { User as FirebaseUser, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../utils/firebase';
import { UserService } from './UserService';
import LogService from './logService';

export class AuthService {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }
    async signInWithGoogle(): Promise<FirebaseUser> {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        await this.createOrUpdateUserInFirestore(result.user);
        const isFirstLogin = await this.isFirstTimeLogin(result.user.uid);
        if (isFirstLogin) {
            await this.handleFirstTimeLogin(result.user);
        }
        return result.user;
    }

    private async createOrUpdateUserInFirestore(user: FirebaseUser): Promise<void> {
        const userModel = {
            email: user.email!,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date(user.metadata.creationTime!),
            lastLoginAt: new Date(),
            id: user.uid
        };
        await this.userService.createOrUpdateUser(userModel);
    }
    async signOut(): Promise<void> {
        try {
            return auth.signOut();
        } catch (error) {
            console.error("Error signing out with Google", error);
        }
    }

    async isFirstTimeLogin(userId: string): Promise<boolean> {
        const hasLoggedInBefore = localStorage.getItem(`user_${userId}_has_logged_in`) === 'true';
        return !hasLoggedInBefore;
    }

    private async handleFirstTimeLogin(user: FirebaseUser): Promise<void> {
        const logService = new LogService();
        await logService.updateLogsForNewUser(user.uid);
        localStorage.setItem(`user_${user.uid}_has_logged_in`, 'true');

    }

    getCurrentUser(): FirebaseUser | null {
        return auth.currentUser;
    }

    onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
        return auth.onAuthStateChanged(callback);
    }
}