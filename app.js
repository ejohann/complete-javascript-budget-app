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
})();


/******************************************
*** GLOBAL APP CONTROLLER
******************************************/
var controller = (function(budgetControl, UIControl){
 
    var ctrlAddItem = function(){
        // 1.  Get the field input data
        
        // 2. Add the item to the budget controller
        
        // 3. Calculate the budget
        
        // 4. Add the item to the UI
        
        // 5. Display the bidget on the UI
        
        console.log('It works');
    }
    
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
    
    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
           ctrlAddItem();
         } 
    });
    
})(budgetController, UIController);