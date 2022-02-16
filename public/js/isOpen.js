function isOpen(time){
    var opening = time.substring(0, time.indexOf("|"));
    var closing = time.substring(time.indexOf("|")+1);
    var currentTime = new Date();
    var open = new Date();
    var close = new Date();
    open.setHours(opening.substring(0, 2),opening.substring(3,5),0); // 5.30 pm
    close.setHours(closing.substring(0, 2),closing.substring(3,5),0); // 6.30 pm

    if(currentTime >= open && currentTime < close ){
        return true;
    }else{
        return false;
    }  
}
module.exports= isOpen;
