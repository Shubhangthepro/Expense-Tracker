const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const customCategory = document.getElementById("customCategory");
const date = document.getElementById("date");
const filterDate = document.getElementById("filterDate");
const filterCategory = document.getElementById("filterCategory");
const darkToggle = document.getElementById("darkToggle");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

form.addEventListener("submit", addTransaction);
filterDate.addEventListener("change", init);
filterCategory.addEventListener("change", init);
darkToggle.addEventListener("click", toggleDarkMode);
category.addEventListener("change", handleCustomCategory);

function handleCustomCategory() {
  if (category.value === "Other") {
    customCategory.style.display = "block";
    customCategory.required = true;
  } else {
    customCategory.style.display = "none";
    customCategory.required = false;
    customCategory.value = "";
  }
}

function addTransaction(e) {
  e.preventDefault();
  const selectedCategory =
    category.value === "Other" ? customCategory.value.trim() : category.value;

  if (!text.value || !amount.value || !selectedCategory || !date.value) return;

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    category: selectedCategory,
    date: date.value,
  };

  transactions.push(transaction);
  updateLocalStorage();
  init();
  form.reset();
  handleCustomCategory(); // Hide input again
}

function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateValues(filtered) {
  const amounts = filtered.map((t) => t.amount);
  const total = amounts.reduce((a, b) => a + b, 0).toFixed(2);
  const incomeTotal = amounts
    .filter((x) => x > 0)
    .reduce((a, b) => a + b, 0)
    .toFixed(2);
  const expenseTotal = Math.abs(
    amounts.filter((x) => x < 0).reduce((a, b) => a + b, 0)
  ).toFixed(2);

  balance.textContent = `₹${total}`;
  income.textContent = `+₹${incomeTotal}`;
  expense.textContent = `-₹${expenseTotal}`;
}

function getCategoryIcon(cat) {
  const icons = {
    Food: "🍔",
    Travel: "✈️",
    Shopping: "🛍️",
    Salary: "💼",
    Other: "📝",
  };
  return icons[cat] || "🗂️";
}

function renderTransactions(filtered) {
  list.innerHTML = "";
  filtered.forEach((t) => {
    const sign = t.amount < 0 ? "-" : "+";
    const icon = getCategoryIcon(t.category);
    const li = document.createElement("li");
    li.classList.add(t.amount < 0 ? "minus" : "plus");
    li.innerHTML = `
      ${icon} <strong>${t.text}</strong> [${t.category}] <small>${
      t.date
    }</small> 
      <span>${sign}₹${Math.abs(t.amount)}</span>
      <button onclick="removeTransaction(${t.id})">x</button>
    `;
    list.appendChild(li);
  });
}

function getFiltered() {
  return transactions.filter((t) => {
    const matchDate = filterDate.value
      ? t.date.slice(0, 7) === filterDate.value
      : true;
    const matchCat = filterCategory.value
      ? t.category === filterCategory.value
      : true;
    return matchDate && matchCat;
  });
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function init() {
  const filtered = getFiltered();
  renderTransactions(filtered);
  updateValues(filtered);
}

init();
