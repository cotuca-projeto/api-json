import { SerialPort } from "serialport";

const portArduino = "/dev/ttyACM0";

const arduino = new SerialPort({ path: `${portArduino}`, baudRate: 9600 });

arduino.on("open", () => {
  console.log("Arduino connected");
});

arduino.on("error", (err) => {
  console.log("Arduino not connected");
  console.log(err);
});

export function TurnOnLed(color: string) {
  if (color === "red") arduino.write("1");
  if (color === "green") arduino.write("2");
  if (color === "blue") arduino.write("3");
}

export function TurnOffLed(color: string) {
  if (color === "red") arduino.write("4");
  if (color === "green") arduino.write("5");
  if (color === "blue") arduino.write("6");
}
