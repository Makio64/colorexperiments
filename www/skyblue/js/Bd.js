var Bd = function(){
    if (typeof Bd.instance === 'object') {
        return Bd.instance;
    }

    var bd = {};

    bd.nbImages = 2;

   	bd.pop = function(left, top, nb, delay, delayRemove, fill){
   		var left = left || 150+Math.random()*(window.innerWidth-150);
   		var top = top ||  150+Math.random()*(window.innerHeight-150);

        var rand = nb || Math.ceil(Math.random()*this.nbImages);

        var delay = delay || 0;
        var delayRemove = delayRemove || 400;
        var fill = fill || false;

        setTimeout(function(){
        	$('#overlay .truc'+rand).addClass('visible').css({
	            left: left,
	            top: top
	        });	
        }, delay);
        
        if(!fill){
        	setTimeout(function(){
                $('#overlay .truc'+rand).removeClass('visible');
            }, delayRemove);    	
        }
        
   	}

    Bd.instance = bd;

    return bd;
};