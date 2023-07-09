import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Stats.css';

interface IStats {
    week: number;
    visitors: number;
    spaceId: string;
}

function WeeklyStats() {
    const [weeklyStats, setWeeklyStats] = useState<IStats[]>([]);

    useEffect(() => {
        const fetchWeeklyStats = async () => {
            try {
                const response = await axios.get<IStats[]>('/stats/weekly');
                setWeeklyStats(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchWeeklyStats();
    }, []);

    return (
        <div className="stats-container">
            <h1 className="stats-heading">Weekly Statistics</h1>
            {weeklyStats.length === 0 ? (
                <p className="no-stats-message">No statistics available</p>
            ) : (
                <ul className="stats-list">
                    {weeklyStats.map((stat, index) => (
                        <li key={index} className="stats-item">
                            <span className="stats-label">Week:</span> {stat.week}<br/>
                            <span className="stats-label">Visitors:</span> {stat.visitors}<br/>
                            <span className="stats-label">Space ID:</span> {stat.spaceId}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default WeeklyStats;
