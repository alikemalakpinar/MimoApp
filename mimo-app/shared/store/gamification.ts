// shared/store/gamification.ts - Gamification state management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Badge definitions
export type BadgeId =
  | 'first_journal' | 'journal_streak_7' | 'journal_streak_30'
  | 'first_mood' | 'mood_master' | 'mood_streak_14'
  | 'first_test' | 'test_explorer' | 'test_master'
  | 'first_session' | 'therapy_committed' | 'therapy_veteran'
  | 'mindful_beginner' | 'mindful_master' | 'zen_warrior'
  | 'early_bird' | 'night_owl' | 'consistent_user'
  | 'social_butterfly' | 'helpful_friend' | 'community_star';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  category: 'journal' | 'mood' | 'tests' | 'therapy' | 'mindfulness' | 'social' | 'special';
  requirement: number;
  points: number;
  unlockedAt?: Date;
}

export const BADGES: Badge[] = [
  // Journal badges
  { id: 'first_journal', name: 'Kalem Ustası', description: 'İlk günlük girişini yaz', icon: 'edit-3', category: 'journal', requirement: 1, points: 50 },
  { id: 'journal_streak_7', name: 'Düşünce Gezgini', description: '7 gün üst üste günlük yaz', icon: 'book-open', category: 'journal', requirement: 7, points: 150 },
  { id: 'journal_streak_30', name: 'Hikaye Anlatıcısı', description: '30 gün üst üste günlük yaz', icon: 'award', category: 'journal', requirement: 30, points: 500 },

  // Mood tracking badges
  { id: 'first_mood', name: 'Duygu Farkındalığı', description: 'İlk ruh hali kaydını yap', icon: 'smile', category: 'mood', requirement: 1, points: 30 },
  { id: 'mood_master', name: 'Duygu Ustası', description: '50 ruh hali kaydı yap', icon: 'heart', category: 'mood', requirement: 50, points: 200 },
  { id: 'mood_streak_14', name: 'Tutarlı Takipçi', description: '14 gün üst üste ruh hali kaydet', icon: 'trending-up', category: 'mood', requirement: 14, points: 250 },

  // Test badges
  { id: 'first_test', name: 'Keşifçi', description: 'İlk psikolojik testini tamamla', icon: 'clipboard', category: 'tests', requirement: 1, points: 75 },
  { id: 'test_explorer', name: 'İç Dünya Kâşifi', description: '5 farklı test tamamla', icon: 'compass', category: 'tests', requirement: 5, points: 200 },
  { id: 'test_master', name: 'Öz Bilgi Ustası', description: '10 test tamamla', icon: 'star', category: 'tests', requirement: 10, points: 400 },

  // Therapy badges
  { id: 'first_session', name: 'İlk Adım', description: 'İlk terapi seansına katıl', icon: 'users', category: 'therapy', requirement: 1, points: 100 },
  { id: 'therapy_committed', name: 'Kararlı Yolcu', description: '5 terapi seansı tamamla', icon: 'target', category: 'therapy', requirement: 5, points: 300 },
  { id: 'therapy_veteran', name: 'Terapi Kahramanı', description: '20 terapi seansı tamamla', icon: 'shield', category: 'therapy', requirement: 20, points: 750 },

  // Mindfulness badges
  { id: 'mindful_beginner', name: 'Huzur Arayışı', description: 'İlk meditasyonunu tamamla', icon: 'sun', category: 'mindfulness', requirement: 1, points: 50 },
  { id: 'mindful_master', name: 'İç Huzur', description: '25 meditasyon tamamla', icon: 'moon', category: 'mindfulness', requirement: 25, points: 350 },
  { id: 'zen_warrior', name: 'Zen Savaşçısı', description: '100 dakika meditasyon yap', icon: 'zap', category: 'mindfulness', requirement: 100, points: 500 },

  // Social badges
  { id: 'social_butterfly', name: 'Sosyal Kelebek', description: 'İlk yolculuk gönderini paylaş', icon: 'share-2', category: 'social', requirement: 1, points: 75 },
  { id: 'helpful_friend', name: 'Yardımsever Dost', description: '10 gönderiye destek ol', icon: 'thumbs-up', category: 'social', requirement: 10, points: 200 },
  { id: 'community_star', name: 'Topluluk Yıldızı', description: '50 etkileşim al', icon: 'star', category: 'social', requirement: 50, points: 400 },

  // Special badges
  { id: 'early_bird', name: 'Erken Kuş', description: 'Sabah 6-8 arası giriş yap', icon: 'sunrise', category: 'special', requirement: 5, points: 100 },
  { id: 'night_owl', name: 'Gece Kuşu', description: 'Gece 22-00 arası meditasyon yap', icon: 'moon', category: 'special', requirement: 5, points: 100 },
  { id: 'consistent_user', name: 'Sadık Kullanıcı', description: '30 gün uygulamayı kullan', icon: 'calendar', category: 'special', requirement: 30, points: 600 },
];

