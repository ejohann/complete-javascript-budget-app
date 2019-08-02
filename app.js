/*************************************
*** BUDGET CONTROLLER
**************************************/
var budgetController = (function(){
    // expense function constructor
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
      };   
    
    // expense percentage calculater
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);  
          }
        else
          {
              this.percentage = -1;
          }
      };
    
    // returns the percentage
    Expense.prototype.getPercentage = function(){
        return this.percentage;
      };
   
    // income function constructor
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
      };

     // private function - calculate total
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;        
          });
        data.totals[type] = sum;
      };    
    
    // private - data structure
    var data = {
        allItems: {
            exp: [],
            inc: []
          },
        totals: {
            exp: 0,
            inc: 0
          },
        budget: 0,
        percentage: -1
    };
  
    // public
    return{
        // add items
        addItem: function(type, des, val){
            var newItem, ID;
            // Create a new ID
            if(data.allItems[type].length > 0 )
              {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1; // last id + 1
              }
            else
              {
                ID = 0;
              }
            //Create new item based on expense or income   
            if(type === 'exp')
              {
                newItem =  new Expense(ID, des, val); 
              }
            else if(type === 'inc'){
                newItem =  new Income(ID, des, val);
              }
            // add item into data structure  
            data.allItems[type].push(newItem);
            // return new item
            return newItem;
          },
      
        // delete items
        deleteItem: function(type, id){
            var ids, index;
            // convert list to array
            ids = data.allItems[type].map(function(current){
                return current.id;
              });
             // the item to be deleted
            index = ids.indexOf(id);
            // remove item from the array
            if(index !== -1){
                data.allItems[type].splice(index, 1);    
              }  
          }, 
        
        // calculate the budget
        calculateBudget: function(){
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage of income for expenses
            if(data.totals.inc > 0)
              {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
              }
            else
              {
                data.percentage = -1;   
              }
          },
        
        // calculate percentages
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);  
              });
        },
        
        // get percentages
        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();  
              });
            return allPerc;
          },
      
        // return budget
        getBudget: function(){
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
              }
          },
      
         // function for testing in the console
        testing: function(){
            console.log(data);
          }
    };    
})();


/**************************************
*** UI CONTROLLER
**************************************/
var UIController = (function(){
    
    //DOM strings object
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage'
      };
    
    // formatting numbers
    var formatNumber = function(num, type){
            var numSplit, int, dec;       
            // + or - before number
            // exactly 2 decimal places
            // comma separating thousands
            
            // absolute number
            num = Math.abs(num);
            // decimal number
            num = num.toFixed(2);
            numSplit = num.split('.');
            // add comma between thousands
            int = numSplit[0];
            if(int.length > 3){
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);   
              }
            // add a - or +
            dec = numSplit[1];
            // return formatted number
            return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
          };
        
    
    // functions to be return - global
    return {
        
        // get the inputs
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value, //inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
              }
          },
        
        // add an item
        addListItem: function(obj, type){
            var html, newHtml, element;
            
            // create HTML string with placeholder text
            if(type === 'inc'){    
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
              }
            else if(type === 'exp'){  
                element = DOMStrings.expenseContainer;    
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';   
              }
                   
            // replace the placeholder text
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
          },
        
        deleteListItem: function(selectorID){
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
          },
        
        // clear the fields after item has been entered
        clearFields: function(){
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);  
            fieldsArray = Array.prototype.slice.call(fields); // convert list to array
            // clear all fields    
            fieldsArray.forEach(function(current, index, array){
                current.value = '';
              });
            // place cursor in first field
            fieldsArray[0].focus();
          },
        
        // display the budget
        displayBudget: function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExpenses, 'exp');
             // only diplay percentage if greater that 0            
            if(obj.percentage > 0)
              {
                  document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%'; 
              }
            else
              {
                  document.querySelector(DOMStrings.percentageLabel).textContent = '---'; 
              }
          },
        
        // display perentages
        displayPercentages: function(percentages){           
            var fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);
            var nodeListForEach = function(list, callback){
                for(var i = 0; i < list.length; i++){
                    callback(list[i], i);
                  }
              };
            nodeListForEach(fields, function(current, index){
                 if(percentages[index] > 0){
                      current.textContent = percentages[index] + '%';
                   }
                 else
                  {
                      current.textContent = '---';
                  } 
              });
          },
        
        getDOMstrings: function(){
            return DOMStrings;
          }
      }
})();


/******************************************
*** GLOBAL APP CONTROLLER
******************************************/
var controller = (function(budgetControl, UIControl){
 
     // initialise event listeners
    var setupEventListeners = function(){
        var DOM = UIControl.getDOMstrings();   
        // listen for add item click
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        //listen for add item 'enter'
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                event.preventDefault(); // prevents enter key triggering a click event
                ctrlAddItem();
             } 
          });
        //listen for delete item click
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
    
    // update the budget
    var updateBudget = function(){
        // 1. Calculate the budget
        budgetControl.calculateBudget();
        // 2.  Return the budget
        var budget = budgetControl.getBudget();
        // 3.  Display the budget on the UI
        UIControl.displayBudget(budget);
     };
    
    // update percentages
    var updatePercentages = function(){
        // 1. calculate percentages
        budgetControl.calculatePercentages();
        // 2. Read percentages from the budget controller
        var percentages = budgetControl.getPercentages();
        // 3. Update the UI with the new percentages
        UIControl.displayPercentages(percentages);
    };
      
    // add item
    var ctrlAddItem = function(){
        var input, newItem;
        // 1.  Get the field input data
        input = UIControl.getInput();
        if(input.description !== '' && !isNaN(input.value) && input.value > 0){
            // 2. Add the item to the budget controller
            newItem = budgetControl.addItem(input.type, input.description, input.value);
            // 3. Add the item to the UI
            UIControl.addListItem(newItem, input.type);
            // 4. Clear the fields
            UIControl.clearFields();   
            // 5. Calculate and display the budget
            updateBudget();
            // 6. calculate and update percentages
            updatePercentages();
         }    
     };
    
    // delete item
    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; 
        
        if(itemID){
             splitID = itemID.split('-');
             type = splitID[0];
             ID = parseInt(splitID[1]);
            // 1.  Delete the item from the data structure
            budgetControl.deleteItem(type, ID);
            // 2.  Delete the item from the UI
            UIControl.deleteListItem(itemID);
            // 3. Update and show the new budget
            updateBudget();
            // 4. calculate and update percentages
            updatePercentages();
         }
    };
    
  return{
      init: function(){
          console.log('Aplication has started');
          UIControl.displayBudget({
            budget: 0,
            totalIncome: 0,
            totalExpenses: 0,
            percentage: 0
           });
          setupEventListeners();
      }
  }  
    
})(budgetController, UIController);


// start the application
controller.init();