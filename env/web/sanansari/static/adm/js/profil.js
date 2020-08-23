function profilFeature(){
    $('#card-header').hide();
    $('#content-feature').html("");
}

function profilView(){
    $('#card-body').removeClass('card-body');
    $('#card').removeClass('card');

    document.getElementById("content-title").innerHTML = "Profil";
    
    html = '\
    <form method="post" id="form-add-profil"> \
    <h5>Profil Dusun Sanansari</h5>\
    <textarea id="summernote_profil" name="content" required></textarea> \
    <br>\
    <h5>Sejarah Dusun Sanansari</h5>\
    <textarea id="summernote_sejarah" name="content" required></textarea> \
    <br>\
    <h5>Profil Kampung KB Sanansari</h5>\
    <textarea id="summernote_profil_kb" name="content" required></textarea> \
    <br>\
    <h5>Struktur Badan Pengurus</h5>\
    <textarea id="summernote_struktur_kb" name="content" required></textarea> \
    <hr> <button type="submit" class="btn btn-success btn-sm"> \
    <span class="fa fa-check"></span> Simpan </button> \
    </form>';
    $('#content').html(html);

    $('#summernote_profil').summernote();
    $('#summernote_sejarah').summernote();
    $('#summernote_profil_kb').summernote();
    $('#summernote_struktur_kb').summernote();

    $.ajax({
        url: '/admin/profile',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            $('#summernote_profil').summernote('code', data['profil']);
            $('#summernote_sejarah').summernote('code', data['sejarah']);
            $('#summernote_profil_kb').summernote('code', data['profil_kb']);
            $('#summernote_struktur_kb').summernote('code', data['struktur_kb']);
        }
    });

    $('#form-add-profil').on('submit', function (event) {
        event.preventDefault();
        var fd = new FormData(); 

        data = {
            'profil' : $("#summernote_profil").val(),
            'sejarah' : $("#summernote_sejarah").val(),
            'profil_kb' : $("#summernote_profil_kb").val(),
            'struktur_kb' : $("#summernote_struktur_kb").val()
        }

        $.ajax({
            url: '/admin/profile',
            method: 'put',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function(data) {
                if(data['status']){
                    toastr.success("Data Berhasil Diperbaharui", 'Sukses');
                    initProfil()
                }else{
                    toastr.error("!", 'Galat');
                }
            }
        });
    });
}