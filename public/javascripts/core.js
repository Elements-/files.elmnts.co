document.addEventListener("DOMContentLoaded", function(event) {
  var uploads = 0;

  var bodyDropzone = new Dropzone(document.body, {
    url: "/upload",
    parallelUploads: 20,
    autoQueue: true,
    previewsContainer: '#uploadsArea',
    previewTemplate: $('#template').html(),
    clickable: '#browseButton',
    headers: { "selfDestruct":  false}
  });

  $('#template').remove();

  var flip = true;
  $('.onoffswitch').click(function(event) {
    if(flip) {
      bodyDropzone.options.headers.selfDestruct = !bodyDropzone.options.headers.selfDestruct;
      flip = false;
    } else {
      flip = true;
    }
  });

  bodyDropzone.on("addedfile", function(file) {
    $('#dragdropbox').remove();
  });

  bodyDropzone.on("uploadprogress", function(file, progress, bytesSent) {

  });

  bodyDropzone.on("sending", function(file) {
    var fileTypes = {
      'fa-file-picture-o' : ['png','jpeg','gif','jpg','bmp','psd','tif','tiff','dds'],
      'fa-file-archive-o' : ['7z','gz','tar','rar','zip','zipx'],
      'fa-file-code-o' : ['java','cpp','js','class','c','lua','py','cs','sh','swift','h','html','php','css','xml'],
      'fa-file-text-o' : ['txt','docx','doc','wps'],
      'fa-file-video-o' : ['mp4','wmv','mov','mpg','wmv','flv','aep'],
      'fa-file-audio-o' : ['mp3','wav','m4a','mid','wma','aif']
    }
    var extension = file.name.substring(file.name.lastIndexOf('.')+1);
    var added = false;
    for(icon in fileTypes) {
      for(extensionIndex in fileTypes[icon]) {
        if(fileTypes[icon][extensionIndex] == extension) {
          $('.fileTypeIcon').last().addClass(icon);
          added = true;
          break;
        }
      }
    }
    if(!added) {
      $('.fileTypeIcon').last().addClass('fa-file-o');
    }
  });

  bodyDropzone.on("success", function(file) {
    uploads++;
    var jsonresponse = JSON.parse(file.xhr.response);
    var url = "http://files.elmnts.co/dl/" + jsonresponse.key + "/" + jsonresponse.name;

    var linkelements = document.getElementsByClassName("linkText");
    var nameelements = document.getElementsByClassName("fileName");

    for(var i = 0; i < linkelements.length; i++) {
      if(nameelements[i].innerHTML.indexOf(file.name) != -1) {
        linkelements[i].innerHTML = url;
      }
    }

    $('.copyButton').each(function(i) {
      if($('.fileName')[i].innerHTML.indexOf(file.name) != -1) {

        $('.copyButton')[i].innerHTML = '<span><i class="fa fa-scissors"></i></span><span><small>&nbsp;&nbsp;COPY TO CLIPBOARD</small></span>';
        $('.copyButton')[i].id = 'copy-button-' + uploads;
        $("#copy-button-"+uploads).attr('data-clipboard-text', url);

        var client = new ZeroClipboard($("#copy-button-"+uploads));
        client.on("ready", function(readyEvent) {
          client.on("aftercopy", function(event) {
            $('.copyButton')[i].innerHTML = '<span><i class="fa fa-check"></i></span><span><small>&nbsp;&nbsp;COPIED TO CLIPBOARD</small></span>';
            setTimeout(function() {
                $('.copyButton')[i].innerHTML = '<span><i class="fa fa-scissors"></i></span><span><small>&nbsp;&nbsp;COPY TO CLIPBOARD</small></span>';
            }, 3000);
          });
        });
      }
    });
  });
});
