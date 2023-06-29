import { Request, Response } from 'express';
import StatsModel, { IStats } from '../models/stats.model';

class StatisticsController {
  
  static async getDailyStatistics(req: Request, res: Response) {
    try {
      // Récupère les statistiques des 7 derniers jours
      const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const dailyStats = await StatsModel.aggregate([
        { $match: { date: { $gte: lastWeek }}},
        { $group: {
          _id: { day: { $dayOfYear: "$date" }, spaceId: "$spaceId" },
          totalVisitors: { $sum: "$visitors" }
        }}
      ]);

      res.json(dailyStats);
    } catch (error: any) {
      if (error instanceof Error) {
        res.status(500).json({ message: `Erreur lors de la récupération des statistiques quotidiennes: ${error.message}` });
      } else {
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques quotidiennes.' });
      }
    }
  }

      
    
      static async getWeeklyStatistics(req: Request, res: Response) {
        try {
          // Récupère les statistiques des 4 dernières semaines et les regroupe par semaine
          const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
          const weeklyStats = await StatsModel.aggregate([
            { $match: { date: { $gte: lastMonth }}},
            { $group: {
              _id: { week: { $week: "$date" }, spaceId: "$spaceId" },
              totalVisitors: { $sum: "$visitors" }
            }}
          ]);
    
          res.json(weeklyStats);
        } catch (error: any) {
          if (error instanceof Error) {
            res.status(500).json({ message: `Erreur lors de la récupération des statistiques hebdomadaires: ${error.message}` });
          } else {
            res.status(500).json({ message: 'Erreur lors de la récupération des statistiques hebdomadaires.' });
          }
        }
      }
            
  }
  
  export default new StatisticsController();
