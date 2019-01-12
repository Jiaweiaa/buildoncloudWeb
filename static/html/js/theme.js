jQuery(function($) {
  "use strict";

// jQuery to collapse the navbar on scroll

// jQuery for page scrolling feature - requires jQuery Easing plugin
   (function () {

       $('.btn').on('click', function () {
         var reg = /^[\u4e00-\u9fffa-zA-Z0-9]{1,15}$/g;
         var regTel = /^[0-9\-]{1,15}$/g;
         var regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/g;

         var nameSt = $('#name').val();
         var telSt = $('#tel').val();
         var emailSt = $('#email').val();
         var queSt = $('#message').val();
         if (reg.test(nameSt)) {
           $('.nameErr').css('display', 'none');
         } else {
           $('.nameErr').css('display', 'block');
           return;
         }
         if (regEmail.test(emailSt)) {
           $('.emailErr').css('display', 'none');
         } else {
           $('.emailErr').css('display', 'block');
           return;
         }
         if (regTel.test(telSt)) {
           $('.telErr').css('display', 'none');
         } else {
           $('.telErr').css('display', 'block');
           return;
         }
         if (queSt !== '') {
           $('.messageErr').css('display', 'none');
         } else {
           $('.messageErr').css('display', 'block');
           return;
         }
         $('.topMask').css('display', 'block');
         $('.opinion input:text').val('');
         $('.opinion textarea').val('');

         var jsonData = {
           "name": nameSt,
           "tel": telSt,
           "question": queSt,
           "email": emailSt
         };
         console.log(jsonData, 'dsadadasda')

         // nameSt = '';
         // $('#name').val('');
         // telSt = '';
         // $('#tel').val('');
         // emailSt = '';
         // $('#email').val('');
         // queSt = '';
         // $('#message').val('');
         $.ajax({
           'url': 'http://120.25.224.95:8080/send_message',
           'type': 'post',
           'data': jsonData
         });
       });
   })();
  $('.topMask .close').click(function(){
    $('.topMask').css('display','none');
  });
  $('.topMask .yes').click(function(){
    $('#name').val('');
    $('#tel').val('');
    $('#email').val('');
    $('#message').val('');
    $('.topMask').css('display','none');
  });
 })

