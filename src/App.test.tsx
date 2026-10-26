import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import App from "./App";

test("an operator chooses a stable vehicle and starts with today's driving date", async () => {
  jest.useFakeTimers().setSystemTime(new Date(2026, 9, 26, 12));

  render(<App />);
  userEvent.click(screen.getByRole("button", { name: "Шевролет" }));

  expect(screen.getByRole("heading", { name: "Шевролет" })).toBeInTheDocument();
  expect(screen.getByLabelText("Дата на пътуване")).toHaveValue("2026-10-26");
  expect(screen.getByTestId("selected-vehicle")).toHaveAttribute("data-vehicle-id", "chevrolet");

  jest.useRealTimers();
});

test("future dates and invalid distances are rejected in Bulgarian", () => {
  jest.useFakeTimers().setSystemTime(new Date(2026, 9, 26, 12));
  render(<App />);
  userEvent.click(screen.getByRole("button", { name: "Шевролет" }));

  userEvent.clear(screen.getByLabelText("Дата на пътуване"));
  userEvent.type(screen.getByLabelText("Дата на пътуване"), "2026-10-27");
  userEvent.type(screen.getByLabelText("Общо километри"), "10");
  userEvent.type(screen.getByLabelText("Километри в градски условия"), "11");
  userEvent.click(screen.getByRole("button", { name: "Пресметни" }));

  expect(screen.getByRole("alert")).toHaveTextContent("Датата на пътуване не може да бъде в бъдещето.");

  jest.useRealTimers();
});

test("negative values and a condition distance above the total are rejected", () => {
  render(<App />);
  userEvent.click(screen.getByRole("button", { name: "Шевролет" }));
  const totalDistance = screen.getByLabelText("Общо километри");
  const cityDistance = screen.getByLabelText("Километри в градски условия");

  fireEvent.change(totalDistance, { target: { value: "-1" } });
  userEvent.click(screen.getByRole("button", { name: "Пресметни" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Стойностите не могат да бъдат отрицателни.");

  fireEvent.change(totalDistance, { target: { value: "10" } });
  fireEvent.change(cityDistance, { target: { value: "11" } });
  userEvent.click(screen.getByRole("button", { name: "Пресметни" }));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Километрите за отделно условие не могат да надвишават общите километри."
  );
});

test("recorded components are rounded to three decimals and their visible sum is the total", () => {
  render(<App />);
  userEvent.click(screen.getByRole("button", { name: "Шевролет" }));

  userEvent.type(screen.getByLabelText("Общо километри"), "100");
  userEvent.type(screen.getByLabelText("Километри в градски условия"), "33");
  userEvent.type(screen.getByLabelText("Километри в зимни условия"), "22");
  userEvent.type(screen.getByLabelText("Километри в колона"), "11");
  userEvent.type(screen.getByLabelText("Километри с включен климатик"), "44");
  userEvent.click(screen.getByRole("button", { name: "Пресметни" }));

  expect(screen.getByTestId("fuel-base")).toHaveTextContent("8.500");
  expect(screen.getByTestId("fuel-city")).toHaveTextContent("0.281");
  expect(screen.getByTestId("fuel-winter")).toHaveTextContent("0.187");
  expect(screen.getByTestId("fuel-convoy")).toHaveTextContent("0.234");
  expect(screen.getByTestId("fuel-ac")).toHaveTextContent("0.374");
  expect(screen.getByTestId("fuel-garage")).toHaveTextContent("0.170");
  expect(screen.getByTestId("fuel-total")).toHaveTextContent("9.746");
  expect(screen.getByText("Готово за запис")).toBeInTheDocument();

  userEvent.clear(screen.getByLabelText("Общо километри"));
  userEvent.type(screen.getByLabelText("Общо километри"), "101");
  expect(screen.queryByText("Готово за запис")).not.toBeInTheDocument();
});