// Level definitions
export interface Level {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
  color: string;
}

export const LEVELS: Level[] = [
  { level: 1, name: 'Başlangıç', minPoints: 0, maxPoints: 100, icon: 'circle', color: '#A0AEC0' },
  { level: 2, name: 'Keşifçi', minPoints: 100, maxPoints: 300, icon: 'compass', color: '#68D391' },
  { level: 3, name: 'Gezgin', minPoints: 300, maxPoints: 600, icon: 'map', color: '#4FD1C5' },
  { level: 4, name: 'Yolcu', minPoints: 600, maxPoints: 1000, icon: 'navigation', color: '#63B3ED' },
  { level: 5, name: 'Kaşif', minPoints: 1000, maxPoints: 1500, icon: 'flag', color: '#B794F4' },
  { level: 6, name: 'Usta', minPoints: 1500, maxPoints: 2200, icon: 'award', color: '#F687B3' },
  { level: 7, name: 'Uzman', minPoints: 2200, maxPoints: 3000, icon: 'star', color: '#FBD38D' },
  { level: 8, name: 'Bilge', minPoints: 3000, maxPoints: 4000, icon: 'sun', color: '#FC8181' },
  { level: 9, name: 'Aydınlanmış', minPoints: 4000, maxPoints: 5500, icon: 'zap', color: '#F6AD55' },
  { level: 10, name: 'Efsane', minPoints: 5500, maxPoints: Infinity, icon: 'crown', color: '#FFD700' },
];

interface GamificationState {
  // Points & Level
  totalPoints: number;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;

  // Badges
  unlockedBadges: BadgeId[];

  // Progress tracking
  journalCount: number;
  moodCount: number;
  testCount: number;
  sessionCount: number;
  meditationMinutes: number;
  socialPosts: number;
  socialInteractions: number;
  earlyBirdCount: number;
  nightOwlCount: number;
  daysActive: number;

  // Daily challenges
  dailyChallengeCompleted: boolean;
  dailyChallengeDate: string | null;
}

interface GamificationActions {
  // Point actions
  addPoints: (points: number) => void;

  // Streak actions
  updateStreak: () => void;

  // Badge actions
  checkAndUnlockBadges: () => BadgeId[];
  unlockBadge: (badgeId: BadgeId) => void;

  // Progress actions
  incrementJournal: () => void;
  incrementMood: () => void;
  incrementTest: () => void;
  incrementSession: () => void;
  addMeditationMinutes: (minutes: number) => void;
  incrementSocialPost: () => void;
  incrementSocialInteraction: () => void;
  incrementEarlyBird: () => void;
  incrementNightOwl: () => void;

  // Daily challenge
  completeDailyChallenge: () => void;

  // Utility
  getCurrentLevel: () => Level;
  getNextLevel: () => Level | null;
  getLevelProgress: () => number;
  reset: () => void;
}

const initialState: GamificationState = {
  totalPoints: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  unlockedBadges: [],
  journalCount: 0,
  moodCount: 0,
  testCount: 0,
  sessionCount: 0,
  meditationMinutes: 0,
  socialPosts: 0,
  socialInteractions: 0,
  earlyBirdCount: 0,
  nightOwlCount: 0,
  daysActive: 0,
  dailyChallengeCompleted: false,
  dailyChallengeDate: null,
};

