import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Stats.css';

interface IDailyStats {
    date: string;
    visitors: number;
    hour: number;
    spaceId: string;
}

interface IWeeklyStats {
    week: number;
    visitors: number;
    spaceId: string;
}

interface ILiveStats {
    _id: string;
    totalVisitors: number;
}

function Stats() {
    const [dailyStats, setDailyStats] = useState<IDailyStats[]>([]);
    const [weeklyStats, setWeeklyStats] = useState<IWeeklyStats[]>([]);
    const [liveStats, setLiveStats] = useState<ILiveStats[]>([]);

    useEffect(() => {
        const fetchDailyStats = async () => {
            try {
                const response = await axios.get<IDailyStats[]>('/stats/daily');
                setDailyStats(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchWeeklyStats = async () => {
            try {
                const response = await axios.get<IWeeklyStats[]>('/stats/weekly');
                setWeeklyStats(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchLiveStats = async () => {
            try {
                const response = await axios.get<ILiveStats[]>('/stats/live');
                setLiveStats(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDailyStats();
        fetchWeeklyStats();
    }, []);

    return (
        <div className="stats-container">
            <h1 className="stats-heading">Daily Statistics</h1>
            {dailyStats.length === 0 ? (
                <p className="no-stats-message">No daily statistics available</p>
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

            <hr></hr>
            <h1 className="stats-heading">Weekly Statistics</h1>
            {weeklyStats.length === 0 ? (
                <p className="no-stats-message">No weekly statistics available</p>
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

            <hr></hr>
            <h1 className="stats-heading">Live Statistics</h1>
            {liveStats.length === 0 ? (
                <p className="no-stats-message">No live statistics available</p>
            ) : (
                <ul className="stats-list">
                    {liveStats.map((stat, index) => (
                        <li key={index} className="stats-item">
                            <span className="stats-label">Space ID:</span> {stat._id}<br/>
                            <span className="stats-label">Total Visitors:</span> {stat.totalVisitors}
                        </li>
                    ))}
                </ul>
            )}
            <hr></hr>
        </div>
    );
}

export default Stats;
