$(function () {
    $('#form-builder-container').fadeIn();

    $('.selectpicker').selectpicker();

    $('.show-questions').click(function(){
        $('#form-questions').removeClass("minimize");
    });

    $('.hide-questions').click(function(){
        $('#form-questions').addClass("minimize");
    });

    // Set FormBuilder Static Buttons to top
    var nav = $('.builder-menu');
    $(window).scroll(function () {
    	$(this).scrollTop() > 120
    	   ? nav.addClass("hover-time")
           : nav.removeClass("hover-time");
    });

    $(window).resize(function(){
        $('.list.questions > ul').height($(window).height() - 200);
    }).resize();

    $('.form-builder').click(function(e){ 
        if(!$(e.target).parents('.op-menu').length) {
        	$('#formBuilderSection').find('.edit-property-container:visible li > a.close-btn').click();
        }
    });
});