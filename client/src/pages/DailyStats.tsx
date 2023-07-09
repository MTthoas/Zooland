import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Stats.css';

interface IStats {
    date: string;
    visitors: number;
    hour: number;
    spaceId: string;
}

function DailyStats() {
    const [dailyStats, setDailyStats] = useState<IStats[]>([]);

    useEffect(() => {
        const fetchDailyStats = async () => {
            try {
                const response = await axios.get<IStats[]>('/stats/daily');
                setDailyStats(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDailyStats();
    }, []);

    return (
        <div className="stats-container">
            <h1 className="stats-heading">Daily Statistics</h1>
            {dailyStats.length === 0 ? (
                <p className="no-stats-message">No statistics available</p>
            ) : (
                <ul className="stats-list">
                    {dailyStats.map((stat, index) => (
                        <li key={index} className="stats-item">
                            <span className="stats-label">Date:</span> {stat.date}<br/>
                            <span className="stats-label">Visitors:</span> {stat.visitors}<br/>
                            <span className="stats-label">Hour:</span> {stat.hour}<br/>
                            <span className="stats-label">Space ID:</span> {stat.spaceId}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DailyStats;
