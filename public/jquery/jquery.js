$(document).ready(function() {

  $('.roi').each(function() {
    var amount = $('.roi').html();
    if (amount < 10) {
      $(this).css('color', '#f00');
    } else {
      $(this).css('color', '#00b300');
    }
  });

  $('.roi').each(function() {
    var amount = $('.roi').html();
    if (amount < 10) {
      $('.red-per').css('display', 'block');
    } else {
      $('.red-per').css('display', 'none');
    }
  });

  $('.roi').each(function() {
    var amount = $('.roi').html();
    if (amount < 10) {
      $('.red-per-i').css('display', 'block');
    } else {
      $('.red-per-i').css('display', 'none');
    }
  });

  $('.roi').each(function() {
    var amount = $('.roi').html();
    if (amount > 10) {
      $('.green-per').css('display', 'block');
    } else {
      $('.green-per').css('display', 'none');
    }
  });

  $('.roi').each(function() {
    var amount = $('.roi').html();
    if (amount > 10) {
      $('.green-per-i').css('display', 'block');
    } else {
      $('.green-per-i').css('display', 'none');
    }
  });


  (function($) {
    $('.btn-primary').on('click', function() {
      $('.div-lottiefiles').css('display', 'block')
      setTimeout(function() {
        $('.div-lottiefiles').css('display', 'none')
      }, 2000);
    });
  })(jQuery);


});
