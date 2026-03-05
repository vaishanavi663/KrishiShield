import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';

const CropRecommendation = sequelize.define('CropRecommendation', {
  // onboarding fields
  landType: {
    type: DataTypes.STRING
  },
  state: {
    type: DataTypes.STRING
  },
  requirement: {
    type: DataTypes.STRING
  },
  farmSize: {
    type: DataTypes.STRING
  },

  // crop analysis fields
  nitrogen: {
    type: DataTypes.FLOAT
  },
  phosphorus: {
    type: DataTypes.FLOAT
  },
  potassium: {
    type: DataTypes.FLOAT
  },
  ph: {
    type: DataTypes.FLOAT
  },
  rainfall: {
    type: DataTypes.FLOAT
  },

  // result output
  result: {
    type: DataTypes.JSON
  }
});

CropRecommendation.belongsTo(User, { onDelete: 'CASCADE' });
User.hasMany(CropRecommendation);

export default CropRecommendation;