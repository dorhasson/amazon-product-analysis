$(document).ready(function() {

  // $('.roi').each(function() {
  //   var amount = parseInt($('.roi').html());
  //   if (amount < 10) {
  //     $('.fa-arrow-up').css('display', 'none');
  //   }
  // });


  // $('.fa-question-circle').hover(function(){
  //   $('.question-mark-display-1').css('display', 'block');
  // });


  (function($) {
    $('.btn-primary').on('click', function() {
      $('.div-lottiefiles').css('display', 'block')
      setTimeout(function() {
        $('.div-lottiefiles').css('display', 'none')
      }, 2000);
    });
  })(jQuery);


});
