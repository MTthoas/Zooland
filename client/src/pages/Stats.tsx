import React, { useEffect, useState } from "react";
import axios from "axios";

interface IDailyStats {
  _id: {
    day: number;
    hour: number;
  };
  totalVisitors: number;
}

interface IWeeklyStats {
  _id: {
    week: number;
    hour: number;
  };
  totalVisitors: number;
}

interface ILiveStats {
  _id: string;
  nom: string;
  spaceName: string;
  totalVisitors: number;
}

const Stats = () => {
  const [dailyStats, setDailyStats] = useState<IDailyStats[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<IWeeklyStats[]>([]);
  const [liveStats, setLiveStats] = useState<ILiveStats[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const dailyResponse = await axios.get<IDailyStats[]>("/stats/daily", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDailyStats(dailyResponse.data);

        const weeklyResponse = await axios.get<IWeeklyStats[]>(
          "/stats/weekly",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWeeklyStats(weeklyResponse.data);

        const liveResponse = await axios.get<ILiveStats[]>("/stats/live", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const liveStatsWithNames = await Promise.all(
          liveResponse.data.map(async (stat) => {
            console.log("livewithname stat", stat);
            const spaceResponse = await axios.get(`/nom/${stat._id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log("spaceresponde stat", spaceResponse);
            console.log("nom space", spaceResponse.data.nom);

            

            return {
              ...stat,
              nom: spaceResponse.data.nom,
            };
            
          })
        );
        console.log("rrrrrrrrrrrrrrrrrrrrrrr", liveResponse.data);
        setLiveStats(liveStatsWithNames);
        
      } catch (error) {
        console.error(error);
      }
      
    };

    fetchData();
  }, []);
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Statistiques journalières</h1>
        {dailyStats.length === 0 ? (
          <p className="text-gray-600">
            Aucune statistique disponible pour le moment
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyStats.map((stat, index) => (
              <li key={index} className="bg-white rounded-lg p-4 shadow">
                <span className="block text-gray-600">
                  Jour : {stat._id.day}
                </span>
                <span className="block text-gray-600">
                  Heure : {stat._id.hour}
                </span>
                <span className="block text-gray-600">
                  Visiteurs : {stat.totalVisitors}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Statistiques hebdomadaires</h1>
        {weeklyStats.length === 0 ? (
          <p className="text-gray-600">
            Aucune statistique disponible pour le moment
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyStats.map((stat, index) => (
              <li key={index} className="bg-white rounded-lg p-4 shadow">
                <span className="block text-gray-600">
                  Semaine : {stat._id.week}
                </span>
                <span className="block text-gray-600">
                  Heure : {stat._id.hour}
                </span>
                <span className="block text-gray-600">
                  Visiteurs : {stat.totalVisitors}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">Statistiques en direct</h1>
        {liveStats.length === 0 ? (
          <p className="text-gray-600">
            Aucune statistique en direct disponible pour le moment
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveStats.map((stat, index) => (
              <li key={index} className="bg-white rounded-lg p-4 shadow">
                <span className="block text-gray-600">
                  Nom de l'espace : {stat.nom}
                </span>
                <span className="block text-gray-600">
                  Total des visiteurs : {stat.totalVisitors}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Stats;
