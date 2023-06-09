import React from 'react';
import { Car } from '../App';
const Cars: React.FC<{
  setSelectedCar: React.Dispatch<React.SetStateAction<Car>>;
  cars: Car[];
}> = ({ cars, setSelectedCar }) => {
  const carSelectHandler = (e: React.MouseEvent) => {
    const selectCar = cars.filter((elem) => elem.name === e.currentTarget.innerHTML);
    setSelectedCar(selectCar[0]);
  };

  return (
    <div>
      {cars.map((elem) => {
        return (
          <button key={elem.name} onClick={carSelectHandler}>
            {elem.name}
          </button>
        );
      })}
    </div>
  );
};

export default Cars;
