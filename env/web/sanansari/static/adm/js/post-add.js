function addPostFeature(){
    $('#card-header').hide();
    $('#content-feature').html("");
}

function getCategory(){
    ret = []
    $.ajax({
        url: '/admin/category',
        method: 'get',
        async: false,
        success: function(data) {
            ret = data;
        }
    });
    return ret;
}

function dataSelectCategory(){
    $.ajax({
        url: '/admin/category',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#detail-category').append($('<option>', {
                    value: data[i]['name'],
                    text: data[i]['name']
                }));
            }
        }
    });
}

function addPostView(){
    $('#card-body').removeClass('card-body');
    $('#card').removeClass('card');
    $("#loading-upload-warga").hide();
    $("#loading-upload-kb").hide();

    document.getElementById("content-title").innerHTML = "Tulis Artikel";
    
    html = '\
    <form method="post" id="form-add-post"> \
    <div class="form-group"><input type="text" id="title" name="title" placeholder="Judul" required></div> \
    <div class="form-group"> \
    <select id="category" name="category" required> \
    <option value="" disabled selected>Pilih Kategori</option> \
    </select> \
    </div> \
    <p>Unggah Foto Sampul *opsional</p>\
    <input id="cover-image" type="file" name="datas" ><p></p>\
    <textarea id="summernote" name="content" required></textarea> \
    <hr> <button type="submit" class="btn btn-success btn-sm"> \
    <span class="fa fa-check"></span> Terbitkan </button> \
    </form>';
    $('#content').html(html);
    $('#summernote').summernote();

    $.ajax({
        url: '/admin/category',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#category').append($('<option>', {
                    value: data[i]['name'],
                    text: data[i]['name']
                }));
            }
        }
    });

    $('#form-add-post').on('submit', function (event) {
        event.preventDefault();
        var fd = new FormData(); 
        var files = $('#cover-image').get(0).files

        if (files.length > 1) {
            alert('Unggah maksimal 1 foto');
            return false;
        }else if (files.length == 0){
            fd.append('img', "default");
        }else if (files.length == 1){
            fd.append('img', files[0], files[0].name);
        }

        fd.append('title', $("#title").val() );
        fd.append('category', $("#category").val() );
        fd.append('content', $("#summernote").val() );

        $.ajax({
            url: '/admin/post',
            method: 'post',
            data: fd,
            processData: false,
            contentType: false,
            success: function(data) {
                if(data['status']){
                    toastr.success(data['message'], 'Sukses');
                    initPostList()
                }else{
                    toastr.error(data['message'], 'Galat');
                }
            }
        });
    });
}