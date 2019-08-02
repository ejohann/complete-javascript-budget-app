/*************************************
*** BUDGET CONTROLLER
**************************************/
var budgetController = (function(){
 // some code
 var Expense = function(id, description, value){
     this.id = id;
     this.description = description;
     this.value = value;
 };   
   
 var Income = function(id, description, value){
     this.id = id;
     this.description = description;
     this.value = value;
 };

var calculateTotal = function(type){
    var sum = 0;
    data.allItems[type].forEach(function(cur){
       sum = sum + cur.value;        
    });
    data.totals[type] = sum;
};    
    
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
  
  return{
      addItem: function(type, des, val){
        var newItem, ID;
          
        // Create a new ID
        if(data.allItems[type].length > 0 )
          {
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1; // last id + 1
          }
        else{
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
      
      getBudget: function(){
        return {
            budget: data.budget,
            totalIncome: data.totals.inc,
            totalExpenses: data.totals.exp,
            percentage: data.percentage
        }
          
      },
      
      testing: function(){
          console.log(data);
      }
  };    
    
})();


/**************************************
*** UI CONTROLLER
**************************************/
var UIController = (function(){
    //some code
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
        container: '.container'
    };
    
    return {
        getInput: function(){
            return{
            type: document.querySelector(DOMStrings.inputType).value, //inc of exp
            description: document.querySelector(DOMStrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
           }
        },
        
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
            newHtml = newHtml.replace('%value%', obj.value);
            
            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        
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
        
        displayBudget: function(obj){
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExpenses;
            
            
            if(obj.percentage > 0)
              {
                  document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%'; 
              }
            else
              {
                  document.querySelector(DOMStrings.percentageLabel).textContent = '---'; 
              }
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
         }    
     };
    
    // delete item
    var ctrlDeleteItem = function(event){
        console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);        
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

controller.init();