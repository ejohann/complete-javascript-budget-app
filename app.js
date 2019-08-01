/*************************************
*** BUDGET CONTROLLER
**************************************/
var budgetController = (function(){
 // some code
})();


/**************************************
*** UI CONTROLLER
**************************************/
var UIController = (function(){
    //some code
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value'
    }
    
    return {
        getInput: function(){
            return{
            type: document.querySelector(DOMStrings.inputType).value, //inc of exp
            description: document.querySelector(DOMStrings.inputDescription).value,
            value: document.querySelector(DOMStrings.inputValue).value
           }
        } 
    }
})();


/******************************************
*** GLOBAL APP CONTROLLER
******************************************/
var controller = (function(budgetControl, UIControl){
 
    var ctrlAddItem = function(){
        // 1.  Get the field input data
        var input = UIControl.getInput();
        
        
        // 2. Add the item to the budget controller
        
        // 3. Calculate the budget
        
        // 4. Add the item to the UI
        
        // 5. Display the bidget on the UI
        
        console.log(input);
    }
    
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
    
    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
           ctrlAddItem();
         } 
    });
    
})(budgetController, UIController);