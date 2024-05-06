const express = require('express');
const mysql = require('mysql');
const axios = require('axios');
const cors = require("cors");
const compression = require('compression');
const bodyParser = require('body-parser');
const { error } = require('console');

const port = process.env.port || 3000;
const app = express();

var connection = mysql.createPool({
  // asmaf15@decisionao.com
    // host: 'sql5.freemysqlhosting.net',
    // user: 'sql5700145',
    // password: 'WHRmKuamg4',
    // database: 'sql5700145'
    // host: 'sql3.freesqldatabase.com',
    // user: 'sql3702214',
    // password: 'aFTbJmipKk',
    // database: 'sql3702214'
    host: 'sql3.freesqldatabase.com',
    user: 'sql3703873',
    password: '3jzt68k3vr',
    database: 'sql3703873'
});

//app.use(express.json());
app.use(bodyParser.json());
app.use(compression());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use('/', express.static('public'));


// Endpoint to get all expense items
app.get('/expense/items/:userId', async(req, res) => {
    const { userId } = req.params;
    connection.query('SELECT * FROM expense where userId = ?', [userId], function(error, results, fields){
        if(error){
          console.log("Error: " + error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        res.json(results);
    });
});

// Endpoint to get all expense items for different number of months
app.get('/expense/items/month/:diff/:userId', async(req, res) => {
  const { diff, userId } = req.params;
  console.log("Diff: " + diff);
  const queryString = "SELECT * FROM expense WHERE TIMESTAMPDIFF(MONTH, monthAndYear, CURDATE()) > 0 AND TIMESTAMPDIFF(MONTH, monthAndYear, CURDATE()) <= ? "
  + " AND userId = ? ORDER BY monthAndYear DESC;";
  connection.query(queryString, [diff, userId], function(error, results, fields){
      if(error){
        console.log("Error: " + error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json(results);
  });
});

app.get('/expense/items/amount/:diff/:userId', async(req, res) => {
  const { diff, userId } = req.params;
  const queryString = "SELECT *, SUM(amount) as amount FROM expense WHERE TIMESTAMPDIFF(MONTH, monthAndYear, CURDATE()) > 0 AND TIMESTAMPDIFF(MONTH, monthAndYear, CURDATE()) <= ? "
  + " AND userId = ? GROUP BY MONTH(monthAndYear) ORDER BY monthAndYear DESC;";
  connection.query(queryString, [diff, userId], function(error, results, fields){
      if(error){
        console.log("Error: " + error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json(results);
  });
});

// Endpoint to get a specific label's value for an expense
app.get('/expense/items/:item/:userId', (req, res) => {
  const { item, userId } = req.params;
  connection.query('SELECT * FROM expense WHERE expenseType = ? AND YEAR(monthAndYear) = YEAR(CURDATE()) AND MONTH(monthAndYear) = MONTH(CURDATE()) AND userId = ?', [item, userId], (error, results) => {
      if (error) {
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      if (results.length === 0) {
          res.status(404).json({ error: 'Expense type not found' });
          return;
      }
      res.json(results);
  });
});

// End point to get total amount spent on each expense category
app.get('/expense/items/category/total/:userId', (req, res) => {
  const { userId }  = req.params;
  connection.query("SELECT expenseType, SUM(amount) AS total_amount FROM expense WHERE YEAR(monthAndYear) = YEAR(CURDATE()) AND MONTH(monthAndYear) = MONTH(CURDATE()) AND userId = ? "+
  "GROUP BY expensetype, Month(monthAndYear) ORDER by month(monthAndYear) DESC", [userId], (error,results) => {
    if (error) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  })
})

// End point to get current month total (expense)
app.get('/expense/items/expense/total/:userId', (req, res) => {
  const { userId }  = req.params;
  connection.query('SELECT SUM(amount) as total_expense FROM expense WHERE YEAR(monthAndYear) = YEAR(CURDATE()) AND MONTH(monthAndYear) = MONTH(CURDATE()) AND userId = ?', [userId], (error,results) => {
    if (error) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  })
})

// End point to insert items
app.post('/expense/items/:userId', (req, res) => {
  const { userId } = req.params;
  const {date, expenseType, amount} = req.body;
    if (!expenseType || amount <= 0) {
        return res.status(400).json({ error: 'Both expense type and amount are required' });
    }
    // Insert new expense data into the database
    connection.query('INSERT INTO expense (monthAndYear, expenseType, amount, userId) VALUES (?, ?, ?, ?)', [date, expenseType, amount, userId], (error, results) => {
        if (error) {
            console.error('Error inserting into database:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ message: 'expense data inserted successfully' });
    });
});


// Endpoint to update a expenseType's value in expense
app.put('/expense/items/:item/:userId', async (req, res) => {
  const { item, userId } = req.params;
  const { amount } = req.body;
  if (!amount) {
      return res.status(400).json({ error: 'Value is required' });
  }
  // Update label's value in the expense database
  connection.query('UPDATE expense SET amount = ? WHERE expenseType = ? AND userId = ? ', [amount, item, userId], async (error, results) => {
      if (error) {
          console.error('Error updating database: ' + error);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      if (results.affectedRows === 0) {
          res.status(404).json({ error: 'Label not found' });
          return;
      }
      res.json({ message: 'expense data updated successfully' });
  });
});

// Endpoint to delete expense data
app.delete('/expense/items/:item/:userId', (req, res) => {
  const { item } = req.params;
  // Delete the expense data from the database
  connection.query('DELETE FROM expense WHERE expenseType = ? AND userId = ?', [item, userId], (error, results) => {
      if (error) {
          console.error('Error deleting from database:', error);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      if (results.affectedRows === 0) {
          res.status(404).json({ error: 'Label not found' });
          return;
      }
      res.json({ message: 'expense data deleted successfully' });
  });
});


// Income APIs
// Endpoint to get amount
app.get('/income/:userId', async(req, res) => {
  const { userId } = req.params;
  connection.query('SELECT * FROM income where userId = ?', [userId], function(error, results, fields){
      if(error){
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json(results);
  });
});

app.get('/income/month/:month/:userId', (req, res) => {
  const { month, userId } = req.params;
  connection.query('SELECT amount FROM income WHERE month = ? AND userId = ?', [month, userId], (error, results) => {
      if (error) {
          console.error('Error retrieving: '+ error);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      if (results.length === 0) {
          res.status(404).json({ error: 'Data not found with this month' });
          return;
      }
      res.json(results);
  });
});

// Endpoint to get a specific month's and year's amount
app.get('/income/month/:month/year/:year/:userId', (req, res) => {
const { month, year, userId } = req.params;
connection.query('SELECT amount FROM income WHERE month = ? AND year = ? AND userId = ?', [month, year, userId], (error, results) => {
    if (error) {
        console.error('Error retrieving: '+ error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    // if (results.length === 0) {
    //     res.status(404).json({ error: 'Data not found with this month and year' });
    //     return;
    // }
    res.json(results);
});
});


// Endpoint to get all income for different months
app.get('/income/:diff/:userId', async(req, res) => {
  const { diff, userId } = req.params;
  console.log("User id:  " + userId);
  const queryString = "SELECT year, month, amount, userId, month_difference FROM ( "
  + "SELECT year, month, amount, userId, (MONTH(CURDATE()) - MONTH(STR_TO_DATE(month, '%M')) + 12) % 12 AS month_difference FROM income) AS m_diff"
  + " WHERE month_difference > 0 AND month_difference <= ? AND userId = ? ORDER BY STR_TO_DATE(month, '%M') DESC;";
  connection.query(queryString, [diff, userId], function(error, results, fields){
      if(error){
        console.log("Error: " + error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json(results);
  });
});

// End point to insert month income
// app.post('/income/:userId', (req, res) => {
// const { userId } = req.params;
// const { months, amount, year } = req.body;
// console.log("Month : " + months + " amount: " + amount);
//   if (!months || !amount || !year) {
//       return res.status(400).json({ error: 'Month, year and amount are required' });
//   }

//   // Insert new income data into the database
//   connection.query('INSERT INTO income (month, amount, year, userId) VALUES (?,?,?,?)', [months, amount, year, userId], (error, results) => {
//       if (error) {
//           console.error('Error inserting into database:', error);
//           res.status(500).json({ error: 'Internal server error' });
//           return;
//       }
//       res.json({ message: 'Income and month added successfully' });
//   });
// });

app.post('/income/:userId', (req, res) => {
  const { userId } = req.params;
  const { months, amount, year } = req.body;
  console.log("Month : " + months + " amount: " + amount);
  if (!months || !amount || !year) {
      return res.status(400).json({ error: 'Month, year, and amount are required' });
  }

  // Check if the record exists for the given user, month, and year
  connection.query('SELECT * FROM income WHERE userId = ? AND month = ? AND year = ?', [userId, months, year], (error, results) => {
      if (error) {
          console.log('Error querying database:'+ error);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      console.log("results length: "+ results.length);
      if (results.length > 0) {
          // If the record exists, update it
          connection.query('UPDATE income SET amount = ? WHERE userId = ? AND month = ? AND year = ?', [amount, userId, months, year], (error, results) => {
              if (error) {
                  console.error('Error updating database:', error);
                  res.status(500).json({ error: 'Internal server error' });
                  return;
              }
              res.json({ message: 'Income updated successfully' });
          });
      } else {
          // If the record doesn't exist, insert a new record
          connection.query('INSERT INTO income (month, amount, year, userId) VALUES (?,?,?,?)', [months, amount, year, userId], (error, results) => {
              if (error) {
                  console.error('Error inserting into database:', error);
                  res.status(500).json({ error: 'Internal server error' });
                  return;
              }
              res.json({ message: 'Income added successfully' });
          });
      }
  });
});


// Endpoint to update a amount's value
app.put('/income/month/:month/year/:year/:userId', async (req, res) => {
const { month, year, userId } = req.params;
const { amount } = req.body;
console.log(" from server.js put : month: " + month + "year: " + year + " amount: " + amount);
if (!amount) {
    return res.status(400).json({ error: 'Amount is required' });
}

// Update income's value in the database
connection.query('UPDATE income SET amount = ? WHERE month = ? AND year = ? AND userId = ?', [amount, month, year, userId], async (error, results) => {
    if (error) {
        console.error('Error updating database: ' + error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Both month and year not found' });
        return;
    }
    res.json({ message: 'Monthly income updated successfully' });
});
});

// Endpoint to income expense data
app.delete('/income/:month/:userId', (req, res) => {
const { month, userId } = req.params;

// Delete the income data from the database
connection.query('DELETE FROM income WHERE month = ?', [month. userId], (error, results) => {
    if (error) {
        console.error('Error deleting from database:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Month not found' });
        return;
    }
    res.json({ message: 'Monthly income deleted successfully' });
});
});

//Budget API's
// Endpoint to get all budget items
app.get('/budget/items/:userId', async(req, res) => {
  const { userId } = req.params;
  connection.query('SELECT * FROM budget WHERE userId = ?', [userId], function(error, results, fields){
      if(error){
        console.log("Error: " + error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json(results);
  });
});

// Endpoint to get all budget items for different number of months
app.get('/budget/items/month/:diff/:userId', async(req, res) => {
  const { diff, userId } = req.params;
  console.log("Diff: " + diff + " and user id: " + userId);
  const queryString = "SELECT * FROM budget WHERE TIMESTAMPDIFF(MONTH, monthAndYear, CURDATE()) > 0 AND TIMESTAMPDIFF(MONTH, monthAndYear, CURDATE()) <= ? "
  + " AND userId = ? ORDER BY monthAndYear DESC;";
  connection.query(queryString, [diff, userId], function(error, results, fields){
  if(error){
    console.log("Error: " + error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
  console.log("Results : " + results);
      res.json(results);
  });
  });

app.get('/budget/items/amount/:diff/:userId', async(req, res) => {
const { diff, userId } = req.params;
const queryString = "SELECT *, SUM(amount) as amount FROM budget WHERE TIMESTAMPDIFF(MONTH, monthAndYear, CURDATE()) > 0 AND TIMESTAMPDIFF(MONTH, monthAndYear, CURDATE()) <= ? "
+ " AND userId = ? GROUP BY MONTH(monthAndYear) ORDER BY monthAndYear DESC;";
connection.query(queryString, [diff, userId], function(error, results, fields){
    if(error){
      console.log("Error: " + error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
});
});

// Endpoint to get a specific label's value for an budget
app.get('/budget/items/:item/:userId', (req, res) => {
console.log("Server.js label's item");
const { item, userId } = req.params;
connection.query('SELECT value FROM budget WHERE expenseType = ? AND userId = ?', [item, userId], (error, results) => {
    if (error) {
        console.error('Error retrieving: '+ error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    if (results.length === 0) {
        res.status(404).json({ error: 'Label not found' });
        return;
    }
    res.json(results);
});
});

// End point to get current month total (expense) budget
app.get('/budget/items/budget/total/:userId', (req, res) => {
  const { userId } = req.params;
  console.log("server.js: calling to get budget");
  connection.query('SELECT SUM(amount) as total_expense FROM budget WHERE YEAR(monthAndYear) = YEAR(CURDATE()) AND MONTH(monthAndYear) = MONTH(CURDATE()) AND userId = ?', [userId], (error,results) => {
    if (error) {
      console.error('Error retrieving: ' + error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log("results: " + results[0]);
    res.json(results);
  })
})

// End point to insert items
app.post('/budget/items/:userId', (req, res) => {
  console.log("request body: " + req.body);
  //const {label, value} = req.body;
  const { userId } = req.params;
  const {date, expenseType, amount} = req.body;
  console.log("Label: " + expenseType + " value : " + amount + " Month and Year: " + date);
    if (!expenseType || amount <= 0) {
        return res.status(400).json({ error: 'Both budget type and amount are required' });
    }

    // Insert new budget data into the database
    connection.query('INSERT INTO budget (monthAndYear, expenseType, amount, userId) VALUES (?, ?, ?, ?)', [date, expenseType, amount, userId], (error, results) => {
        if (error) {
            console.error('Error inserting into database:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ message: 'budget data inserted successfully' });
    });
});


// Endpoint to update a expenseType's value in budget
app.put('/budget/items/:item/:userId', async (req, res) => {
const { item, userId } = req.params;
const { amount } = req.body;

console.log(" put budget: Label : " + item + " params label: " + req.params.item);
if (!amount) {
    return res.status(400).json({ error: 'Value is required' });
}

// Update label's value in the budget database
connection.query('UPDATE budget SET amount = ? WHERE expenseType = ? AND userId = ?', [amount, item, userId], async (error, results) => {
    if (error) {
        console.error('Error updating database: ' + error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Label not found' });
        return;
    }
    res.json({ message: 'budget data updated successfully' });
});
});

// Endpoint to delete budget data
app.delete('/budget/items/:item/:userId', (req, res) => {
const { item } = req.params;

// Delete the budget data from the database
connection.query('DELETE FROM budget WHERE expenseType = ? AND userId = ?', [item, userId], (error, results) => {
    if (error) {
        console.error('Error deleting from database:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
    if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Label not found' });
        return;
    }
    res.json({ message: 'budget data deleted successfully' });
});
});



app.listen(port, () => {
    console.log(`Server on port ${port}`);
});
