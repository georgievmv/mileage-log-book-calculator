import React from 'react';
import { Car } from '../App';
const Cars: React.FC<{
  setSelectedCar: React.Dispatch<React.SetStateAction<Car>>;
  cars: Car[];
}> = ({ cars, setSelectedCar }) => {
  return (
    <div>
      {cars.map((elem) => {
        return (
          <button
            className="car-button"
            key={elem.id}
            onClick={() => setSelectedCar(elem)}
            type="button"
          >
              <img src={elem.img} alt="" />
              <p className="car-button-name">{elem.name}</p>
          </button>
        );
      })}
    </div>
  );
};

export default Cars;
