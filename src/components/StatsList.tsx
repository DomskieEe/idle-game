import { useGameStore } from '../store/useGameStore';
import { Clock, MousePointer, Terminal, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

export function StatsList() {
    const { totalLinesOfCode, totalClicks, startTime, linesOfCode } = useGameStore();
    const [timePlayed, setTimePlayed] = useState<string>('');

    useEffect(() => {
        const updateTime = () => {
            const diff = Date.now() - startTime;
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) setTimePlayed(`${days}d ${hours % 24}h`);
            else if (hours > 0) setTimePlayed(`${hours}h ${minutes % 60}m`);
            else if (minutes > 0) setTimePlayed(`${minutes}m ${seconds % 60}s`);
            else setTimePlayed(`${seconds}s`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    const stats = [
        {
            label: 'Lifetime Earnings',
            value: `${Math.floor(totalLinesOfCode || linesOfCode).toLocaleString()} LOC`, // Fallback for old saves
            icon: <Terminal className="text-primary" size={24} />,
            desc: 'Total lines of code written since inception.'
        },
        {
            label: 'Manual Effort',
            value: (totalClicks || 0).toLocaleString(),
            icon: <MousePointer className="text-blue-400" size={24} />,
            desc: 'Times you manually clicked the button.'
        },
        {
            label: 'Time In Business',
            value: timePlayed,
            icon: <Clock className="text-green-400" size={24} />,
            desc: 'Duration since you started this company.'
        },
        {
            label: 'Founded Date',
            value: new Date(startTime).toLocaleDateString(),
            icon: <Calendar className="text-yellow-400" size={24} />,
            desc: 'The day your journey began.'
        }
    ];

    return (
        <div className="flex flex-col gap-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-surface/50 border border-secondary/30 p-4 rounded-xl flex items-center gap-4 transition-colors hover:bg-surface"
                >
                    <div className="bg-secondary/20 p-3 rounded-lg">
                        {stat.icon}
                    </div>
                    <div>
                        <h4 className="text-muted text-xs uppercase font-bold tracking-wider mb-1">
                            {stat.label}
                        </h4>
                        <div className="text-2xl font-bold text-white mb-1">
                            {stat.value}
                        </div>
                        <p className="text-xs text-muted/80">
                            {stat.desc}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
