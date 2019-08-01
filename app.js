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
 
    document.querySelector('.add__btn').addEventListener('click', function(){
        console.log('add button');
    });
    
})(budgetController, UIController);