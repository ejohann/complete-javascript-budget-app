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
    
 var data = {
   allItems: {
       exp: [],
       inc: []
   },
  totals: {
     exp: 0,
     inc: 0
  }
 };
  
  return{
      addItem: function(type, des, val){
        var newItem, ID;
          
        // Create a new ID
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1; // last id + 1
        
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
        inputButton: '.add__btn'
    };
    
    return {
        getInput: function(){
            return{
            type: document.querySelector(DOMStrings.inputType).value, //inc of exp
            description: document.querySelector(DOMStrings.inputDescription).value,
            value: document.querySelector(DOMStrings.inputValue).value
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
 
    var setupEventListeners = function(){
         var DOM = UIControl.getDOMstrings();
         document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
         document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                event.preventDefault(); // prevents enter key triggering a click event
                ctrlAddItem();
             } 
          });
    };
      
    var ctrlAddItem = function(){
        // 1.  Get the field input data
        var input = UIControl.getInput();
         
        // 2. Add the item to the budget controller
        
        // 3. Calculate the budget
        
        // 4. Add the item to the UI
        
        // 5. Display the bidget on the UI
        
        console.log(input);
    };
    
  return{
      init: function(){
          console.log('Aplication has started');
          setupEventListeners();
      }
  }  
    
})(budgetController, UIController);

controller.init();