import mongoose, { Document, Schema } from 'mongoose';

export interface IMaintenanceLog {
    month: string;
    commentary: string;
    maintenanceBy: string; // ID de l'administrateur qui a déclenché la maintenance
    doesBestMonth: boolean;
}
  
const MaintenanceLogSchema: Schema = new Schema({
    month: { type: String },
    commentary: { type: String },
    maintenanceBy: { type: String },
    doesBestMonth: { type: Boolean }
});

export { MaintenanceLogSchema };
export default mongoose.model<IMaintenanceLog>('MaintenanceLog', MaintenanceLogSchema);