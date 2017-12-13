$( document ).ready(function() {
    console.log( "ready!" );

    $('.slice-title').on('click', function(e) {
      console.log($(e.target).parent().attr('data-index'));
      
    });

});
