const entryForm = document.getElementById('entry-form');
const entryList = document.getElementById('entry-list');
const clearAllBtn = document.getElementById('clear-all');

const totalEarningsDisplay = document.getElementById('total-earnings');
const totalCostsDisplay = document.getElementById('total-costs');
const totalSavingsDisplay = document.getElementById('total-savings');

let entries = JSON.parse(localStorage.getItem('entries')) || [];

window.addEventListener('load', () => {
  renderAll();
  updateSummary();
});

entryForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const date = document.getElementById('date').value;
  const task = document.getElementById('task').value;
  const earning = parseFloat(document.getElementById('earning').value);
  const costName = document.getElementById('cost-name').value;
  const costAmount = parseFloat(document.getElementById('cost-amount').value);

  entries.push({ date, task, earning, costName, costAmount });
  saveData();
  renderAll();
  updateSummary();
  entryForm.reset();
});

clearAllBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear all entries?")) {
    entries = [];
    saveData();
    renderAll();
    updateSummary();
  }
});

function saveData() {
  localStorage.setItem('entries', JSON.stringify(entries));
}

function renderAll() {
  entryList.innerHTML = '';
  entries.forEach((entry, index) => displayEntry(entry, index));
}

function displayEntry(entry, index) {
  const li = document.createElement('li');

  const textDiv = document.createElement('div');
  textDiv.className = 'entry-text';
  const savings = entry.earning - entry.costAmount;
  textDiv.textContent = `${entry.date} — ${entry.task} earned ৳${entry.earning.toFixed(2)}, spent on ${entry.costName} ৳${entry.costAmount.toFixed(2)} → Saved ৳${savings.toFixed(2)}`;

  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'entry-buttons';

  const editBtn = document.createElement('button');
  editBtn.textContent = '✏️ Edit';
  editBtn.onclick = () => editEntry(index);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑️ Delete';
  deleteBtn.onclick = () => deleteEntry(index);

  buttonDiv.appendChild(editBtn);
  buttonDiv.appendChild(deleteBtn);

  li.appendChild(textDiv);
  li.appendChild(buttonDiv);
  entryList.appendChild(li);
}

function deleteEntry(index) {
  entries.splice(index, 1);
  saveData();
  renderAll();
  updateSummary();
}

function editEntry(index) {
  const entry = entries[index];
  const newDate = prompt("Edit Date:", entry.date);
  const newTask = prompt("Edit Task Name:", entry.task);
  const newEarning = parseFloat(prompt("Edit Earning Amount:", entry.earning));
  const newCostName = prompt("Edit Cost Description:", entry.costName);
  const newCostAmount = parseFloat(prompt("Edit Cost Amount:", entry.costAmount));

  if (newDate && newTask && !isNaN(newEarning) && newCostName && !isNaN(newCostAmount)) {
    entries[index] = {
      date: newDate,
      task: newTask,
      earning: newEarning,
      costName: newCostName,
      costAmount: newCostAmount
    };
    saveData();
    renderAll();
    updateSummary();
  }
}

function updateSummary() {
  const totalEarnings = entries.reduce((sum, item) => sum + item.earning, 0);
  const totalCosts = entries.reduce((sum, item) => sum + item.costAmount, 0);
  const savings = totalEarnings - totalCosts;

  totalEarningsDisplay.textContent = totalEarnings.toFixed(2);
  totalCostsDisplay.textContent = totalCosts.toFixed(2);
  totalSavingsDisplay.textContent = savings.toFixed(2);
}