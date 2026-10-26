import React, { useState } from "react";
import { Car } from "../App";

type Quantities = {
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
  quantities: Record<keyof Quantities, number>;
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

const initialQuantities: Quantities = {
  totalDistance: "",
  cityDistance: "",
  winterDistance: "",
  convoyDistance: "",
  airConditioningDistance: "",
  garageDays: "1",
};

const DISTANCE_MAX = 10000;
const GARAGE_DAYS_MIN = 1;
const GARAGE_DAYS_MAX = 31;

const localDate = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

const recordedFuel = (value: number) => Math.round((value + Number.EPSILON) * 1000) / 1000;
const displayFuel = (value: number) => value.toFixed(3);

const Form: React.FC<{
  setSelectedCar: React.Dispatch<React.SetStateAction<Car>>;
  selectedCar: Car;
}> = ({ selectedCar, setSelectedCar }) => {
  const today = localDate(new Date());
  const [drivingDate, setDrivingDate] = useState(today);
  const [quantities, setQuantities] = useState<Quantities>(initialQuantities);
  const [calculation, setCalculation] = useState<DailyVehicleCalculation | null>(null);
  const [error, setError] = useState("");

  const changeQuantity = (name: keyof Quantities, value: string) => {
    setQuantities((current) => ({ ...current, [name]: value }));
    setCalculation(null);
    setError("");
  };

  const changeDrivingDate = (value: string) => {
    setDrivingDate(value);
    setCalculation(null);
    setError("");
  };

  const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = Object.fromEntries(
      Object.entries(quantities).map(([name, value]) => [name, Number(value)])
    ) as Record<keyof Quantities, number>;

    if (!drivingDate) {
      setError("Изберете дата на пътуване.");
      return;
    }
    if (drivingDate > today) {
      setError("Датата на пътуване не може да бъде в бъдещето.");
      return;
    }
    if (!quantities.totalDistance) {
      setError("Въведете общия брой километри.");
      return;
    }
    if (Object.values(values).some((value) => !Number.isFinite(value) || value < 0)) {
      setError("Стойностите не могат да бъдат отрицателни.");
      return;
    }
    const distances = [
      values.totalDistance,
      values.cityDistance,
      values.winterDistance,
      values.convoyDistance,
      values.airConditioningDistance,
    ];
    if (
      distances.some((distance) => !Number.isInteger(distance) || distance > DISTANCE_MAX) ||
      !Number.isInteger(values.garageDays) ||
      values.garageDays < GARAGE_DAYS_MIN ||
      values.garageDays > GARAGE_DAYS_MAX
    ) {
      setError("Километрите трябва да са цели числа до 10000, а гаражните дни – от 1 до 31.");
      return;
    }
    const conditionDistances = [
      values.cityDistance,
      values.winterDistance,
      values.convoyDistance,
      values.airConditioningDistance,
    ];
    if (conditionDistances.some((distance) => distance > values.totalDistance)) {
      setError("Километрите за отделно условие не могат да надвишават общите километри.");
      return;
    }

    const consumption = selectedCar.consumption;
    const fuel = {
      base: recordedFuel((values.totalDistance * consumption) / 100),
      city: recordedFuel(((values.cityDistance * consumption) / 100) * 0.1),
      winter: recordedFuel(((values.winterDistance * consumption) / 100) * 0.1),
      convoy: recordedFuel(((values.convoyDistance * consumption) / 100) * 0.25),
      airConditioning: recordedFuel(
        ((values.airConditioningDistance * consumption) / 100) * 0.1
      ),
      garage: recordedFuel(consumption * 0.02 * values.garageDays),
      total: 0,
    };
    fuel.total = recordedFuel(
      fuel.base + fuel.city + fuel.winter + fuel.convoy + fuel.airConditioning + fuel.garage
    );
    setError("");
    setCalculation({ drivingDate, vehicle: selectedCar, quantities: values, fuel });
  };

  const reset = () => {
    setQuantities(initialQuantities);
    setCalculation(null);
    setError("");
  };

  const fields: Array<{
    name: keyof Quantities;
    label: string;
    description: string;
    max: number;
    testId: string;
    result?: number;
  }> = [
    { name: "totalDistance", label: "Общо километри", description: `км по основна разходна норма (${selectedCar.consumption} %)`, max: DISTANCE_MAX, testId: "fuel-base", result: calculation?.fuel.base },
    { name: "cityDistance", label: "Километри в градски условия", description: "км в градски условия (10%)", max: DISTANCE_MAX, testId: "fuel-city", result: calculation?.fuel.city },
    { name: "winterDistance", label: "Километри в зимни условия", description: "км в зимни условия (10%)", max: DISTANCE_MAX, testId: "fuel-winter", result: calculation?.fuel.winter },
    { name: "convoyDistance", label: "Километри в колона", description: "км в колона (25%)", max: DISTANCE_MAX, testId: "fuel-convoy", result: calculation?.fuel.convoy },
    { name: "airConditioningDistance", label: "Километри с включен климатик", description: "км с включен климатик (10%)", max: DISTANCE_MAX, testId: "fuel-ac", result: calculation?.fuel.airConditioning },
    { name: "garageDays", label: "Вътрешно гаражни дни", description: "дни по (2%)", max: GARAGE_DAYS_MAX, testId: "fuel-garage", result: calculation?.fuel.garage },
  ];

  return (
    <div className="form-container">
      <img className="background-image" src={selectedCar.img} alt="" />
      <form className="form" data-testid="selected-vehicle" data-vehicle-id={selectedCar.id} noValidate onSubmit={formSubmitHandler}>
        <h1>{selectedCar.name}</h1>
        <div className="form-group">
          <label htmlFor="driving-date">Дата на пътуване</label>
          <input id="driving-date" name="drivingDate" type="date" max={today} value={drivingDate} onChange={(event) => changeDrivingDate(event.target.value)} />
        </div>
        {fields.map((field) => (
          <div className="form-group" key={field.name}>
            <div className="left-hand-side">
              <label className="visually-hidden" htmlFor={field.name}>{field.label}</label>
              <input id={field.name} name={field.name} type="number" min={field.name === "garageDays" ? GARAGE_DAYS_MIN : 0} max={field.max} value={quantities[field.name]} onChange={(event) => changeQuantity(field.name, event.target.value)} />
              <p>{field.description}</p>
            </div>
            <p className="result" data-testid={field.testId}>{field.result === undefined ? "" : displayFuel(field.result)}</p>
          </div>
        ))}
        {error && <p role="alert">{error}</p>}
        {calculation && (
          <>
            <div className="combined">
              <p>Общо</p>
              <p className="result" data-testid="fuel-total">{displayFuel(calculation.fuel.total)}</p>
            </div>
            <p className="calculation-status">Готово за запис</p>
          </>
        )}
        <button className="form-button" type="submit">Пресметни</button>
        <button className="form-button" onClick={() => setSelectedCar({ id: "", name: "", consumption: 0, img: "" })} type="button">Назад</button>
        <button className="form-button" onClick={reset} type="button">Отначало</button>
      </form>
    </div>
  );
};

export default Form;
