
export interface VitalRange {
  min: number;
  max: number;
  unit: string;
}

export interface VitalRanges {
  systolic: VitalRange;
  diastolic: VitalRange;
  pulse: VitalRange;
  temperature: VitalRange;
  spo2: VitalRange;
}

// Age-based vital sign ranges
export const getVitalRanges = (age: number): VitalRanges => {
  if (age < 18) {
    // Pediatric ranges (simplified)
    return {
      systolic: { min: 90, max: 120, unit: 'mmHg' },
      diastolic: { min: 50, max: 80, unit: 'mmHg' },
      pulse: { min: 70, max: 120, unit: 'bpm' },
      temperature: { min: 36.1, max: 37.2, unit: '°C' },
      spo2: { min: 95, max: 100, unit: '%' }
    };
  } else if (age >= 65) {
    // Elderly ranges
    return {
      systolic: { min: 110, max: 140, unit: 'mmHg' },
      diastolic: { min: 60, max: 90, unit: 'mmHg' },
      pulse: { min: 60, max: 100, unit: 'bpm' },
      temperature: { min: 36.1, max: 37.2, unit: '°C' },
      spo2: { min: 95, max: 100, unit: '%' }
    };
  } else {
    // Adult ranges
    return {
      systolic: { min: 90, max: 120, unit: 'mmHg' },
      diastolic: { min: 60, max: 80, unit: 'mmHg' },
      pulse: { min: 60, max: 100, unit: 'bpm' },
      temperature: { min: 36.1, max: 37.2, unit: '°C' },
      spo2: { min: 95, max: 100, unit: '%' }
    };
  }
};

export const getVitalStatus = (value: number, range: VitalRange): 'normal' | 'abnormal' | 'critical' => {
  if (value < range.min * 0.8 || value > range.max * 1.2) {
    return 'critical';
  } else if (value < range.min || value > range.max) {
    return 'abnormal';
  }
  return 'normal';
};

export const calculateBMI = (height: number, weight: number): number => {
  if (height <= 0 || weight <= 0) return 0;
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};
