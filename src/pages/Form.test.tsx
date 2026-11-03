import { Firestore } from "firebase/firestore";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Form from "./Form";

test("recorded fuel discards digits beyond the third decimal instead of rounding upward", () => {
  const mitsubishi = {
    id: "mitsubishi",
    name: "Мицубиши",
    consumption: 8.19,
    img: "",
  };

  render(
    <Form
      db={{} as Firestore}
      cars={[mitsubishi]}
      editingEntry={null}
      selectedCar={mitsubishi}
      setSelectedCar={jest.fn()}
    />,
  );
  userEvent.type(screen.getByLabelText("Общо километри"), "1");
  userEvent.click(screen.getByRole("button", { name: "Пресметни" }));

  expect(screen.getByTestId("fuel-base")).toHaveTextContent("0.081");
});
