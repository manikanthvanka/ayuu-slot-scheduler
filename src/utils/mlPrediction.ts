
import * as tf from '@tensorflow/tfjs';

export interface VitalsMlInput {
  systolic: number;
  diastolic: number;
  pulse: number;
  temperature: number; // in Fahrenheit
  spo2: number;
  age: number;
}

export interface CardiovascularRisk {
  score: number; // 0-100
  level: 'low' | 'moderate' | 'high' | 'critical';
  message: string;
  recommendations: string[];
}

// Simple rule-based ML prediction for cardiovascular risk
export const calculateCardiovascularRisk = (vitals: VitalsMlInput): CardiovascularRisk => {
  let score = 0;
  const recommendations: string[] = [];

  // Age factor (0-25 points)
  if (vitals.age > 65) score += 25;
  else if (vitals.age > 45) score += 15;
  else if (vitals.age > 30) score += 5;

  // Blood Pressure (0-30 points)
  if (vitals.systolic > 180 || vitals.diastolic > 110) {
    score += 30;
    recommendations.push('Immediate BP management required');
  } else if (vitals.systolic > 140 || vitals.diastolic > 90) {
    score += 20;
    recommendations.push('Monitor BP closely');
  } else if (vitals.systolic > 120 || vitals.diastolic > 80) {
    score += 10;
    recommendations.push('Lifestyle modifications for BP');
  }

  // Heart Rate (0-20 points)
  if (vitals.pulse > 100) {
    score += 15;
    recommendations.push('Investigate tachycardia');
  } else if (vitals.pulse < 60) {
    score += 10;
    recommendations.push('Monitor for bradycardia');
  }

  // SpO2 (0-25 points)
  if (vitals.spo2 < 90) {
    score += 25;
    recommendations.push('Oxygen therapy consideration');
  } else if (vitals.spo2 < 95) {
    score += 15;
    recommendations.push('Monitor respiratory status');
  }

  // Temperature (Fahrenheit) - infection risk
  if (vitals.temperature > 101.3) {
    score += 10;
    recommendations.push('Investigate fever source');
  } else if (vitals.temperature < 96.8) {
    score += 5;
    recommendations.push('Monitor for hypothermia');
  }

  // Determine risk level
  let level: 'low' | 'moderate' | 'high' | 'critical';
  let message: string;

  if (score >= 70) {
    level = 'critical';
    message = 'Critical cardiovascular risk detected. Immediate intervention required.';
  } else if (score >= 50) {
    level = 'high';
    message = 'High cardiovascular risk. Close monitoring and treatment needed.';
  } else if (score >= 30) {
    level = 'moderate';
    message = 'Moderate cardiovascular risk. Regular monitoring recommended.';
  } else {
    level = 'low';
    message = 'Low cardiovascular risk. Continue routine care.';
  }

  if (recommendations.length === 0) {
    recommendations.push('Continue current care plan');
  }

  return {
    score: Math.min(100, score),
    level,
    message,
    recommendations
  };
};
