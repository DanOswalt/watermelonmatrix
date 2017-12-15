$( document ).ready(function() {
    console.log( "ready!" );

    $('.slice-title').on('click', function(e) {
      // console.log($(e.target).parent().attr('data-index'));
      $(e.target).next().toggle();
    });

    $('.slice-item-title').on('click', function(e) {
      $(e.target).next().toggle();
    })

});
