import { Request, Response } from 'express';
import StatsModel, { IStats } from '../models/stats.model';

class StatisticsController {
  
    async getDailyStatistics(req: Request, res: Response) {
        try {
          // Récupère les statistiques des 7 derniers jours
          const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
          const dailyStats = await StatsModel.aggregate([
            { $match: { date: { $gte: lastWeek }}},
            { $group: {
              _id: { day: { $dayOfYear: "$date" }, hour: "$hour" },
              totalVisitors: { $sum: "$visitors" },
              spaceName: { $first: "$spaceName" }
            }}
          ]);
      
          res.json(dailyStats);
        } catch (error) {
            if (error instanceof Error) {
              res.status(500).json({ message: `Erreur lors de la récupération des statistiques quotidiennes: ${error.message}` });
            } else {
              res.status(500).json({ message: 'Erreur lors de la récupération des statistiques quotidiennes.' });
            }
        }
      }
      
    
      async getWeeklyStatistics(req: Request, res: Response) {
        try {
          // Récupère les statistiques des 4 dernières semaines et les regroupe par semaine
          const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
          const weeklyStats = await StatsModel.aggregate([
            { $match: { date: { $gte: lastMonth }}},
            { $group: {
              _id: { week: { $week: "$date" }, hour: "$hour" },
              totalVisitors: { $sum: "$visitors" },
              spaceName: { $first: "$spaceName" } 
            }}
          ]);
      
          res.json(weeklyStats);
        } catch (error) {
            if (error instanceof Error) {
              res.status(500).json({ message: `Erreur lors de la récupération des statistiques hebdomadaires: ${error.message}` });
            } else {
              res.status(500).json({ message: 'Erreur lors de la récupération des statistiques hebdomadaires.' });
            }
          }
      }      
      
      
      async getLiveStats(req: Request, res: Response) {
        try {
            // Récupère les statistiques depuis le début de la journée
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
        
            const liveStats = await StatsModel.aggregate([
                { $match: { date: { $gte: startOfDay }}},
                { $group: {
                    _id: "$spaceId",
                    totalVisitorsLive: { $sum: "$visitorsLive" },
                    spaceName: { $first: "$spaceName" }
                }}
            ]);
        
            res.json(liveStats);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: `Erreur lors de la récupération des statistiques en direct : ${error.message}` });
            } else {
                res.status(500).json({ message: 'Erreur lors de la récupération des statistiques en direct.' });
            }
        }
    }
    
    async deleteAllStats(req: Request, res: Response) {
      try {
          await StatsModel.deleteMany({});  // Supprime tous les documents de la collection StatsModel
          res.status(200).json({ message: 'Toutes les statistiques ont été supprimées avec succès.' });
      } catch (error) {
          if (error instanceof Error) {
              res.status(500).json({ message: `Erreur lors de la suppression de toutes les statistiques: ${error.message}` });
          } else {
              res.status(500).json({ message: 'Erreur lors de la suppression de toutes les statistiques.' });
          }
      }
    }
    
  }
  
  export default new StatisticsController();
