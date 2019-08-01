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
        expenseContainer: '.expense__list'
    };
    
    return {
        getInput: function(){
            return{
            type: document.querySelector(DOMStrings.inputType).value, //inc of exp
            description: document.querySelector(DOMStrings.inputDescription).value,
            value: document.querySelector(DOMStrings.inputValue).value
           }
        },
        
        addListItem: function(obj, type){
            
            var html, newHtml, element;
            
            // create HTML string with placeholder text
            if(type === 'inc'){
                
                element = DOMStrings.incomeContainer;
                
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%/div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
             }
            else if(type === 'exp'){
                
             element = DOMStrings.expenseContainer;    
                
              html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';   
             }
                   
            // replace the placeholder text
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
        var input, newItem;
        
        // 1.  Get the field input data
        input = UIControl.getInput();
         
        // 2. Add the item to the budget controller
        newItem = budgetControl.addItem(input.type, input.description, input.value);
        
        // 3. Calculate the budget
        
        // 4. Add the item to the UI
        UIControl.addListItem(newItem, input.type);
        
        // 5. Display the bidget on the UI
        
      //  console.log(input);
    };
    
  return{
      init: function(){
          console.log('Aplication has started');
          setupEventListeners();
      }
  }  
    
})(budgetController, UIController);

controller.init();