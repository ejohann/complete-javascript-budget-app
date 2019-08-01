var budgetController = (function){
    var x = 23;
    var add(a){
        return x + a;
    }
  
    return{
        publicTest: function(b){
            return (add(b));
        }
    }
}();

var UIController = (function(){
    //some code
})();


var controller = (function(budgetControl, UIControl){
    var z = budgetControl.publicTest(5);
    
    return{
        anotherPublic: function(){
            console.log(z);
        }
    }
})(budgetController, UIController);