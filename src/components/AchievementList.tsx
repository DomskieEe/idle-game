import { useGameStore } from '../store/useGameStore';
import { ACHIEVEMENTS } from '../data/achievements';
import { Trophy, Lock } from 'lucide-react';

export function AchievementList() {
    const { achievements } = useGameStore();

    return (
        <div className="flex flex-col gap-4">
            {ACHIEVEMENTS.map((achievement) => {
                const isUnlocked = achievements.includes(achievement.id);

                return (
                    <div
                        key={achievement.id}
                        className={`
              flex items-center gap-4 p-4 rounded-xl border transition-colors
              ${isUnlocked
                                ? 'bg-yellow-500/10 border-yellow-500/50'
                                : 'bg-surface/50 border-secondary/30 opacity-50'}
            `}
                    >
                        <div className={`p-3 rounded-lg ${isUnlocked ? 'bg-yellow-500/20 text-yellow-500' : 'bg-secondary text-muted'}`}>
                            {isUnlocked ? <Trophy size={24} /> : <Lock size={24} />}
                        </div>

                        <div className="flex-1">
                            <h3 className={`font-bold ${isUnlocked ? 'text-yellow-500' : 'text-white'}`}>
                                {achievement.name}
                            </h3>
                            <p className="text-sm text-muted">
                                {achievement.description}
                            </p>
                        </div>

                        {isUnlocked && (
                            <div className="text-xs font-bold text-yellow-600 bg-yellow-500/10 px-2 py-1 rounded">
                                UNLOCKED
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
