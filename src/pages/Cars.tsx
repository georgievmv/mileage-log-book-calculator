import React from 'react';
import { Car } from '../App';
const Cars: React.FC<{
  setSelectedCar: React.Dispatch<React.SetStateAction<Car>>;
  cars: Car[];
}> = ({ cars, setSelectedCar }) => {
  const carSelectHandler = (e: React.MouseEvent) => {
    const selectCar = cars.filter((elem) => elem.name === e.currentTarget.id);
    setSelectedCar(selectCar[0]);
  };

  return (
    <div>
      {cars.map((elem) => {
        return (
          <button className="car-button" id={elem.name} key={elem.name} onClick={carSelectHandler}>
            <img src={elem.img} alt="" />
            <div className="car-button-backdrop">
              <p className="car-button-name">{elem.name}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Cars;
