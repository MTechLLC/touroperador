(function ($, Drupal) {
  Drupal.behaviors.custom_theme_base = {
    attach: function (context, settings) {
      $('.language-switch .en a').click(function () {
        alert("Hola");
      });
    }
  };
})(jQuery, Drupal);
