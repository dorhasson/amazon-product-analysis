$(document).ready(function() {

  // $(function() {
  //   $(".btn-ajax").on("click", function () {
  //     $.ajax({
  //       type: 'GET',
  //       url: '/system',
  //       success: function() {
  //          var html = $('#ajax-meth');
  //             // html += 
  //         $('#ajax-meth').html(html);
  //       }
  //     });
  //   });
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
