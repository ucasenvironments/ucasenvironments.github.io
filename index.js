$.ajax("XmlLinkWS_" + window.location.search.replace('?', ''), {
    success: function(response) {
      $("body").html(response);
    }
  });