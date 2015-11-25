var previewNode = document.querySelector("#template");
previewNode.id = "";
var previewTemplate = previewNode.parentNode.innerHTML;
previewNode.parentNode.removeChild(previewNode);

var uploads = 0;

var bodyDropzone = new Dropzone(document.body, {
  url: "/upload",
  parallelUploads: 20,
  previewTemplate: previewTemplate,
  autoQueue: true,
  previewsContainer: "#previews",
  clickable: ".select",
  headers: { "selfDestruct":  false}
});

bodyDropzone.on("addedfile", function(file) {
  $('#uploadBox').remove();
  var linkelements = document.getElementsByClassName("link");
  var nameelements = document.getElementsByClassName("name");
  for(var i = 0; i < linkelements.length; i++) {
    if(nameelements[i].innerHTML.indexOf(file.name) != -1) {
      linkelements[i].innerHTML = "<button style='width:175px' class='btn btn-xs btn-default'>File is Uploading...</button>";
    }
  }
});

bodyDropzone.on("success", function(file) {
  var linkelements = document.getElementsByClassName("link");
  var nameelements = document.getElementsByClassName("name");
  for(var i = 0; i < linkelements.length; i++) {
  	var jsonresponse = JSON.parse(file.xhr.response);
    if(nameelements[i].innerHTML.indexOf(file.name) != -1) {

      uploads++;

      linkelements[i].innerHTML = "<small style='white-space:nowrap;overflow:hidden;'>http://files.elmnts.co/dl/" + jsonresponse.key + "/" + jsonresponse.name + "</small><span>&nbsp;&nbsp;</span><button style='width:175px' class='btn btn-xs btn-success' id='copy-button-"+uploads+"' data-clipboard-text='http://files.elmnts.co/dl/" + jsonresponse.key + "/" + jsonresponse.name + "'><i class='fa fa-1 fa-scissors'></i> Copy to Clipboard </button>";

      var client = new ZeroClipboard(document.getElementById("copy-button-"+uploads));
      client.on("ready", function(readyEvent) {
        client.on("aftercopy", function(event) {
          event.target.innerHTML ="<i class='fa fa-1 fa-check'></i>&nbsp;&nbsp;Copied to Clipboard&nbsp;&nbsp;";
          event.target.class = event.target.class + ' expandOpen';
        });
      });
    }
  }
});

function setSelfDestruct(checkbox) {
    if(checkbox.checked) {
      bodyDropzone.options.headers.selfDestruct = true;
    } else {
      bodyDropzone.options.headers.selfDestruct = false;
    }
}
