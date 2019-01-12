$('.contact .goTop').click(function(){
    $("html,body").animate({scrollTop:0}, 500);
});

$(window).scroll(function() {
    var oSt=$(window).scrollTop();

    if(oSt > 0){
        $('.contact .goTop').css('display','block');
        $('header').css('height',43);
        $('nav').css('top',-20);
        $('.line').css('top',40);
        $('.log').css({
            'width':76,
            'height':32,
            'top':5
        });
    }else{
        $('.contact .goTop').css('display','none');
        $('header').css('height',63);
        $('nav').css('top',0);
        $('.line').css('top',60);
        $('.log').css({
            'width':107,
            'height':40,
            'top':10
        });
    }

});