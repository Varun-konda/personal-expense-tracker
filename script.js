
// 1. TRANSACTION DATA

let transactions = JSON.parse(localStorage.getItem("transactions")) || [
    {
        description: "Salary",
        amount: 25000,
        type: "income",
        date: new Date().toLocaleDateString()
    },
    {
        description: "Shopping",
        amount: 3000,
        type: "expense",
        date: new Date().toLocaleTimeString()
    }
];


// 2. SELECTING HTML ELEMENTS

const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const transactionList = document.getElementById("transaction-list");
const balanceDisplay = document.getElementById("total-balance");
const incomeDisplay = document.getElementById("total-income");
const expenseDisplay = document.getElementById("total-expenses");
const searchInput = document.getElementById("search-input");
const filterType = document.getElementById("filter-type");


function saveTransactions() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}



// 3. DISPLAY, SEARCH AND FILTER TRANSACTIONS

function displayTransactions() {
    // Get search and filter values
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedType = filterType.value;
    // Filter transactions based on both conditions
    const filteredTransactions = transactions.filter(function(transaction) {

        const matchesSearch = transaction.description
            .toLowerCase()
            .includes(searchText);

        const matchesType = selectedType === "all" ||
            transaction.type === selectedType;

        return matchesSearch && matchesType;

    });

    transactionList.innerHTML = "";

    
    // Display filtered transactions
    filteredTransactions.forEach(function(transaction) {

        const listItem = document.createElement("li");
        listItem.classList.add(transaction.type);
        const sign = transaction.type === "income" ? "+" : "-";
        const transactionText = document.createElement("span");
        transactionText.textContent =
        `${transaction.description} - ${sign} ₹${transaction.amount.toFixed(2)} (${transaction.type}) - ${transaction.date || "Date unavailable"}`;


        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";


        // Delete selected transaction
        deleteButton.addEventListener("click", function() {

            transactions = transactions.filter(function(item) {

                return item !== transaction;

            });

            saveTransactions();

            displayTransactions();

            updateSummary();

        });


        // Adding text and button to list item
        listItem.append(transactionText, deleteButton);

        transactionList.append(listItem);
    });

}


// 4. UPDATE DASHBOARD SUMMARY
function updateSummary() {

    let totalIncome = 0;

    let totalExpenses = 0;


    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {

            totalIncome += transaction.amount;

        } else {

            totalExpenses += transaction.amount;

        }

    });


    const totalBalance = totalIncome - totalExpenses;


    balanceDisplay.textContent = `₹${totalBalance.toFixed(2)}`;

    incomeDisplay.textContent = `₹${totalIncome.toFixed(2)}`;

    expenseDisplay.textContent = `₹${totalExpenses.toFixed(2)}`;

}


// 5. HANDLING FORM SUBMISSION
transactionForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Getting input values
    const description = descriptionInput.value.trim();

    const amount = Number(amountInput.value);

    const type = typeInput.value;


    // Validate description
    if (description === "") {
        alert("Please enter a transaction description.");
        return;
    }

    // Validate amount
    if (amount <= 0 || !Number.isFinite(amount)) {
        alert("Please enter a valid amount greater than zero.");
        return;
    }

    // Creating new transaction object
        const newTransaction = {

        description: description,

        amount: amount,

        type: type,

        date: new Date().toLocaleDateString()
    };


    // Adding transaction to array
    transactions.push(newTransaction);

    saveTransactions();

    // Updating transaction history and dashboard
    displayTransactions();

    updateSummary();


    // Clear form
    transactionForm.reset();
});


// 6. SEARCH AND FILTER EVENT LISTENERS

searchInput.addEventListener("input", displayTransactions);
filterType.addEventListener("change", displayTransactions);


// 7. INITIAL PAGE LOAD

displayTransactions();
updateSummary();
