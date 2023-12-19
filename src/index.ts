// Interface for Train
interface Train {
  id: number;
  number: string;
  name: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: Date;
  arrivalTime: Date;
}

// Interface for Local Storage Data
interface LocalStorageData {
  trains: Train[];
}

// Implementation of Train class
class Train implements Train {
  constructor(
    public id: number,
    public number: string,
    public name: string,
    public departureStation: string,
    public arrivalStation: string,
    public departureTime: Date,
    public arrivalTime: Date
  ) {}
}

// Implementation of Railway Management System
class RailwayManagementSystem {
  trains: Train[] = [];

  constructor() {
    // Load data from local storage on initialization
    this.loadDataFromLocalStorage();
    // Update the table
    this.updateTrainsTable();
  }

  addTrain(train: Train): void {
    this.trains.push(train);
    this.updateTrainsTable();
    this.saveDataToLocalStorage();
  }

  removeTrain(trainId: number): void {
    this.trains = this.trains.filter((train) => train.id !== trainId);
    this.updateTrainsTable();
    this.saveDataToLocalStorage();
  }

  isDuplicateTrain(newTrain: Train): boolean {
    return this.trains.some(
      (train) =>
        train.number === newTrain.number &&
        train.name === newTrain.name &&
        train.departureStation === newTrain.departureStation &&
        train.arrivalStation === newTrain.arrivalStation &&
        +train.departureTime === +newTrain.departureTime &&//converting string to number'+'represent
        +train.arrivalTime === +newTrain.arrivalTime
    );
  }

  updateTrainsTable(): void {
    const trainsTableBody = document.querySelector<HTMLTableSectionElement>('#trainsTable tbody');
    if (!trainsTableBody) {
      return;
    }

    // Clear existing rows
    trainsTableBody.innerHTML = '';

    // Add new rows based on the current state of the trains array
    this.trains.forEach((train) => {
      const row = trainsTableBody.insertRow();
      row.innerHTML = `
        <td>${train.id}</td>
        <td>${train.number}</td>
        <td>${train.name}</td>
        <td>${train.departureStation}</td>
        <td>${train.arrivalStation}</td>
        <td>${train.departureTime.toLocaleString()}</td>
        <td>${train.arrivalTime.toLocaleString()}</td>
      `;

      // Create the "Remove Train" button
      const removeButton = document.createElement('button');
      removeButton.classList.add('remove-button');
      removeButton.textContent = 'Remove Train';
      removeButton.addEventListener('click', () => this.removeTrain(train.id));

      // Append the button to the row
      const buttonCell = row.insertCell();
      buttonCell.appendChild(removeButton);
    });
  }

  // Load data from local storage
  loadDataFromLocalStorage(): void {
    const storedData = localStorage.getItem('railwaySystemData');
    if (storedData) {
      const parsedData: LocalStorageData = JSON.parse(storedData);
      this.trains = parsedData.trains;
    }
  }

  // Save data to local storage
  saveDataToLocalStorage(): void {
    const localStorageData: LocalStorageData = {
      trains: this.trains,
    };
    localStorage.setItem('railwaySystemData', JSON.stringify(localStorageData));
  }
}

// Creating an instance of the Railway Management System Class
const railwaySystem = new RailwayManagementSystem();
const addTrainButton = document.getElementById('addTrainButton') as HTMLButtonElement;
addTrainButton.addEventListener('click', validateAndAddTrain);

// Function to add a train (called from the HTML button click)
function validateAndAddTrain(): void {
  const trainNumber = document.getElementById('trainNumber') as HTMLInputElement;//type alias
  const trainName = document.getElementById('trainName') as HTMLInputElement;
  const departureStation = document.getElementById('departureStation') as HTMLInputElement;
  const arrivalStation = document.getElementById('arrivalStation') as HTMLInputElement;
  const departureTime = document.getElementById('departureTime') as HTMLInputElement;
  const arrivalTime = document.getElementById('arrivalTime') as HTMLInputElement;
//validation checks:
  if (!trainNumber.value || !trainName.value || !departureStation.value || !arrivalStation.value || !departureTime.value || !arrivalTime.value) {
    alert('All fields must be filled.');
    return;
  }

  const newTrain = new Train(
    railwaySystem.trains.length + 1,
    trainNumber.value,
    trainName.value,
    departureStation.value,
    arrivalStation.value,
    new Date(departureTime.value),
    new Date(arrivalTime.value)
  );
  // Check if the train number is already associated with a different train name
  const existingTrainWithSameNumber = railwaySystem.trains.find(
    (train) => train.number === newTrain.number && train.name !== newTrain.name
  );

  if (existingTrainWithSameNumber) {
    // Ask the user for confirmation with a prompt
    const userConfirmation = window.confirm(
      `A train with the number ${newTrain.number} is already associated with the name ${existingTrainWithSameNumber.name}. Do you want to proceed with a different name?`
    );

    if (!userConfirmation) {
      // User clicked "Cancel" or closed the prompt
      return;
    }
    // If the user confirms, continue with adding the train
  }

  if (railwaySystem.isDuplicateTrain(newTrain)) {
    alert('Train with the same details already exists. Please enter different details.');
    return;
  }

  railwaySystem.addTrain(newTrain);

  // Clear the AddTrainform fields after adding a train
  trainNumber.value = '';
  trainName.value = '';
  departureStation.value = '';
  arrivalStation.value = '';
  departureTime.value = '';
  arrivalTime.value = '';
}

// Function to remove a train (called from the "Remove Train" button click)
function removeTrain(trainId: number): void {
  railwaySystem.removeTrain(trainId);//we can use number or name too here
}
