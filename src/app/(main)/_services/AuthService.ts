import { User as FirebaseUser, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../../utils/firebase';
import { User } from '../_models/User';
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
        // const isFirstLogin = await this.isFirstTimeLogin(result.user.uid);
        // if (isFirstLogin) {
        //     await this.handleFirstTimeLogin(result.user);
        // }
        return result.user;
    }

    private async createOrUpdateUserInFirestore(user: FirebaseUser): Promise<void> {
        const userModel = new User(
            user.email!,
            user.displayName,
            user.photoURL,
            new Date(user.metadata.creationTime!),
            new Date(),
            user.uid
        );
        await this.userService.createOrUpdateUser(userModel);
    }
    async signOut(): Promise<void> {
        try {
            return auth.signOut();
        } catch (error) {
            console.error("Error signing out with Google", error);
        }
    }

    private async isFirstTimeLogin(userId: string): Promise<boolean> {
        const hasLoggedInBefore = localStorage.getItem(`user_${userId}_logged_in`);
        return !hasLoggedInBefore;
    }

    private async handleFirstTimeLogin(user: FirebaseUser): Promise<void> {
        const logService = new LogService();
        await logService.updateLogsForNewUser(user.uid);
        localStorage.setItem(`user_${user.uid}_logged_in`, 'true');
    }

    getCurrentUser(): FirebaseUser | null {
        return auth.currentUser;
    }

    onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
        return auth.onAuthStateChanged(callback);
    }
}