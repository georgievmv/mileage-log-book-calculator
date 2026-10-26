import type { Car } from "./App";
import type { Timestamp } from "firebase/firestore";

export type DailyVehicleQuantities = {
  totalDistance: string;
  cityDistance: string;
  winterDistance: string;
  convoyDistance: string;
  airConditioningDistance: string;
  garageDays: string;
};

export type DailyVehicleCalculation = {
  drivingDate: string;
  vehicle: Car;
  quantities: Record<keyof DailyVehicleQuantities, number>;
  fuel: {
    base: number;
    city: number;
    winter: number;
    convoy: number;
    airConditioning: number;
    garage: number;
    total: number;
  };
};

export type DailyVehicleEntry = DailyVehicleCalculation & {
  id: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};