export const useGamification = create<GamificationState & GamificationActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addPoints: (points: number) => {
        set((state) => ({ totalPoints: state.totalPoints + points }));
      },

      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastActiveDate, currentStreak, longestStreak, daysActive } = get();

        if (lastActiveDate === today) return; // Already updated today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = currentStreak;
        if (lastActiveDate === yesterdayStr) {
          newStreak = currentStreak + 1;
        } else if (lastActiveDate !== today) {
          newStreak = 1; // Reset streak
        }

        set({
          currentStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
          lastActiveDate: today,
          daysActive: daysActive + 1,
        });
      },

      checkAndUnlockBadges: () => {
        const state = get();
        const newlyUnlocked: BadgeId[] = [];

        BADGES.forEach((badge) => {
          if (state.unlockedBadges.includes(badge.id)) return;

          let progress = 0;
          switch (badge.id) {
            case 'first_journal':
            case 'journal_streak_7':
            case 'journal_streak_30':
              progress = badge.id === 'first_journal' ? state.journalCount : state.currentStreak;
              break;
            case 'first_mood':
            case 'mood_master':
              progress = state.moodCount;
              break;
            case 'mood_streak_14':
              progress = state.currentStreak;
              break;
            case 'first_test':
            case 'test_explorer':
            case 'test_master':
              progress = state.testCount;
              break;
            case 'first_session':
            case 'therapy_committed':
            case 'therapy_veteran':
              progress = state.sessionCount;
              break;
            case 'mindful_beginner':
              progress = state.meditationMinutes > 0 ? 1 : 0;
              break;
            case 'mindful_master':
              progress = Math.floor(state.meditationMinutes / 10); // Sessions
              break;
            case 'zen_warrior':
              progress = state.meditationMinutes;
              break;
            case 'social_butterfly':
              progress = state.socialPosts;
              break;
            case 'helpful_friend':
            case 'community_star':
              progress = state.socialInteractions;
              break;
            case 'early_bird':
              progress = state.earlyBirdCount;
              break;
            case 'night_owl':
              progress = state.nightOwlCount;
              break;
            case 'consistent_user':
              progress = state.daysActive;
              break;
          }

          if (progress >= badge.requirement) {
            newlyUnlocked.push(badge.id);
            get().unlockBadge(badge.id);
          }
        });

        return newlyUnlocked;
      },

      unlockBadge: (badgeId: BadgeId) => {
        const badge = BADGES.find((b) => b.id === badgeId);
        if (!badge) return;

        set((state) => ({
          unlockedBadges: [...state.unlockedBadges, badgeId],
          totalPoints: state.totalPoints + badge.points,
        }));
      },

      incrementJournal: () => {
        set((state) => ({ journalCount: state.journalCount + 1 }));
        get().updateStreak();
        get().addPoints(10);
        get().checkAndUnlockBadges();
      },

      incrementMood: () => {
        set((state) => ({ moodCount: state.moodCount + 1 }));
        get().updateStreak();
        get().addPoints(5);
        get().checkAndUnlockBadges();
      },

      incrementTest: () => {
        set((state) => ({ testCount: state.testCount + 1 }));
        get().addPoints(25);
        get().checkAndUnlockBadges();
      },

      incrementSession: () => {
        set((state) => ({ sessionCount: state.sessionCount + 1 }));
        get().addPoints(50);
        get().checkAndUnlockBadges();
      },

      addMeditationMinutes: (minutes: number) => {
        set((state) => ({ meditationMinutes: state.meditationMinutes + minutes }));
        get().addPoints(minutes * 2);
        get().checkAndUnlockBadges();
      },

      incrementSocialPost: () => {
        set((state) => ({ socialPosts: state.socialPosts + 1 }));
        get().addPoints(15);
        get().checkAndUnlockBadges();
      },

      incrementSocialInteraction: () => {
        set((state) => ({ socialInteractions: state.socialInteractions + 1 }));
        get().addPoints(5);
        get().checkAndUnlockBadges();
      },

      incrementEarlyBird: () => {
        set((state) => ({ earlyBirdCount: state.earlyBirdCount + 1 }));
        get().checkAndUnlockBadges();
      },

      incrementNightOwl: () => {
        set((state) => ({ nightOwlCount: state.nightOwlCount + 1 }));
        get().checkAndUnlockBadges();
      },

      completeDailyChallenge: () => {
        const today = new Date().toISOString().split('T')[0];
        if (get().dailyChallengeDate === today) return;

        set({
          dailyChallengeCompleted: true,
          dailyChallengeDate: today,
        });
        get().addPoints(30);
      },

      getCurrentLevel: () => {
        const points = get().totalPoints;
        return LEVELS.find((l) => points >= l.minPoints && points < l.maxPoints) || LEVELS[0];
      },

      getNextLevel: () => {
        const currentLevel = get().getCurrentLevel();
        return LEVELS.find((l) => l.level === currentLevel.level + 1) || null;
      },

      getLevelProgress: () => {
        const points = get().totalPoints;
        const current = get().getCurrentLevel();
        if (current.maxPoints === Infinity) return 100;
        const range = current.maxPoints - current.minPoints;
        const progress = points - current.minPoints;
        return Math.min(100, (progress / range) * 100);
      },

      reset: () => set(initialState),
    }),
    {
      name: 'ora-gamification',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
